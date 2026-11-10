# Public Alpha-AI and support consolidation — DRAFT integration

Date: 2026-11-10
Status: DRY-RUN / NO PRODUCTION APPROVAL
Branch: reconcile/alpha-ai-public-support-20261110
Base: PR #52 head bff6d60616d45d603746a2be0666f02a0af677c6

## Integrated in this isolated branch
- PR #52 Admin Control Panel scaffold inherited unchanged (default disabled, requires verified role, host and Cloudflare Access).
- PR #51 public /founder-console and /mail routes fail closed using notFound().
- PR #50 minimal public /api/status (liveness only, never enumerate internal services) and guarded Tidio chat-button adapter.
- The public communications section offers Tidio only if configured, Telegram only if an allowed URL is provided, and WhatsApp only if a number is configured. No internal mail link or service topology.
- Alpha-AI public homepage experience replaces the legacy AI-presence/lifecycle render in app/page. Animated three-chapter concept and guided scripted chat are clearly labeled previews, not inference or live telemetry.
- Primary homepage navigation, hero, metadata, sections and footer use public DeltaAlpha/Alpha-AI names. Other pages, source metadata and public asset URLs still need comprehensive privacy and nomenclature audit.
- Standalone /alpha-ai-preview route is noindex for staging review.

## What is NOT certified
- No production AI inference adapter or public capability registry is connected.
- No complete support ticket lifecycle or Tidio webhook-to-staff acceptance evidence.
- No WhatsApp Business credentials, webhook validation or customer consent flow.
- No private Whalez-Mail inbox exposed or integrated through the public surface.
- No end-to-end real user session/MFA/entitlement verification.
- No WhalezChain production finality, settlement, transfer or custody certification.
- No Vercel staging checks, E2E tests, ROOT governance approval or Founder release authorization completed by this code-only staging commit.
- Local Termux checkout is still dirty and remains intentionally untouched; it must be compared and preserved before any branch promotion.

## PR lineage / cherry-pick boundaries
- #40 public auth, #42 visuals, #45 public privacy reconciliation target integration/delta-pr15-truth; review these before choosing the final release ancestry.
- #50/51/52 target release/living-intelligence-presence-20261023, NOT main. Their raw merges are neither complete nor production-authorized.
- #46 Tidio is an older draft and should not be merged in parallel with the newer integrated Tidio entry path without file-by-file reconciliation.
- #15 WhalezChain remains a SEPARATE repository and monetary correctness gate. Never merge it as part of this frontend branch.
- Founder Console and ROOT governance PRs remain independent, require scoped reviews and must not be implied approved by this preview.

## Release acceptance
- Preserve untracked and modified Termux files first, build clean source worktree, use compare + cherry-pick with explicit conflict review.
- Confirm exact host denial on www and direct preview URLs for private routes.
- Verify public source and compiled bundles do not leak Founder identity/private systems; verify metadata and robots.
- Test real signup/login with proper auth not demo fallback; verify staff MFA; test support case from request to authorised staff and reply.
- Run TypeScript build, component tests, browser responsive/accessibility checks, webhooks and security checks.
- Only after signed Founder approval and independent deployment gate may any staging work be promoted.
