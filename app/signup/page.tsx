"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { signup, readAuthError } from "@/lib/auth/client";

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
        throw new Error(await readAuthError(res, "Unable to create your account. Please try again."));
      }
      // Registration is not authentication. Continue to login instead of
      // redirecting to a protected page without a verified session.
      router.push(`/login?registered=1&next=${encodeURIComponent(next)}`);
    } catch (e: any) {
      const message = typeof e?.message === "string" ? e.message.trim() : "";
      setErr(
        message && message.length <= 240 && !/<!doctype|<html|<head|<body|<script|<style|cloudflare/i.test(message)
          ? message
          : "Unable to create your account right now. Please try again shortly.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Create your DeltaAlpha account"
      subtitle="Create your account to access permitted simulation features and your account profile."
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
            autoComplete="email"
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
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <p className="mt-1 text-xs text-zinc-500">Use at least 8 characters.</p>
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
          {busy ? "Creating..." : "Create account"}
        </button>

        <p className="text-xs text-zinc-500">
          Creating an account does not verify your identity or authorize real-money activity. Those permissions are handled separately.
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
