"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { signup } from "@/lib/auth/client";

function SignupForm() {
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
      const res = await signup(email.trim(), password);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.detail || "Signup failed");
      }
      router.push(next);
    } catch (e: any) {
      setErr(e?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Create your DeltaAlpha account"
      subtitle="Public node onboarding — governed by Whalez policies."
      footer={
        <span>
          Already have an account?{" "}
          <Link className="underline hover:text-zinc-200" href={`/login?next=${encodeURIComponent(next)}`}>
            Log in
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
          <p className="mt-1 text-xs text-zinc-500">
            Minimum 8 chars recommended. MFA will be added in the next milestone.
          </p>
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
          {busy ? "Creating..." : "Sign up"}
        </button>

        <p className="text-xs text-zinc-500">
          By creating an account you agree to the Terms. Execution remains gated by governance & legal triggers.
        </p>
      </form>
    </AuthCard>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
