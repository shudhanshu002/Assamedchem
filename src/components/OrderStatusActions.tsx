"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/lib/domain";

export default function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isFinal = currentStatus !== "PENDING";

  async function updateStatus(status: OrderStatus) {
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update order status");
    }
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading || isFinal}
        onClick={() => updateStatus("APPROVED")}
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
      >
        Approve
      </button>

      <button
        disabled={loading || isFinal}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
