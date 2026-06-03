"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="app-shell flex items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-6">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-700 text-lg font-black text-white">
            IM
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950">
          Inventory Management
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Login as Admin or User to continue.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p>
            <strong>Admin:</strong> admin@test.com / admin123
          </p>
          <p>
            <strong>User:</strong> user@test.com / user123
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input
              className="field mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Password
            </label>
            <input
              className="field mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setEmail("admin@test.com");
              setPassword("admin123");
            }}
            className="btn-secondary flex-1"
          >
            Use Admin
          </button>

          <button
            onClick={() => {
              setEmail("user@test.com");
              setPassword("user123");
            }}
            className="btn-secondary flex-1"
          >
            Use User
          </button>
        </div>
      </div>
    </main>
  );
}
