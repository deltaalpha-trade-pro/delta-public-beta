import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  buildNewUser,
  ENGINE_DEFINITIONS,
  entitlementsForLevel,
  productsForLevel,
} from "@/lib/platform/defaults"
import type {
  AccountLevel,
  EngineDefinition,
  EngineGate,
  PlatformEngineState,
  PlatformEvent,
  PlatformNotice,
  PlatformStore,
  PlatformUserRecord,
  PublicPlatformState,
  RestrictionCode,
} from "@/lib/platform/types"

const STORE_DIR = path.join(process.cwd(), "data")
const STORE_FILE = path.join(STORE_DIR, "platform-store.json")

const EMPTY_STORE: PlatformStore = {
  users: [],
  sessions: [],
}

async function ensureStoreFile() {
  await mkdir(STORE_DIR, { recursive: true })

  try {
    await readFile(STORE_FILE, "utf8")
  } catch {
    await writeFile(STORE_FILE, JSON.stringify(EMPTY_STORE, null, 2), "utf8")
  }
}

async function readStore(): Promise<PlatformStore> {
  await ensureStoreFile()
  const raw = await readFile(STORE_FILE, "utf8")
  return JSON.parse(raw) as PlatformStore
}

async function writeStore(store: PlatformStore) {
  await ensureStoreFile()
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8")
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function rank(level: AccountLevel) {
  if (level === "institutional") return 3
  if (level === "pro") return 2
  return 1
}

function addNotice(user: PlatformUserRecord, notice: Omit<PlatformNotice, "id" | "createdAt">) {
  user.notices.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...notice,
  })
}

function addEvent(user: PlatformUserRecord, event: Omit<PlatformEvent, "id" | "createdAt">) {
  user.events.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...event,
  })
}

function clearRestriction(user: PlatformUserRecord, code: RestrictionCode) {
  user.restrictions = user.restrictions.filter((item) => item !== code && item !== "none")
  if (user.restrictions.length === 0) {
    user.restrictions = ["none"]
  }
}

function addRestriction(user: PlatformUserRecord, code: RestrictionCode) {
  clearRestriction(user, code)
  user.restrictions = user.restrictions.filter((item) => item !== "none")
  if (!user.restrictions.includes(code)) {
    user.restrictions.push(code)
  }
}

function gateForEngine(engine: EngineDefinition, user: PlatformUserRecord): PlatformEngineState {
  if (user.policyState === "restricted" || user.restrictions.includes("activity_pause")) {
    return {
      ...engine,
      gate: "restricted",
      reason: "This surface is temporarily unavailable while account restrictions are active.",
    }
  }

  if (!user.onboarding.profileCompleted || !user.onboarding.policyAccepted || !user.onboarding.riskAcknowledged) {
    return {
      ...engine,
      gate: "onboarding_required",
      reason: "Complete onboarding to activate this surface.",
    }
  }

  if (rank(user.accountLevel) < rank(engine.minLevel)) {
    return {
      ...engine,
      gate: "policy_review",
      reason: `This surface requires a ${engine.minLevel} account profile.`,
    }
  }

  if (engine.requiresKyc && user.kycState !== "approved") {
    return {
      ...engine,
      gate: "verification_required",
      reason: "Verification approval is required before this surface can be used.",
    }
  }

  if (engine.requiresActivity && user.activityState !== "active") {
    return {
      ...engine,
      gate: "activity_required",
      reason: "An active account posture is required before this surface is enabled.",
    }
  }

  if (user.policyState === "review" || user.restrictions.includes("policy_review")) {
    return {
      ...engine,
      gate: "policy_review",
      reason: "This surface is in manual review before activation.",
    }
  }

  return {
    ...engine,
    gate: "available",
    reason: "This surface is available for your current account posture.",
  }
}

