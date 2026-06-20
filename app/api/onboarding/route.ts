import { updateOnboarding } from "@/lib/platform/store"

import { currentSessionId, err, ok } from "../auth/_util"

export async function POST(req: Request) {
  const sessionId = currentSessionId()
  if (!sessionId) {
    return err("unauthorized", 401)
  }

  const {
    fullName,
    company,
    accountLevel,
    acceptPolicy,
    acceptRisk,
    walkthroughCompleted,
    requestVerification,
  } = await req.json().catch(() => ({}))

  if (!fullName || !accountLevel) {
    return err("Missing onboarding fields", 400)
  }

  try {
    const state = await updateOnboarding(sessionId, {
      fullName: String(fullName),
      company: typeof company === "string" ? company : undefined,
      accountLevel:
        accountLevel === "core" || accountLevel === "pro" || accountLevel === "institutional"
          ? accountLevel
          : "core",
      acceptPolicy: Boolean(acceptPolicy),
      acceptRisk: Boolean(acceptRisk),
      walkthroughCompleted: Boolean(walkthroughCompleted),
      requestVerification: Boolean(requestVerification),
    })

    return ok(state)
  } catch (error) {
    return err(error instanceof Error ? error.message : "Unable to update onboarding", 400)
  }
}
