"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { readAuthError, resendVerification, verifyEmail } from "@/lib/auth/client";

function VerifyForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState(sp.get("email") || "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const token = sp.get("token") || "";
  const next = sp.get("next") || "/dashboard";

  async function complete(payload: { email?: string; code?: string; token?: string }) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await verifyEmail(payload);
      if (!res.ok) {
        throw new Error(await readAuthError(res, "We could not verify this account."));
      }
      router.push("/login?verified=1&next=" + encodeURIComponent(next));
    } catch (e: any) {
      setError(
        typeof e?.message === "string"
          ? e.message
          : "We could not verify this account.",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (token) void complete({ email: email || undefined, token });
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !code.trim()) {
      setError("Enter the email address and six-digit verification code from your email.");
      return;
    }
    await complete({
      email: email.trim(),
      code: code.trim(),
    });
  }

  async function resend() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setResending(true);
    setError(null);
    try {
      const res = await resendVerification(email.trim());
      if (!res.ok) {
        throw new Error(
          await readAuthError(res, "We could not resend the verification email."),
        );
      }
      setMessage("A new verification message has been requested. Check your inbox.");
    } catch (e: any) {
      setError(
        typeof e?.message === "string"
          ? e.message
          : "We could not resend the verification email.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Complete email verification before signing in. Verification does not grant real-money access."
      footer={
        <span>
          Already verified?{" "}
          <Link
            className="underline hover:text-zinc-200"
            href={"/login?next=" + encodeURIComponent(next)}
          >
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
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
          <label className="text-xs text-zinc-400">Verification code</label>
          <input
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600 tracking-[0.35em]"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
          />
          <p className="mt-1 text-xs text-zinc-500">
            A one-time verification link is also accepted from the email.
          </p>
        </div>

        {message ? (
          <div
            role="status"
            className="rounded-md border border-emerald-900 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100"
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </div>
        ) : null}

        <button
          disabled={busy}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-3 py-2 font-medium"
        >
          {busy ? "Verifying..." : "Verify email"}
        </button>

        <button
          type="button"
          disabled={resending}
          onClick={resend}
          className="w-full rounded-md border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500 disabled:opacity-60"
        >
          {resending ? "Requesting..." : "Resend verification email"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
