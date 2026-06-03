import AdminHeader from '@/components/AdminHeader';
import ProductCreateForm from '@/components/ProductCreateForm';
import ProductDeleteButton from '@/components/ProductDeleteButton';
import { prisma } from '@/lib/prisma';
import { formatINR } from '@/lib/units';
import type { DecimalLike, Dimension, Unit } from '@/lib/domain';
import Link from 'next/link';

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

export default async function AdminProductsPage() {
    const products: ProductRow[] = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="app-shell">
            <AdminHeader />

            <section className="app-container">
                <div className="mb-6">
                    <h2 className="page-heading">Products</h2>
                    <p className="page-subtitle">Create products, configure base units, inventory, and INR base price.</p>
                </div>

                <ProductCreateForm />

                <div className="panel mt-8 overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Dimension</th>
                                <th className="px-4 py-3">Base Unit</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Price/Base Unit</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product: ProductRow) => (
                                <tr key={product.id}>
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-slate-950">{product.name}</div>
                                        <div className="text-xs text-slate-500">{product.description}</div>
                                    </td>
                                    <td className="px-4 py-3">{product.sku}</td>
                                    <td className="px-4 py-3">{product.dimension}</td>
                                    <td className="px-4 py-3">{product.baseUnit}</td>
                                    <td className="px-4 py-3">
                                        {product.stockBaseQty.toString()} {product.baseUnit}
                                    </td>
                                    <td className="px-4 py-3">{formatINR(product.pricePerBaseQty.toString())}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100">
                                                Edit
                                            </Link>

                                            <ProductDeleteButton productId={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
