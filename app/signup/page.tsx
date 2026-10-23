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
  const rawNext = sp.get("next") || "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/\\\\")
      ? rawNext
      : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await signup(email.trim(), password);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.detail || j?.error || "Signup failed");
      }
      router.push(next);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Create your DeltaAlpha account"
      subtitle="Account identity is handled by the configured Whalez-AI identity authority."
      footer={
        <span>
          Already have an account?{" "}
          <Link className="underline hover:text-zinc-200" href={"/login?next=" + encodeURIComponent(next)}>
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400" htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={1024}
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Use at least 8 characters. Authentication and credential storage remain the identity service’s responsibility.
          </p>
        </div>

        {err ? (
          <div role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
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
          Creating an account does not itself grant approved beta entitlement or authorize financial execution. Access remains subject to Founder review, verification, and governance.
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
