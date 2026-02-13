"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { login } from "@/lib/auth/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.detail || "Login failed");
      }
      router.push(next);
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Log in"
      subtitle="Access your governed dashboard."
      footer={
        <span>
          New here?{" "}
          <Link className="underline hover:text-zinc-200" href={`/signup?next=${encodeURIComponent(next)}`}>
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {err ? (
          <div className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        <button
          disabled={busy}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-3 py-2 font-medium"
        >
          {busy ? "Signing in..." : "Login"}
        </button>

        <div className="text-xs text-zinc-500 flex justify-between">
          <span>Demo mode accepts any email + password.</span>
          <Link className="underline hover:text-zinc-200" href="/">
            Public
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
