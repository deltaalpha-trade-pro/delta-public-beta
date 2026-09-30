import { createHash, createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

type Identity = {
  sub: string;
  email: string;
  verification_level: string;
  risk_tier: string;
};

const CORE_URL = () =>
  (process.env.WHALEZ_CORE_PLATFORM_URL || process.env.NEXT_PUBLIC_WHALEZ_CORE_URL || "").trim().replace(/\/$/, "");

function serviceSecret() {
  const value = (process.env.WHALEZ_SERVICE_AUTH_SECRET || "").trim();
  if (value.length < 32) throw new Error("platform_service_auth_not_configured");
  return value;
}

function b64(value: Buffer | string) {
  const input = typeof value === "string" ? Buffer.from(value, "utf8") : value;
  return input.toString("base64url");
}

function mintServiceToken(identity: Identity) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "WST" };
  const payload = {
    iss: "deltaalpha-trade-pro",
    sub: identity.sub,
    email: identity.email,
    verification_level: identity.verification_level,
    risk_tier: identity.risk_tier,
    iat: now,
    exp: now + 60,
    jti: b64(randomBytes(18)),
  };
  const encoded = `${b64(JSON.stringify(header))}.${b64(JSON.stringify(payload))}`;
  const signature = createHmac("sha256", serviceSecret()).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}

async function liveIdentity(): Promise<Identity | null> {
  const cookie = cookies().get("access_token")?.value;
  if (!cookie) return null;

  if ((process.env.AUTH_DEMO_MODE || "").toLowerCase() === "true") {
    const email = cookie.startsWith("demo:") ? cookie.slice(5) : "user@demo";
    const sub = `demo-user:${createHash("sha256").update(email).digest("hex").slice(0, 24)}`;
    return {
      sub,
      email,
      verification_level: "V0",
      risk_tier: "R0",
    };
  }

  if ((process.env.RUNPLANE_AUTH_ENABLED || "").toLowerCase() !== "true") return null;

  const base = (process.env.RUNPLANE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!base) return null;

  const response = await fetch(`${base}/auth/me`, {
    headers: { Cookie: `rp=${cookie}` },
    cache: "no-store",
    redirect: "manual",
  }).catch(() => null);

  if (!response?.ok) return null;
  const data: unknown = await response.json().catch(() => null);
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const identity = {
    sub: typeof record.user_id === "string" ? record.user_id : "",
    email: typeof record.email === "string" ? record.email : "",
    verification_level: typeof record.verification_level === "string" ? record.verification_level : "",
    risk_tier: typeof record.risk_tier === "string" ? record.risk_tier : "",
  };
  return identity.sub && identity.email && identity.verification_level && identity.risk_tier ? identity : null;
}

export async function requirePlatformIdentity() {
  const identity = await liveIdentity();
  if (!identity) throw new Error("platform_identity_unavailable");
  return identity;
}

export async function platformRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const base = CORE_URL();
  if (!base) throw new Error("whalez_core_platform_url_not_configured");
  const identity = await requirePlatformIdentity();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${mintServiceToken(identity)}`);
  headers.set("Content-Type", "application/json");
  headers.set("X-Request-Source", "deltaalpha-public-gateway");
  return fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    redirect: "manual",
  });
}

export function platformUnavailable(message = "Platform service is temporarily unavailable.") {
  return Response.json({ ok: false, error: message }, { status: 503 });
}
