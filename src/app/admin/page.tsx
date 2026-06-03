import AdminHeader from "@/components/AdminHeader";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/units";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [totalProducts, totalOrders, pendingOrders, products, orders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.findMany({ where: { isActive: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true },
      }),
    ]);

  const inventoryValue = products.reduce((sum, product) => {
    return sum + Number(product.stockBaseQty) * Number(product.pricePerBaseQty);
  }, 0);

  return (
    <main className="app-shell">
      <AdminHeader />

      <section className="app-container">
        <h2 className="page-heading">Dashboard</h2>
        <p className="page-subtitle">
          Overview of inventory, orders, and pending quotations.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <div className="stat-panel">
            <p className="text-sm font-semibold text-slate-500">Total Products</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{totalProducts}</p>
          </div>

          <div className="stat-panel">
            <p className="text-sm font-semibold text-slate-500">Total Orders</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{totalOrders}</p>
          </div>

          <div className="stat-panel">
            <p className="text-sm font-semibold text-slate-500">Pending Orders</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{pendingOrders}</p>
          </div>

          <div className="stat-panel">
            <p className="text-sm font-semibold text-slate-500">Inventory Value</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950">
              {formatINR(inventoryValue)}
            </p>
          </div>
        </div>

        <div className="panel mt-8 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-950">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-bold text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-3 py-2">#{order.id.slice(0, 8)}</td>
                    <td className="px-3 py-2">{order.user.email}</td>
                    <td className="px-3 py-2">
                      {formatINR(order.totalAmount.toString())}
                    </td>
                    <td className="px-3 py-2">{order.status}</td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
