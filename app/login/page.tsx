"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { login, readAuthError } from "@/lib/auth/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";
  const registered = sp.get("registered") === "1";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.ok) {
        throw new Error(await readAuthError(res, "Unable to sign in. Please check your details and try again."));
      }
      router.push(next);
    } catch (e: any) {
      const message = typeof e?.message === "string" ? e.message.trim() : "";
      setErr(
        message && message.length <= 240 && !/<!doctype|<html|<head|<body|<script|<style|cloudflare/i.test(message)
          ? message
          : "Unable to sign in right now. Please try again shortly.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Log in"
      subtitle="Access your account and permitted platform features."
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
        {registered ? (
          <div role="status" className="rounded-md border border-blue-900 bg-blue-950/30 px-3 py-2 text-sm text-blue-100">
            Your account request was accepted. Check your inbox for the next account-verification step. Real-money features remain unavailable until the required verification and eligibility checks are complete.
          </div>
        ) : null}

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
            autoComplete="current-password"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
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
          {busy ? "Signing in..." : "Log in"}
        </button>
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
