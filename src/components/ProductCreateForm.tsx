"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProductCreateForm() {
  const router = useRouter();

  const [dimension, setDimension] = useState("WEIGHT");
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

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description"),
      dimension: formData.get("dimension"),
      baseUnit: formData.get("baseUnit"),
      stockBaseQty: formData.get("stockBaseQty"),
      pricePerBaseQty: formData.get("pricePerBaseQty"),
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      form.reset();
      router.refresh();
    } else {
      alert("Failed to create product");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel p-5"
    >
      <div className="mb-5">
        <h3 className="font-bold text-slate-950">Create Product</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add inventory with a base unit and price.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          name="name"
          required
          placeholder="Product name"
          className="field"
        />

        <input
          name="sku"
          required
          placeholder="SKU"
          className="field"
        />

        <input
          name="description"
          placeholder="Description"
          className="field"
        />

        <select
          name="dimension"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
          className="field"
        >
          <option value="WEIGHT">Weight</option>
          <option value="VOLUME">Volume</option>
          <option value="COUNT">Count</option>
        </select>

        <select name="baseUnit" className="field">
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
          placeholder="Stock in base unit"
          className="field"
        />

        <input
          name="pricePerBaseQty"
          required
          type="number"
          step="0.000001"
          placeholder="Price per base unit INR"
          className="field"
        />
      </div>

      <button
        disabled={loading}
        className="btn-primary mt-5 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
