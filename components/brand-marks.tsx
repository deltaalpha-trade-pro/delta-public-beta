import * as React from "react"

export type MarkProps = React.SVGProps<SVGSVGElement> & {
  title?: string
}

export function EcosystemMark({ title = "Whalez-AI Ecosystem", ...props }: MarkProps) {
  const titleId = React.useId()

  return (
    <svg viewBox="0 0 64 64" fill="none" role="img" aria-labelledby={titleId} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id="ecosystem-gradient" x1="10" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2" />
      <path
        d="M14 36c7-11 22-18 36-14 3 1 6 3 9 6-4 1-8 4-10 8-2 5-7 8-13 8-8 0-16-3-22-8z"
        fill="url(#ecosystem-gradient)"
      />
      <path
        d="M21 27c3-5 8-8 14-8 7 0 13 4 16 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
        strokeOpacity="0.8"
      />
      <circle cx="21" cy="27" r="3" fill="currentColor" />
      <circle cx="35" cy="18" r="3" fill="currentColor" />
      <circle cx="50" cy="29" r="3" fill="currentColor" />
    </svg>
  )
}

export function WhalezchainMark({ title = "Whalezchain" }: MarkProps) {
  const titleId = React.useId()

  return (
    <svg viewBox="0 0 64 64" fill="none" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{title}</title>
      <rect x="10" y="10" width="44" height="44" rx="14" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
      <path
        d="M20 32c0-6 5-11 11-11h2c6 0 11 5 11 11s-5 11-11 11h-2c-6 0-11-5-11-11z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 32c0-3 2-5 5-5h4c3 0 5 2 5 5s-2 5-5 5h-4c-3 0-5-2-5-5z"
        fill="currentColor"
        fillOpacity="0.82"
      />
    </svg>
  )
}

export function DeltaAlphaMark({ title = "DeltaAlpha-TradePro" }: MarkProps) {
  const titleId = React.useId()

  return (
    <svg viewBox="0 0 64 64" fill="none" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{title}</title>
      <polygon
        points="32,11 54,52 10,52"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeOpacity="0.2"
      />
      <path
        d="M24 44h16M22 36h20M26 28h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
        strokeOpacity="0.85"
      />
      <path d="M32 18v26" stroke="currentColor" strokeLinecap="round" strokeWidth="3" strokeOpacity="0.85" />
      <path d="M27 23l5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  )
}