function toPublicState(user: PlatformUserRecord): PublicPlatformState {
  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      company: user.company,
      accountLevel: user.accountLevel,
      kycState: user.kycState,
      activityState: user.activityState,
      policyState: user.policyState,
    },
    onboarding: user.onboarding,
    productAvailability: user.productAvailability,
    entitlements: user.entitlements,
    restrictions: user.restrictions,
    notices: user.notices,
    events: user.events,
    support: user.support,
    engines: ENGINE_DEFINITIONS.map((engine) => gateForEngine(engine, user)),
  }
}

export async function createAccount(input: {
  email: string
  password: string
  fullName?: string
  company?: string
  accountLevel?: AccountLevel
}) {
  const store = await readStore()
  const email = normalizeEmail(input.email)
  const existing = store.users.find((user) => user.email === email)

  if (existing && existing.hasCredentials) {
    throw new Error("An account already exists for this email")
  }

  if (existing && !existing.hasCredentials) {
    existing.passwordHash = sha256(input.password)
    existing.hasCredentials = true
    existing.fullName = input.fullName?.trim() || existing.fullName
    existing.company = input.company?.trim() || existing.company
    existing.accountLevel = input.accountLevel ?? existing.accountLevel
    existing.entitlements = entitlementsForLevel(existing.accountLevel)
    existing.productAvailability = productsForLevel(existing.accountLevel)
    existing.updatedAt = new Date().toISOString()
    addEvent(existing, {
      title: "Credentials activated",
      body: "The guided access profile was upgraded into a sign-in capable account.",
    })
    await writeStore(store)
    return existing
  }

  const user = buildNewUser({
    email,
    passwordHash: sha256(input.password),
    fullName: input.fullName,
    company: input.company,
    accountLevel: input.accountLevel,
  })

  store.users.push(user)
  await writeStore(store)
  return user
}

export async function authenticateAccount(emailInput: string, password: string) {
  const store = await readStore()
  const email = normalizeEmail(emailInput)
  const user = store.users.find((candidate) => candidate.email === email)

  if (!user || !user.hasCredentials || user.passwordHash !== sha256(password)) {
    return null
  }

  user.lastLoginAt = new Date().toISOString()
  user.updatedAt = user.lastLoginAt

  if (user.activityState === "new" && user.onboarding.walkthroughCompleted) {
    user.activityState = "active"
  }

  const session = {
    id: crypto.randomUUID(),
    userId: user.id,
    createdAt: new Date().toISOString(),
  }

  store.sessions = store.sessions.filter((item) => item.userId !== user.id)
  store.sessions.push(session)
  await writeStore(store)

  return { user, session }
}

export async function getUserForSession(sessionId: string | null) {
  if (!sessionId) return null

  const store = await readStore()
  const session = store.sessions.find((item) => item.id === sessionId)
  if (!session) return null

  return store.users.find((user) => user.id === session.userId) ?? null
}

export async function logoutSession(sessionId: string | null) {
  if (!sessionId) return

  const store = await readStore()
  store.sessions = store.sessions.filter((item) => item.id !== sessionId)
  await writeStore(store)
}

export async function createSessionForUser(userId: string) {
  const store = await readStore()
  const session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  }

  store.sessions = store.sessions.filter((item) => item.userId !== userId)
  store.sessions.push(session)
  await writeStore(store)
  return session
}

export async function getPublicPlatformState(sessionId: string | null) {
  const user = await getUserForSession(sessionId)
  return user ? toPublicState(user) : null
}

