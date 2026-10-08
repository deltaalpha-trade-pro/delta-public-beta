import {
  authBridgeConfigured,
  demoMode,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
} from "@/app/api/auth/_util";

export type LiveIdentity = {
  user_id: string;
  email: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
};

const verificationRank: Record<LiveIdentity["verification_level"], number> = {
  V0: 0,
  V1: 1,
  V2: 2,
  V3: 3,
};

export async function getLiveIdentity(): Promise<
  { ok: true; identity: LiveIdentity } |
  { ok: false; status: number; error: string }
> {
  if (demoMode()) {
    return {
      ok: false,
      status: 403,
      error: "live_execution_requires_verified_auth",
    };
  }

  const access = getAccessCookie();
  if (!access) return { ok: false, status: 401, error: "unauthorized" };
  if (!authBridgeConfigured()) {
    return { ok: false, status: 503, error: "authentication_unavailable" };
  }

  try {
    const response = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(access) },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data || typeof data !== "object") {
      return { ok: false, status: 401, error: "authenticated_identity_unavailable" };
    }

    const record = data as Record<string, unknown>;
    const identity: Partial<LiveIdentity> = {
      user_id: typeof record.user_id === "string" ? record.user_id : undefined,
      email: typeof record.email === "string" ? record.email : undefined,
      risk_tier:
        typeof record.risk_tier === "string"
          ? (record.risk_tier as LiveIdentity["risk_tier"])
          : undefined,
      verification_level:
        typeof record.verification_level === "string"
          ? (record.verification_level as LiveIdentity["verification_level"])
          : undefined,
    };

    if (
      !identity.user_id ||
      !identity.email ||
      !identity.risk_tier ||
      !identity.verification_level
    ) {
      return { ok: false, status: 403, error: "live_identity_incomplete" };
    }

    if (identity.risk_tier === "R3") {
      return { ok: false, status: 403, error: "live_identity_not_eligible" };
    }

    const minimum =
      (process.env.LIVE_NGN_MIN_VERIFICATION_LEVEL || "V1") as LiveIdentity["verification_level"];

    if (!(minimum in verificationRank)) {
      return { ok: false, status: 503, error: "live_policy_misconfigured" };
    }

    if (verificationRank[identity.verification_level] < verificationRank[minimum]) {
      return { ok: false, status: 403, error: "live_identity_not_verified" };
    }

    return {
      ok: true,
      identity: identity as LiveIdentity,
    };
  } catch {
    return { ok: false, status: 503, error: "authentication_unavailable" };
  }
}
