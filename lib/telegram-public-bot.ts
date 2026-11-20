// Public bot surface only. No user identity, privileged command, or financial authority.
export type PublicTelegramMessage = {
  chat?: { type?: unknown; id?: unknown }
  from?: { is_bot?: unknown }
  text?: unknown
}

function coreConfig(): { url: string; key: string } | null {
  const rawUrl = (process.env.WHALEZ_CORE_API_URL || "").trim()
  const key = (process.env.WHALEZ_AI_TELEGRAM_CORE_KEY || "").trim()
  if (!rawUrl || !key) return null
  try {
    const parsed = new URL(rawUrl)
    const loopback = process.env.NODE_ENV !== "production" &&
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    if ((parsed.protocol !== "https:" && !loopback) || parsed.username ||
      parsed.password || parsed.search || parsed.hash ||
      (parsed.pathname !== "" && parsed.pathname !== "/")) return null
    return { url: parsed.toString().replace(/\/$/, ""), key }
  } catch {
    return null
  }
}

export function publicTelegramChatId(message: PublicTelegramMessage | null): number | null {
  if (!message || message.chat?.type !== "private" || message.from?.is_bot === true) return null
  const id = message.chat?.id
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? id : null
}

function helpText(): string {
  return [
    "Alpha-AI support assistant",
    "/help — available commands",
    "/status — public connection status",
    "/updates — official announcements",
    "/ask <question> — advisory AI, if available",
    "/mode — service limits",
    "This bot cannot make payments, trade, or approve account changes.",
  ].join("\n")
}

function parseCommand(text: string): { name: string; argument: string } | null {
  const match = text.trim().match(/^\/([A-Za-z_]+)(?:@[A-Za-z0-9_]+)?(?:\s+([\s\S]*))?$/)
  if (!match) return null
  return { name: match[1].toLowerCase(), argument: (match[2] || "").trim() }
}

async function askModel(question: string): Promise<string> {
  if (!question || question.length > 750) return "Usage: /ask followed by a short question (maximum 750 characters)."
  const config = coreConfig()
  if (!config) return "Advisory AI is not connected in this deployment. Please try again later."
  try {
    const response = await fetch(config.url + "/v1/intelligence/telegram-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": config.key },
      body: JSON.stringify({ question }),
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    })
    if (!response.ok) throw new Error("core_unavailable")
    const data: unknown = await response.json()
    if (!data || typeof data !== "object") throw new Error("core_invalid")
    const packet = data as Record<string, unknown>
    if (packet.identity !== "Whalez-AI" || packet.authority !== "advisory-only" ||
      packet.side_effects !== false || typeof packet.answer !== "string" ||
      !packet.answer.trim()) throw new Error("core_contract_invalid")
    return packet.answer.trim().slice(0, 2900) +
      "\n\nAdvisory only. No action or account change was performed."
  } catch {
    return "Advisory AI is temporarily unavailable. No answer was invented or action performed."
  }
}

export async function publicTelegramReply(text: string): Promise<string | null> {
  const command = parseCommand(text)
  if (!command) return null
  switch (command.name) {
    case "start":
    case "help": return helpText()
    case "status": return "Alpha-AI Telegram support intake is connected. Account actions and financial services are not available here."
    case "updates": return "Approved public updates: https://t.me/whalez_ai_deltaalpha_trade_pro"
    case "mode":
    case "actions": return "Public informational and advisory mode only. No identity verification, payment, trading, signing or governance approval occurs in this chat."
    case "ask": return askModel(command.argument)
    default: return "That command is unavailable. Use /help to view supported commands."
  }
}
