"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

function VerifyEmailForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState(sp.get("email") || "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = data?.detail || data?.error || "Email verification failed.";
        if (detail === "invalid_or_expired_verification_code") {
          throw new Error("That code is invalid or expired. Request a new code and try again.");
        }
        if (detail === "beta_access_not_approved") {
          throw new Error("Founder approval is still required before the account can be activated.");
        }
        throw new Error(detail);
      }
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Email verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.detail || data?.error || "Could not request a new code.");
      if (data?.email_sent === true) {
        setNotice("The mail provider accepted a verification email request. Check your inbox and spam folder; delivery is not guaranteed until confirmed by the provider.");
      } else {
        setNotice(data?.message || "The request was accepted. If an account is awaiting verification, a new code can be sent when mail delivery is available.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not request a new code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Enter the six-digit code sent by Whalez-Mail to the approved email address."
      footer={
        <span>
          Return to <Link className="underline hover:text-zinc-200" href="/login">log in</Link>
          {" · "}
          <Link className="underline hover:text-zinc-200" href="/beta-access">Beta Access</Link>
        </span>
      }
    >
      <form onSubmit={verify} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400" htmlFor="verify-email">Email address</label>
          <input
            id="verify-email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@domain.com"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400" htmlFor="verify-code">Six-digit code</label>
          <input
            id="verify-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            required
            className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 tracking-[0.35em] outline-none focus:border-zinc-600"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
          />
        </div>

        {error ? (
          <div role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div role="status" className="rounded-md border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200">
            {notice}
          </div>
        ) : null}

        <button disabled={busy} className="w-full rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-3 py-2 font-medium">
          {busy ? "Verifying..." : "Verify email and continue"}
        </button>
        <button
          type="button"
          disabled={resending || !email.trim()}
          onClick={resend}
          className="w-full rounded-md border border-zinc-700 hover:bg-zinc-900 disabled:opacity-60 px-3 py-2 font-medium"
        >
          {resending ? "Requesting code..." : "Resend verification code"}
        </button>
        <p className="text-xs text-zinc-500">
          Verification confirms control of this email address. It does not replace Founder access approval, identity checks, or financial-account verification.
        </p>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
