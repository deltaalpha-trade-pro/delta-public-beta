"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { login } from "@/lib/auth/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const rawNext = sp.get("next") || "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\") ? rawNext : "/dashboard";
    rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\\\")
      ? rawNext
      : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const detail = j?.detail || j?.error || "Login failed";
        if (detail === "email_verification_required") {
          router.push("/verify-email?email=" + encodeURIComponent(email.trim()));
          return;
        }
        if (detail === "beta_access_not_approved") {
          throw new Error("This email does not currently have Founder-approved Beta Access. Submit a request first.");
        }
        if (detail === "invalid_credentials") throw new Error("Email or password is incorrect.");
        if (detail === "too_many_login_attempts") throw new Error("Too many failed attempts. Wait 15 minutes before trying again.");
        throw new Error(detail);
      }
      router.push(next);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Login failed");
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
          <Link className="underline hover:text-zinc-200" href={"/signup?next=" + encodeURIComponent(next)}>
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400" htmlFor="login-email">Email</label>
          <input
            id="login-email"
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
          <label className="text-xs text-zinc-400" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={1024}
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
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
          {busy ? "Signing in..." : "Login"}
        </button>

        <div className="text-xs text-zinc-500 flex justify-between">
          <span>Account sessions are handled by the identity authority; demo sessions are simulation-only.</span>
          <Link className="underline hover:text-zinc-200" href="/">
            Public
          </Link>
        </div>
        <p className="text-xs text-zinc-500">
          Need Beta Access first?{" "}
          <Link className="underline hover:text-zinc-200" href="/beta-access">Request Founder review</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
