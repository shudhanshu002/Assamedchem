"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn-secondary min-h-0 px-3 py-2"
    >
      Logout
    </button>
  );
}
