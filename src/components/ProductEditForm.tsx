"use client";

import { Dimension, Unit } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ProductData = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  dimension: Dimension;
  baseUnit: Unit;
  stockBaseQty: string;
  pricePerBaseQty: string;
  isActive: boolean;
};

export default function ProductEditForm({ product }: { product: ProductData }) {
  const router = useRouter();

  const [dimension, setDimension] = useState<Dimension>(product.dimension);
  const [loading, setLoading] = useState(false);

  const baseUnitOptions =
    dimension === "WEIGHT"
      ? ["G"]
      : dimension === "VOLUME"
      ? ["ML"]
      : ["UNIT"];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description"),
      dimension: formData.get("dimension"),
      baseUnit: formData.get("baseUnit"),
      stockBaseQty: formData.get("stockBaseQty"),
      pricePerBaseQty: formData.get("pricePerBaseQty"),
      isActive: true,
    };

    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      alert("Failed to update product");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel mt-6 p-5"
    >
      <div className="grid gap-4">
        <input
          name="name"
          required
          defaultValue={product.name}
          className="field"
        />

        <input
          name="sku"
          required
          defaultValue={product.sku}
          className="field"
        />

        <input
          name="description"
          defaultValue={product.description || ""}
          className="field"
        />

        <select
          name="dimension"
          value={dimension}
          onChange={(e) => setDimension(e.target.value as Dimension)}
          className="field"
        >
          <option value="WEIGHT">Weight</option>
          <option value="VOLUME">Volume</option>
          <option value="COUNT">Count</option>
        </select>

        <select
          name="baseUnit"
          defaultValue={product.baseUnit}
          className="field"
        >
          {baseUnitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <input
          name="stockBaseQty"
          required
          type="number"
          step="0.000001"
          defaultValue={product.stockBaseQty}
          className="field"
        />

        <input
          name="pricePerBaseQty"
          required
          type="number"
          step="0.000001"
          defaultValue={product.pricePerBaseQty}
          className="field"
        />
      </div>

      <div className="mt-5 flex gap-3">
        <button
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
