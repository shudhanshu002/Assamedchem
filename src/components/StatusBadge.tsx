import { OrderStatus } from "@prisma/client";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const className =
    status === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "REJECTED"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}
