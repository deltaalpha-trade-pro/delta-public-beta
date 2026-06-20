import { logoutSession } from "@/lib/platform/store"

import { clearPlatformSession, currentSessionId, ok } from "../_util"

export async function POST() {
  await logoutSession(currentSessionId())
  clearPlatformSession()
  return ok({ ok: true })
}
