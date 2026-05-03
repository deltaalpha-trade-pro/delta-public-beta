"use client";

import Link from "next/link";

export function AuthCard(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 py-16 text-white">
      <div className="glow-orb left-[-8rem] top-12 h-72 w-72 bg-primary/40" />
      <div className="glow-orb right-[-7rem] bottom-20 h-80 w-80 bg-cyan-400/25" />

      <div className="relative z-10 flex min-h-[calc(100vh-180px)] items-center justify-center">
        <div className="glass-panel w-full max-w-md rounded-[2rem] p-6 shadow-2xl sm:p-8">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary backdrop-blur-xl">
            Runplane access layer
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{props.title}</h1>
          {props.subtitle ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{props.subtitle}</p> : null}

          <div className="mt-7">{props.children}</div>

          {props.footer ? (
            <div className="mt-6 text-sm text-muted-foreground">{props.footer}</div>
          ) : (
            <div className="mt-6 text-sm text-muted-foreground">
              <Link className="underline hover:text-zinc-200" href="/">
                Back to public surface
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
