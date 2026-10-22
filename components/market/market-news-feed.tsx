"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarClock, ExternalLink, Newspaper, RefreshCw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type Category = "all" | "crypto" | "fx" | "macro" | "platform"
type NewsItem = {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  category: Exclude<Category, "all">
  summary?: string
}
type FeedResponse = {
  success: boolean
  category: Category
  source: string
  fetchedAt: string
  refreshIntervalSeconds: number
  items: NewsItem[]
  message?: string
}

const categories: Array<{ id: Category; label: string }> = [
  { id: "all", label: "All markets" },
  { id: "crypto", label: "Crypto" },
  { id: "fx", label: "FX & NGN" },
  { id: "macro", label: "Global economy" },
  { id: "platform", label: "Platform updates" },
]

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Publication time unavailable"
    : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function MarketNewsFeed({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState<Category>("all")
  const [feed, setFeed] = useState<FeedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (showSpinner = true, signal?: AbortSignal) => {
    if (showSpinner) setRefreshing(true)
    try {
      const response = await fetch("/api/market-news?category=" + category, { cache: "no-store", signal })
      const body = await response.json() as FeedResponse
      if (!response.ok && !body.items?.length) {
        throw new Error(body.message || "News feed is temporarily unavailable.")
      }
      setFeed(body)
      setError(body.message && body.items.length === 0 ? body.message : null)
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return
      setError(cause instanceof Error ? cause.message : "News feed is temporarily unavailable.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [category])

  useEffect(() => {
    const controller = new AbortController()
    void load(true, controller.signal)
    const timer = window.setInterval(() => void load(false), 120_000)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [load])

  const items = feed?.items ?? []
  const shown = compact ? items.slice(0, 5) : items.slice(0, 9)

  return (
    <section aria-labelledby="market-news-title" className={"border border-border bg-card/70 " + (compact ? "rounded-xl p-4" : "rounded-[1.5rem] p-4 sm:p-6 md:p-7")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Newspaper className="h-4 w-4" />
            Market & ecosystem pulse
          </div>
          <h2 id="market-news-title" className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            What is moving the market?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Current published headlines across crypto, foreign exchange and the global economy, plus publicly released platform updates.
            Headlines link to their publishers; publication timing depends on each source.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load(true)} disabled={refreshing} className="w-fit">
          <RefreshCw className={"mr-2 h-4 w-4 " + (refreshing ? "animate-spin" : "")} />
          Refresh
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose market news category">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            aria-pressed={category === item.id}
            className={
              "rounded-full border px-3 py-2 text-xs font-medium transition-colors " +
              (category === item.id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground")
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          {feed?.fetchedAt ? "Fetched " + formatDate(feed.fetchedAt) : "Connecting to publishers"}
        </span>
        <span>Feeds refresh about every 2 minutes</span>
      </div>

      {error && (
        <div role="status" className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-sm text-amber-200">
          {error} {items.length > 0 ? "Showing the last successfully fetched headlines." : ""}
        </div>
      )}

      {shown.length > 0 ? (
        <div className={"mt-2 divide-y divide-border " + (compact ? "" : "grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-x-6")}>
          {shown.map((item) => (
            <article key={item.id} className={"py-4 " + (!compact ? "lg:px-1" : "")}>
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                <span className="rounded-full border border-border px-2 py-1">{item.category === "fx" ? "FX & currency" : item.category}</span>
                <span>{item.source}</span>
                <span>·</span>
                <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-start gap-2 text-sm font-semibold leading-6 text-foreground transition-colors hover:text-primary"
              >
                <span>{item.title}</span>
                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
              {item.summary ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.summary}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          {loading ? "Loading verifiable headlines…" : error || "No recent published items were found for this category."}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          News is third-party editorial content, not a Whalez-AI trading signal. Prices, execution and settlement are verified separately.
          The feed shows no invented headlines when a source is unavailable.
        </p>
      </div>
    </section>
  )
}
