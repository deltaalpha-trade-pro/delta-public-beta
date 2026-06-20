import { getPublicPlatformState } from "@/lib/platform/store"

import { currentSessionId, err, ok } from "../../auth/_util"

export async function GET() {
  const state = await getPublicPlatformState(currentSessionId())
  if (!state) {
    return err("unauthorized", 401)
  }

  return ok(state.engines)
}
