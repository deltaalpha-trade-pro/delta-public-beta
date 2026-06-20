import { requestRecovery } from "@/lib/platform/store"

import { err, ok } from "../_util"

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))

  if (!email) {
    return err("Missing email", 400)
  }

  await requestRecovery(String(email))
  return ok({
    ok: true,
    message: "If the account exists, a recovery review has been initiated.",
  })
}
