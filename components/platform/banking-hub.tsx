"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

type BankAccount = {
  account_id: string
  provider: string
  account_type: string
  currency: string
  status: string
  current_balance_minor?: number | null
  available_balance_minor?: number | null
}

type Payment = {
  payment_id: string
  payment_type: string
  direction: string
  amount_minor: number
  currency: string
  status: string
  provider?: string | null
  provider_reference?: string | null
}

export function BankingHub() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [amount, setAmount] = useState("")
  const [destination, setDestination] = useState("")
  const [currency, setCurrency] = useState("NGN")

  async function api(path: string, init?: RequestInit) {
    const response = await fetch(path, { ...init, cache: "no-store" })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data?.detail || data?.error || `request_failed_${response.status}`)
    return data
  }

  async function load() {
    setError("")
    try {
      const [a, p] = await Promise.all([
        api("/api/platform/banking?type=accounts"),
        api("/api/platform/banking?type=payment-intents"),
      ])
      setAccounts(a.accounts || [])
      setPayments(p.payments || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "banking_unavailable")
    }
  }

  useEffect(() => { void load() }, [])

  async function createPayment(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const minor = Math.round(Number(amount) * 100)
      if (!Number.isFinite(minor) || minor <= 0) throw new Error("enter_valid_amount")
      const result = await api("/api/platform/banking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_type: "TRANSFER",
          direction: "OUTBOUND",
          amount_minor: minor,
          currency: currency.toUpperCase(),
          destination_reference: destination.trim(),
          idempotency_key: `ui-${crypto.randomUUID()}`,
        }),
      })
      setPayments((items) => [result.payment, ...items.filter((item: Payment) => item.payment_id !== result.payment?.payment_id)])
      setAmount("")
      setDestination("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "payment_intent_failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">Linked financial accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Provider-linked records only. No browser state is treated as a customer balance.
          </p>
          <div className="mt-5 grid gap-3">
            {accounts.length ? accounts.map((account) => (
              <div key={account.account_id} className="rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{account.provider}</p>
                    <p className="text-xs text-muted-foreground">{account.account_type} · {account.currency}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{account.status}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Metric label="Current balance" value={account.current_balance_minor == null ? "NOT CONNECTED" : formatMinor(account.current_balance_minor, account.currency)} />
                  <Metric label="Available balance" value={account.available_balance_minor == null ? "NOT CONNECTED" : formatMinor(account.available_balance_minor, account.currency)} />
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-zinc-500">
                No verified provider account is connected yet.
              </div>
            )}
          </div>
        </section>

        <form onSubmit={createPayment} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold text-foreground">Transfer intent</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Creates a governed financial intent only. It does not move money until an eligible provider route authorizes execution.
          </p>
          <div className="mt-5 grid gap-3">
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3" />
            <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} maxLength={3} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3" />
            <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination reference" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3" />
            <button disabled={busy} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-black disabled:opacity-50">
              {busy ? "Creating…" : "Create transfer intent"}
            </button>
          </div>
        </form>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Payment intents</h2>
            <p className="mt-1 text-sm text-muted-foreground">Auditable workflow state before provider execution.</p>
          </div>
          <Link href="/settlement" className="text-sm text-primary hover:underline">Settlement corridor →</Link>
        </div>
        <div className="mt-5 grid gap-3">
          {payments.length ? payments.map((payment) => (
            <div key={payment.payment_id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">{payment.direction} {payment.payment_type}</p>
                <p className="text-xs text-muted-foreground">{payment.payment_id}</p>
              </div>
              <div className="text-right">
                <p>{formatMinor(payment.amount_minor, payment.currency)}</p>
                <p className="text-xs text-amber-300">{payment.status}</p>
              </div>
            </div>
          )) : <p className="text-sm text-zinc-500">No payment intents recorded.</p>}
        </div>
      </section>

      {error ? <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-200">{error}</div> : null}

      <div className="mt-10 rounded-xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-7 text-amber-100/80">
        Live banking, custody and transfer execution remain dependent on the appropriate licensed/eligible financial rail. The UI never fabricates balances or provider completion.
      </div>
    </>
  )
}

function formatMinor(minor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(minor / 100)
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-xl bg-black/20 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-medium">{value}</p>
    </div>
  )
}
