import { authenticateAccount, getPublicPlatformState } from "@/lib/platform/store"

import { err, ok, setPlatformSession } from "../_util"

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return err("Missing email or password", 400)
  }

  const result = await authenticateAccount(String(email), String(password))
  if (!result) {
    return err("Invalid email or password", 401)
  }

  setPlatformSession(result.session.id)
  const platform = await getPublicPlatformState(result.session.id)
  return ok(platform)
}
