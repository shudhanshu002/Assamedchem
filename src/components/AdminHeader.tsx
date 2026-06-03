import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-slate-950">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-500">Inventory and orders</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/admin">
            Dashboard
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/admin/products">
            Products
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/admin/orders">
            Orders
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
