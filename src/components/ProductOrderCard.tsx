"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  Dimension,
  Unit,
  formatINR,
  getAllowedUnits,
  toBaseQuantity,
} from "@/lib/units";

type ProductCardData = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  dimension: Dimension;
  baseUnit: Unit;
  stockBaseQty: string;
  pricePerBaseQty: string;
};

export default function ProductOrderCard({
  product,
}: {
  product: ProductCardData;
}) {
  const router = useRouter();

  const allowedUnits = getAllowedUnits(product.dimension);

  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<Unit>(allowedUnits[0]);
  const [loading, setLoading] = useState(false);

  const calculation = useMemo(() => {
    try {
      const baseQty = toBaseQuantity(quantity || "0", unit);
      const lineTotal = baseQty.mul(product.pricePerBaseQty);

      return {
        baseQty: baseQty.toString(),
        total: lineTotal.toString(),
      };
    } catch {
      return {
        baseQty: "0",
        total: "0",
      };
    }
  }, [quantity, unit, product.pricePerBaseQty]);

  async function handleOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (Number(quantity) <= 0) {
      alert("Quantity must be greater than zero");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            productId: product.id,
            quantity,
            unit,
          },
        ],
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Order/quotation placed successfully");
      router.push("/orders");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to place order");
    }
  }

  return (
    <div className="panel flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{product.name}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            SKU: {product.sku}
          </p>
        </div>

        <span className="soft-badge">
          {product.dimension}
        </span>
      </div>

      <p className="mt-3 min-h-10 text-sm leading-6 text-slate-600">
        {product.description || "No description"}
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p>
          <strong>Stock:</strong> {product.stockBaseQty} {product.baseUnit}
        </p>
        <p>
          <strong>Rate:</strong> {formatINR(product.pricePerBaseQty)} /{" "}
          {product.baseUnit}
        </p>
      </div>

      <form onSubmit={handleOrder} className="mt-auto space-y-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="0.000001"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="field"
            placeholder="Quantity"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="field"
          >
            {allowedUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-700">
          <p>
            <strong>Converted Qty:</strong> {calculation.baseQty}{" "}
            {product.baseUnit}
          </p>
          <p>
            <strong>Total:</strong> {formatINR(calculation.total)}
          </p>
        </div>

        <button
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Placing..." : "Place Quotation / Order"}
        </button>
      </form>
    </div>
  );
}
