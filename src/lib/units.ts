import { Dimension, Unit } from "@prisma/client";
import Decimal from "decimal.js";

export function toBaseQuantity(quantity: string | number, unit: Unit) {
  const qty = new Decimal(quantity);

  switch (unit) {
    case "KG":
      return qty.mul(1000);
    case "G":
      return qty;
    case "L":
      return qty.mul(1000);
    case "ML":
      return qty;
    case "UNIT":
      return qty;
    default:
      throw new Error("Invalid unit");
  }
}

export function getAllowedUnits(dimension: Dimension): Unit[] {
  if (dimension === "WEIGHT") return ["G", "KG"];
  if (dimension === "VOLUME") return ["ML", "L"];
  return ["UNIT"];
}

export function formatINR(value: string | number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}