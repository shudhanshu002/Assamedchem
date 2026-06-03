import AdminHeader from '@/components/AdminHeader';
import { prisma } from '@/lib/prisma';
import { formatINR } from '@/lib/units';
import OrderStatusActions from '@/components/OrderStatusActions';
import StatusBadge from '@/components/StatusBadge';
import type { DecimalLike, Dimension, OrderStatus, Unit } from '@/lib/domain';

export const dynamic = 'force-dynamic';

type AdminOrderItem = {
    id: string;
    orderQty: DecimalLike;
    orderUnit: Unit;
    baseQty: DecimalLike;
    pricePerBaseQty: DecimalLike;
    lineTotal: DecimalLike;
    product: {
        name: string;
        sku: string;
        dimension: Dimension;
        baseUnit: Unit;
    };
};

type AdminOrder = {
    id: string;
    status: OrderStatus;
    totalAmount: DecimalLike;
    createdAt: Date;
    user: {
        name: string | null;
        email: string;
    };
    items: AdminOrderItem[];
};

export default async function AdminOrdersPage() {
    const orders: AdminOrder[] = await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="app-shell">
            <AdminHeader />

            <section className="app-container">
                <h2 className="page-heading">Incoming Orders</h2>
                <p className="page-subtitle">Admin view of quotations/orders with original units, converted base quantities, and INR pricing.</p>

                <div className="mt-6 space-y-5">
                    {orders.map((order: AdminOrder) => (
                        <div key={order.id} className="panel p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-bold text-slate-950">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-slate-600">
                                        Placed by {order.user.name} ({order.user.email})
                                    </p>
                                    <p className="text-xs font-semibold text-slate-500">{order.createdAt.toLocaleString()}</p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-lg font-extrabold text-slate-950">{formatINR(order.totalAmount.toString())}</p>
                                    <div className="mt-1 flex sm:justify-end">
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
                                <table className="data-table min-w-[760px]">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2">Product</th>
                                            <th className="px-3 py-2">Dimension</th>
                                            <th className="px-3 py-2">Ordered Qty</th>
                                            <th className="px-3 py-2">Converted Base Qty</th>
                                            <th className="px-3 py-2">Rate</th>
                                            <th className="px-3 py-2">Line Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {order.items.map((item: AdminOrderItem) => (
                                            <tr key={item.id}>
                                                <td className="px-3 py-2">
                                                    <div className="font-bold text-slate-950">{item.product.name}</div>
                                                    <div className="text-xs text-slate-500">SKU: {item.product.sku}</div>
                                                </td>
                                                <td className="px-3 py-2">{item.product.dimension}</td>
                                                <td className="px-3 py-2">
                                                    {item.orderQty.toString()} {item.orderUnit}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.baseQty.toString()} {item.product.baseUnit}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {formatINR(item.pricePerBaseQty.toString())}/{item.product.baseUnit}
                                                </td>
                                                <td className="px-3 py-2">{formatINR(item.lineTotal.toString())}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <OrderStatusActions orderId={order.id} currentStatus={order.status} />
                            </div>

                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                                Conversion proof: ordered quantity is stored separately from converted base quantity, so admin can verify pricing.
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && <div className="panel p-8 text-center text-slate-500">No incoming orders yet.</div>}
                </div>
            </section>
        </main>
    );
}
