"use client";

import Link from "next/link";

export function AuthCard(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-black text-white">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">{props.title}</h1>
        {props.subtitle ? (
          <p className="mt-1 text-sm text-zinc-400">{props.subtitle}</p>
        ) : null}

        <div className="mt-6">{props.children}</div>

        {props.footer ? (
          <div className="mt-6 text-sm text-zinc-400">{props.footer}</div>
        ) : (
          <div className="mt-6 text-sm text-zinc-400">
            <Link className="underline hover:text-zinc-200" href="/">
              Back to public surface
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
