"use client"

import Link from "next/link"
import type { ReactNode } from "react"

export function AuthCard(props: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#09111d_0%,#0d1117_45%,#0f1724_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <Link href="/" className="text-xs uppercase tracking-[0.24em] text-[#9ab7d7]">
            DeltaAlpha-TradePro
          </Link>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">{props.title}</h1>
          {props.subtitle ? <p className="mt-3 text-sm leading-7 text-slate-300">{props.subtitle}</p> : null}

          <div className="mt-8">{props.children}</div>

          <div className="mt-6 text-sm text-slate-400">
            {props.footer ?? (
              <Link className="underline hover:text-white" href="/">
                Back to public surface
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
