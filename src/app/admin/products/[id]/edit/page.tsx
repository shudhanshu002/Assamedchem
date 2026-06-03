import AdminHeader from "@/components/AdminHeader";
import ProductEditForm from "@/components/ProductEditForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <main className="app-shell">
      <AdminHeader />

      <section className="app-container max-w-3xl">
        <h2 className="page-heading">Edit Product</h2>
        <p className="page-subtitle">
          Update product inventory, base unit, and pricing.
        </p>

        <ProductEditForm
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            description: product.description,
            dimension: product.dimension,
            baseUnit: product.baseUnit,
            stockBaseQty: product.stockBaseQty.toString(),
            pricePerBaseQty: product.pricePerBaseQty.toString(),
            isActive: product.isActive,
          }}
        />
      </section>
    </main>
  );
}
