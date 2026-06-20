import Link from "next/link"
import type { ReactNode } from "react"

export function PlatformShell(props: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#09111d_0%,#0d1117_24%,#0f1724_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Link href="/" className="text-xs uppercase tracking-[0.24em] text-[#9ab7d7]">
                DeltaAlpha-TradePro
              </Link>
              {props.eyebrow ? <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#7ea6d9]">{props.eyebrow}</p> : null}
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{props.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{props.description}</p>
            </div>
            {props.actions ? <div className="flex flex-wrap gap-3">{props.actions}</div> : null}
          </div>
          <div className="mt-8">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
