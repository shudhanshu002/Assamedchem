"use client";

import { useRouter } from "next/navigation";

export default function ProductDeleteButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="btn-danger"
    >
      Delete
    </button>
  );
}
