import { currentSessionId, err, ok } from "../_util"

export async function POST() {
  if (!currentSessionId()) {
    return err("unauthorized", 401)
  }

  return ok({ ok: true })
}
