import assert from "node:assert/strict"
import test from "node:test"

import { GET } from "../app/api/market-news/route"
import { parseRssItems } from "../app/api/market-news/rss"

test("RSS parser preserves publisher metadata and decodes XML entities", () => {
  const xml = `<?xml version="1.0"?>
    <rss><channel><item>
      <title><![CDATA[Markets &amp; currencies: latest update]]></title>
      <link>https://publisher.example/story?id=1&amp;src=rss</link>
      <pubDate>Thu, 22 Oct 2026 06:30:00 GMT</pubDate>
      <source url="https://publisher.example">Publisher News</source>
    </item></channel></rss>`
  const items = parseRssItems(xml, "macro")
  assert.equal(items.length, 1)
  assert.equal(items[0].title, "Markets & currencies: latest update")
  assert.equal(items[0].url, "https://publisher.example/story?id=1&src=rss")
  assert.equal(items[0].source, "Publisher News")
  assert.equal(items[0].publishedAt, "2026-10-22T06:30:00.000Z")
  assert.equal(items[0].category, "macro")
})

test("RSS parser rejects insecure links and missing publication timestamps", () => {
  const xml = `<rss><channel>
    <item><title>Insecure link</title><link>http://publisher.example/a</link><pubDate>Thu, 22 Oct 2026 06:30:00 GMT</pubDate></item>
    <item><title>No date</title><link>https://publisher.example/b</link><pubDate>not-a-date</pubDate></item>
    <item><title>Missing link</title><pubDate>Thu, 22 Oct 2026 06:30:00 GMT</pubDate></item>
  </channel></rss>`
  assert.deepEqual(parseRssItems(xml, "crypto"), [])
})


test("market news endpoint merges fresh headlines and public platform releases", async () => {
  const originalFetch = globalThis.fetch
  const rss = (title: string, url: string, pubDate: string) =>
    '<rss><channel><item><title>' + title + '</title><link>' + url +
    '</link><pubDate>' + pubDate + '</pubDate><source url="https://news.example">Markets Desk</source></item></channel></rss>'

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    if (url.includes("api.github.com/repos/")) {
      const repository = url.includes("/delta-public-beta/") ? "delta-public-beta" : "whalez-ai-core"
      return new Response(JSON.stringify([{
        name: repository + " release",
        html_url: "https://github.com/deltaalpha-trade-pro/" + repository + "/releases/tag/v1.0.0",
        published_at: "2026-10-22T08:00:00Z",
        body: "Release notes for public users",
      }]), { status: 200, headers: { "Content-Type": "application/json" } })
    }
    if (url.includes("bitcoin")) {
      return new Response(rss("Bitcoin market update", "https://news.example/bitcoin", "Thu, 22 Oct 2026 07:00:00 GMT"), { status: 200 })
    }
    if (url.includes("forex")) {
      return new Response(rss("Foreign exchange update", "https://news.example/forex", "Thu, 22 Oct 2026 07:15:00 GMT"), { status: 200 })
    }
    return new Response(rss("Global markets update", "https://news.example/macro", "Thu, 22 Oct 2026 07:30:00 GMT"), { status: 200 })
  }) as typeof fetch

  try {
    const response = await GET(new Request("https://example.test/api/market-news?category=all"))
    const body = await response.json()
    assert.equal(response.status, 200)
    assert.equal(body.success, true)
    assert.equal(body.category, "all")
    assert.equal(body.refreshIntervalSeconds, 120)
    assert.ok(body.items.some((item: { category: string }) => item.category === "crypto"))
    assert.ok(body.items.some((item: { category: string }) => item.category === "fx"))
    assert.ok(body.items.some((item: { category: string }) => item.category === "macro"))
    assert.ok(body.items.some((item: { category: string }) => item.category === "platform"))
    assert.equal(body.items[0].publishedAt, "2026-10-22T08:00:00.000Z")
  } finally {
    globalThis.fetch = originalFetch
  }
})
