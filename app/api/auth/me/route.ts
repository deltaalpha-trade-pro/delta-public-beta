import { getPublicPlatformState } from "@/lib/platform/store"

import { currentSessionId, err, ok } from "../_util"

export async function GET() {
  const platform = await getPublicPlatformState(currentSessionId())
  if (!platform) {
    return err("unauthorized", 401)
  }

  return ok(platform)
}
