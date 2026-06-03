import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="app-shell flex items-center justify-center px-4">
      <div className="panel max-w-md p-6 text-center">
        <h1 className="text-2xl font-extrabold text-slate-950">404</h1>
        <p className="mt-2 text-sm text-slate-600">Page not found.</p>

        <Link
          href="/"
          className="btn-primary mt-4"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
