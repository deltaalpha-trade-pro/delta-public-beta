import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 120

type NewsCategory = "crypto" | "fx" | "macro" | "platform"
type NewsItem = {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  category: NewsCategory
  summary?: string
}

const RSS_FEEDS: Record<Exclude<NewsCategory, "platform">, string> = {
  crypto: "https://news.google.com/rss/search?q=%28bitcoin%20OR%20ethereum%20OR%20cryptocurrency%29%20market&hl=en-US&gl=US&ceid=US:en",
  fx: "https://news.google.com/rss/search?q=%28forex%20OR%20foreign%20exchange%20OR%20USD%20NGN%29%20market&hl=en-US&gl=US&ceid=US:en",
  macro: "https://news.google.com/rss/search?q=%28global%20markets%20OR%20central%20bank%20OR%20inflation%20OR%20oil%29%20economy&hl=en-US&gl=US&ceid=US:en",
}

const CATEGORIES: NewsCategory[] = ["crypto", "fx", "macro", "platform"]

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/<[^>]*>/g, "")
    .trim()
}

function tag(block: string, name: string): string {
  const pattern = new RegExp("<" + name + "(?:\\s+[^>]*)?>([\\s\\S]*?)</" + name + ">", "i")
  const match = block.match(pattern)
  return match ? decodeXml(match[1]) : ""
}

export function parseRssItems(xml: string, category: Exclude<NewsCategory, "platform">): NewsItem[] {
  const items: NewsItem[] = []
  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const block = match[1]
    const title = tag(block, "title")
    const rawUrl = tag(block, "link")
    const publishedRaw = tag(block, "pubDate")
    const source = tag(block, "source") || "Publisher via Google News"
    const parsedDate = Date.parse(publishedRaw)
    let url: URL
    try { url = new URL(rawUrl) } catch { continue }
    if (!title || url.protocol !== "https:" || !Number.isFinite(parsedDate)) continue
    items.push({
      id: category + ":" + url.href,
      title,
      url: url.href,
      source,
      publishedAt: new Date(parsedDate).toISOString(),
      category,
    })
  }
  return items
}

async function fetchRss(category: Exclude<NewsCategory, "platform">): Promise<NewsItem[]> {
  const response = await fetch(RSS_FEEDS[category], {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": "Whalez-AI-MarketBrief/1.0 (+https://www.deltaalpha-trade-pro.com)",
    },
    next: { revalidate: 120 },
    signal: AbortSignal.timeout(7000),
  })
  if (!response.ok) throw new Error("news_feed_http_" + response.status)
  return parseRssItems(await response.text(), category)
}

async function fetchPlatformReleases(): Promise<NewsItem[]> {
  const repositories = ["deltaalpha-trade-pro/delta-public-beta", "deltaalpha-trade-pro/whalez-ai-core"]
  const results = await Promise.allSettled(repositories.map(async (repository) => {
    const response = await fetch("https://api.github.com/repos/" + repository + "/releases?per_page=5", {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Whalez-AI-MarketBrief",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error("release_feed_http_" + response.status)
    const releases: unknown = await response.json()
    if (!Array.isArray(releases)) return []
    return releases.flatMap((release: unknown) => {
      if (!release || typeof release !== "object") return []
      const item = release as Record<string, unknown>
      const title = String(item.name || item.tag_name || "").trim()
      const url = String(item.html_url || "").trim()
      const published = Date.parse(String(item.published_at || ""))
      if (!title || !Number.isFinite(published)) return []
      try {
        const parsed = new URL(url)
        if (parsed.hostname !== "github.com" || parsed.protocol !== "https:") return []
        return [{
          id: "platform:" + parsed.href,
          title,
          url: parsed.href,
          source: repository,
          publishedAt: new Date(published).toISOString(),
          category: "platform" as const,
          summary: String(item.body || "").replace(/[#*_>]/g, "").replace(/\s+/g, " ").trim().slice(0, 220),
        }]
      } catch { return [] }
    })
  }))
  return results.flatMap((result) => result.status === "fulfilled" ? result.value : [])
}

function categoryOf(value: string | null): NewsCategory | "all" {
  return value && CATEGORIES.includes(value as NewsCategory) ? value as NewsCategory : "all"
}

export async function GET(request: Request) {
  const category = categoryOf(new URL(request.url).searchParams.get("category"))
  const jobs = category === "platform"
    ? [fetchPlatformReleases()]
    : category === "all"
      ? [fetchRss("crypto"), fetchRss("fx"), fetchRss("macro"), fetchPlatformReleases()]
      : [fetchRss(category)]

  const results = await Promise.allSettled(jobs)
  const items = results
    .flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  const seen = new Set<string>()
  const unique = items.filter((item) => {
    const key = item.url || item.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, category === "all" ? 12 : 10)

  const anyFeedSucceeded = results.some((result) => result.status === "fulfilled")
  return NextResponse.json({
    success: anyFeedSucceeded && unique.length > 0,
    category,
    source: category === "platform" ? "Public GitHub Releases" : "Google News RSS and public GitHub Releases",
    fetchedAt: new Date().toISOString(),
    refreshIntervalSeconds: 120,
    items: unique,
    message: unique.length
      ? undefined
      : anyFeedSucceeded
        ? "No recent published items were found for this category."
        : "News providers are temporarily unavailable. No headlines have been fabricated.",
  }, {
    status: anyFeedSucceeded ? 200 : 503,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  })
}
