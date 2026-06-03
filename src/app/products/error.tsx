"use client";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="app-shell flex items-center justify-center px-4">
      <div className="panel max-w-md p-6 text-center">
        <h2 className="text-lg font-extrabold text-rose-700">
          Failed to load products
        </h2>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>

        <button
          onClick={reset}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