export async function updateOnboarding(
  sessionId: string | null,
  input: {
    fullName: string
    company?: string
    accountLevel: AccountLevel
    acceptPolicy: boolean
    acceptRisk: boolean
    walkthroughCompleted: boolean
    requestVerification: boolean
  },
) {
  if (!sessionId) {
    throw new Error("unauthorized")
  }

  const store = await readStore()
  const session = store.sessions.find((item) => item.id === sessionId)
  if (!session) {
    throw new Error("unauthorized")
  }

  const user = store.users.find((item) => item.id === session.userId)
  if (!user) {
    throw new Error("unauthorized")
  }

  user.fullName = input.fullName.trim()
  user.company = input.company?.trim() ?? ""
  user.accountLevel = input.accountLevel
  user.entitlements = entitlementsForLevel(input.accountLevel)
  user.productAvailability = productsForLevel(input.accountLevel)
  user.onboarding = {
    profileCompleted: Boolean(user.fullName),
    policyAccepted: input.acceptPolicy,
    riskAcknowledged: input.acceptRisk,
    walkthroughCompleted: input.walkthroughCompleted,
  }

  if (user.onboarding.profileCompleted && user.onboarding.policyAccepted && user.onboarding.riskAcknowledged) {
    clearRestriction(user, "onboarding_hold")
  } else {
    addRestriction(user, "onboarding_hold")
  }

  if (input.requestVerification) {
    user.kycState = "pending"
    addRestriction(user, "kyc_required")
    addNotice(user, {
      title: "Verification submitted",
      body: "Your verification intake is recorded and is pending review.",
      tone: "neutral",
    })
  } else if (user.accountLevel === "core" && user.onboarding.walkthroughCompleted) {
    user.kycState = "approved"
    clearRestriction(user, "kyc_required")
  }

  if (user.onboarding.walkthroughCompleted) {
    user.activityState = "active"
    clearRestriction(user, "activity_pause")
  }

  addEvent(user, {
    title: "Onboarding updated",
    body: "Your onboarding posture and product eligibility were refreshed.",
  })

  user.updatedAt = new Date().toISOString()
  await writeStore(store)

  return toPublicState(user)
}

export async function requestRecovery(emailInput: string) {
  const store = await readStore()
  const email = normalizeEmail(emailInput)
  const user = store.users.find((candidate) => candidate.email === email)

  if (!user) {
    return { ok: true }
  }

  user.recoveryRequestedAt = new Date().toISOString()
  addNotice(user, {
    title: "Recovery requested",
    body: "A recovery request has been logged. Platform support will validate the request before any credential reset is processed.",
    tone: "attention",
  })
  addEvent(user, {
    title: "Recovery request logged",
    body: "Support posture updated for account recovery review.",
  })
  user.updatedAt = new Date().toISOString()

  await writeStore(store)
  return { ok: true }
}

export async function expandBetaAccessIntoAccount(input: {
  name: string
  email: string
  company?: string
  intendedUse?: string
}) {
  const store = await readStore()
  const email = normalizeEmail(input.email)
  const existing = store.users.find((user) => user.email === email)

  if (existing) {
    addNotice(existing, {
      title: "Guided access refreshed",
      body: "Your onboarding entry has been refreshed from the guided access page.",
      tone: "neutral",
    })
    addEvent(existing, {
      title: "Guided access revisited",
      body: input.intendedUse?.trim()
        ? `Submitted platform intent: ${input.intendedUse.trim()}`
        : "Submitted guided access intent.",
    })
    existing.fullName = existing.fullName || input.name.trim()
    existing.company = existing.company || input.company?.trim() || ""
    existing.updatedAt = new Date().toISOString()
    await writeStore(store)
    return existing
  }

  const user = buildNewUser({
    email,
    passwordHash: sha256(crypto.randomUUID()),
    hasCredentials: false,
    fullName: input.name.trim(),
    company: input.company?.trim() ?? "",
    accountLevel: "core",
  })

  addNotice(user, {
    title: "Guided access started",
    body: "Your guided access intake is stored. Create credentials to activate your account and continue onboarding.",
    tone: "neutral",
  })

  if (input.intendedUse?.trim()) {
    addEvent(user, {
      title: "Platform intent submitted",
      body: input.intendedUse.trim(),
    })
  }

  store.users.push(user)
  await writeStore(store)
  return user
}
