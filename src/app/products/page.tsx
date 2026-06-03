import UserHeader from "@/components/UserHeader";
import ProductOrderCard from "@/components/ProductOrderCard";
import { prisma } from "@/lib/prisma";
import type { DecimalLike, Dimension, Unit } from "@/lib/domain";

type Props = {
  searchParams: Promise<{
    search?: string;
    dimension?: string;
  }>;
};

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  dimension: Dimension;
  baseUnit: Unit;
  stockBaseQty: DecimalLike;
  pricePerBaseQty: DecimalLike;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const dimension = params.dimension || "";

  const products: ProductRow[] = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(dimension
        ? {
            dimension: dimension as Dimension,
          }
        : {}),
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="app-shell">
      <UserHeader />

      <section className="app-container">
        <h2 className="page-heading">Browse Products</h2>
        <p className="page-subtitle">
          Search and filter products, choose flexible units, and place orders.
        </p>

        <form className="panel mt-6 grid gap-3 p-4 md:grid-cols-[1fr_220px_auto]">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by product name or SKU"
            className="field"
          />

          <select
            name="dimension"
            defaultValue={dimension}
            className="field"
          >
            <option value="">All Dimensions</option>
            <option value="WEIGHT">Weight</option>
            <option value="VOLUME">Volume</option>
            <option value="COUNT">Count</option>
          </select>

          <button className="btn-primary">
            Apply
          </button>
        </form>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: ProductRow) => (
            <ProductOrderCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                sku: product.sku,
                description: product.description,
                dimension: product.dimension,
                baseUnit: product.baseUnit,
                stockBaseQty: product.stockBaseQty.toString(),
                pricePerBaseQty: product.pricePerBaseQty.toString(),
              }}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="panel mt-8 p-8 text-center text-slate-500">
            No products found.
          </div>
        )}
      </section>
    </main>
  );
}
