import UserHeader from '@/components/UserHeader';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { formatINR } from '@/lib/units';
import StatusBadge from '@/components/StatusBadge';
import type { DecimalLike, OrderStatus, Unit } from '@/lib/domain';

type UserOrderItem = {
    id: string;
    orderQty: DecimalLike;
    orderUnit: Unit;
    baseQty: DecimalLike;
    pricePerBaseQty: DecimalLike;
    lineTotal: DecimalLike;
    product: {
        name: string;
        baseUnit: Unit;
    };
};

type UserOrder = {
    id: string;
    status: OrderStatus;
    totalAmount: DecimalLike;
    createdAt: Date;
    items: UserOrderItem[];
};

export default async function UserOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect('/login');

    const orders: UserOrder[] = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
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
            <UserHeader />

            <section className="app-container">
                <h2 className="page-heading">My Orders</h2>
                <p className="page-subtitle">Your placed quotations/orders with conversion and pricing details.</p>

                <div className="mt-6 space-y-5">
                    {orders.map((order: UserOrder) => (
                        <div key={order.id} className="panel p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-bold text-slate-950">Order #{order.id.slice(0, 8)}</p>
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
                                <table className="data-table min-w-[680px]">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2">Product</th>
                                            <th className="px-3 py-2">Ordered</th>
                                            <th className="px-3 py-2">Base Qty</th>
                                            <th className="px-3 py-2">Rate</th>
                                            <th className="px-3 py-2">Line Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {order.items.map((item: UserOrderItem) => (
                                            <tr key={item.id}>
                                                <td className="px-3 py-2">{item.product.name}</td>
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
                        </div>
                    ))}

                    {orders.length === 0 && <div className="panel p-8 text-center text-slate-500">No orders placed yet.</div>}
                </div>
            </section>
        </main>
    );
}
