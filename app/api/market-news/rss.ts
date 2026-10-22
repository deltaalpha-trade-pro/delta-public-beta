type RssCategory = "crypto" | "fx" | "macro"

type RssNewsItem = {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  category: RssCategory
}

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

export function parseRssItems(xml: string, category: RssCategory): RssNewsItem[] {
  const items: RssNewsItem[] = []
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
