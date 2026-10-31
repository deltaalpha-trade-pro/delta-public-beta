import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  Activity, BellRing, Bot, ChartNoAxesCombined, CircleHelp, ClipboardCheck,
  DatabaseZap, Headset, Landmark, LockKeyhole, MailCheck, MessageSquareText,
  ShieldCheck, ShieldAlert, UsersRound, Wallet, Workflow, Boxes, ArrowUpRight,
} from "lucide-react"
import { adminAccessGranted } from "@/lib/admin-console/authorization"
import { adminIntegrationReadiness, type Readiness } from "@/lib/admin-console/readiness"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const metadata: Metadata = {
  title: "Admin Control Panel | DeltaAlpha-Trade-Pro",
  robots: { index: false, follow: false, noarchive: true },
}

const sections = [
  { href: "#overview", label: "Overview", icon: ChartNoAxesCombined },
  { href: "#customers", label: "Citizens & accounts", icon: UsersRound },
  { href: "#communications", label: "Whalez-Mail", icon: MailCheck },
  { href: "#engagement", label: "Tidio & Lyro", icon: Headset },
  { href: "#intelligence", label: "AI operations", icon: Bot },
  { href: "#security", label: "Security & audit", icon: ShieldCheck },
  { href: "#financial", label: "Financial readiness", icon: Landmark },
]

function Status({ value }: { value: Readiness | "blocked" | "unverified" | "read-only" }) {
  const text = value === "configured-not-verified" ? "Configured · unverified" :
    value === "disabled" ? "Disabled" : value === "blocked" ? "Blocked" :
    value === "read-only" ? "Read-only" : "Not verified"
  const color = value === "blocked" ? "border-rose-500/30 bg-rose-500/10 text-rose-300" :
    value === "configured-not-verified" ? "border-sky-500/30 bg-sky-500/10 text-sky-300" :
    "border-amber-500/30 bg-amber-500/10 text-amber-300"
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}>{text}</span>
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 ${className}`}>{children}</div>
}

function Heading({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <div className="mb-5"><p className="text-xs uppercase tracking-[0.16em] text-sky-400">{kicker}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div>
}

const serviceAreas = [
  { icon: UsersRound, title: "Account governance", copy: "Verification, admission reviews, account levels and staff assignment require independently scoped backend APIs.", status: "Not connected" },
  { icon: Wallet, title: "Portfolio intelligence", copy: "Account-specific analysis and coaching must be backed by authorized real portfolio data, never invented balances.", status: "Not connected" },
  { icon: ClipboardCheck, title: "Compliance review", copy: "KYC disputes, payment investigations and exceptions require human review and an audit trail.", status: "Manual review" },
  { icon: BellRing, title: "Notification center", copy: "Delivery receipts and customer notices remain unverified pending mail-provider and template acceptance checks.", status: "Not verified" },
]

export default async function AdminControlPanelPage() {
  if (!(await adminAccessGranted())) notFound()
  const integrations = adminIntegrationReadiness()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/60 px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-2.5"><Boxes className="h-6 w-6 text-sky-400" aria-hidden /></div>
            <div><p className="font-semibold tracking-tight">DeltaAlpha-Trade-Pro</p><p className="text-xs text-slate-400">Administration / Whalez-AI</p></div>
          </div>
          <div className="mt-7 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
            <div className="flex items-center gap-2 font-medium"><LockKeyhole className="h-4 w-4" aria-hidden /> Restricted mode</div>
            <p className="mt-1 text-xs leading-5 text-amber-100/75">Read-only control surface. Founder, ROOT and settlement authority are never inherited.</p>
          </div>
          <nav className="mt-7" aria-label="Administration sections">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Control areas</p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{sections.map(({href,label,icon:Icon}) =>
              <a key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 sm:text-sm">
                <Icon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden /><span>{label}</span>
              </a>
            )}</div>
          </nav>
          <div className="mt-8 text-xs text-slate-500">No live execution · No credential display · No customer data exported</div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div id="overview" className="scroll-mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-sm font-medium text-sky-400">Enterprise operations</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">Admin Control Panel</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A unified administration workspace for customer operations, engagement, communications, risk oversight and governed intelligence.</p></div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200"><Activity className="h-4 w-4" aria-hidden /> Restricted · not launch certified</span>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <Panel><p className="text-sm text-slate-400">Operating authority</p><div className="mt-2 flex items-center gap-2 text-xl font-semibold">Admin <ShieldCheck className="h-5 w-5 text-sky-400" /></div><p className="mt-2 text-xs text-slate-500">Server-verified role, email and MFA required</p></Panel>
              <Panel><p className="text-sm text-slate-400">Live financial execution</p><div className="mt-3"><Status value="blocked" /></div><p className="mt-3 text-xs text-slate-500">Do not interpret demos as settled trades</p></Panel>
              <Panel><p className="text-sm text-slate-400">Communication providers</p><div className="mt-3"><Status value="unverified" /></div><p className="mt-3 text-xs text-slate-500">Independent delivery and operator tests required</p></Panel>
            </div>
          </div>

          <section id="customers" className="mt-11 scroll-mt-6">
            <Heading kicker="Customer operations" title="Citizens, accounts & support" description="Administrative capabilities are separated from customer self-service and private Founder functions." />
            <div className="grid gap-4 md:grid-cols-2">{serviceAreas.map(({icon:Icon,title,copy,status}) =>
              <Panel key={title}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-sky-400" aria-hidden /><h3 className="font-medium text-white">{title}</h3></div><span className="shrink-0 text-xs text-amber-300">{status}</span></div><p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p></Panel>
            )}</div>
          </section>

          <section id="communications" className="mt-11 scroll-mt-6">
            <Heading kicker="Whalez-Mail" title="Communications control" description="Whalez-Mail owns the private communications adapter; Resend is a delivery provider. A configured relay does not prove an inbox works." />
            <Panel>
              <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><MailCheck className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="text-lg font-medium">Mail service integration</h3></div><Status value={integrations.whalezMail.ingestion} /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-slate-500">Private service authentication</p><div className="mt-2"><Status value={integrations.whalezMail.authenticatedRelay} /></div></div>
                <div><p className="text-xs text-slate-500">Resend delivery confirmation</p><div className="mt-2"><Status value={integrations.whalezMail.providerDelivery} /></div></div>
                <div><p className="text-xs text-slate-500">Human-monitored support inbox</p><div className="mt-2"><Status value={integrations.whalezMail.inboundSupportInbox} /></div></div>
                <div><p className="text-xs text-slate-500">Signed delivery and audit receipts</p><div className="mt-2"><Status value={integrations.whalezMail.auditReceipts} /></div></div>
              </div>
              <p className="mt-6 rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-300">Operational boundary: human-approved customer notices, access recovery, support escalation and delivery evidence. This panel cannot send mail, read private inbox messages or approve sensitive requests.</p>
            </Panel>
          </section>

          <section id="engagement" className="mt-11 scroll-mt-6">
            <Heading kicker="Customer engagement" title="Tidio, Lyro & live support" description="Customer-facing chat and AI assistance remain separate from verified account identity, payments and execution." />
            <div className="grid gap-4 md:grid-cols-2">
              <Panel><div className="flex items-center gap-3"><MessageSquareText className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="font-medium">Tidio website widget</h3></div><div className="mt-4"><Status value={integrations.tidio.widget} /></div><p className="mt-4 text-sm leading-6 text-slate-400">Public identifier configuration only. Confirm the live widget and operator inbox inside Tidio before claiming service availability.</p></Panel>
              <Panel><div className="flex items-center gap-3"><Workflow className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="font-medium">Signed event relay</h3></div><div className="mt-4"><Status value={integrations.tidio.webhook} /></div><p className="mt-4 text-sm leading-6 text-slate-400">Webhook availability depends on the provider plan, signature verification, replay controls and authenticated Whalez-Mail ingestion.</p></Panel>
              <Panel><div className="flex items-center gap-3"><Headset className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="font-medium">Human operator handoff</h3></div><p className="mt-4 text-sm text-sky-300">Human review required</p><p className="mt-3 text-sm leading-6 text-slate-400">Disputes, identity changes, refunds, security incidents and regulated questions are not resolved autonomously by Lyro or other agents.</p></Panel>
              <Panel><div className="flex items-center gap-3"><CircleHelp className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="font-medium">Provider availability</h3></div><div className="mt-4"><Status value="unverified" /></div><p className="mt-4 text-sm leading-6 text-slate-400">Tidio plan entitlement, operator inbox tests and live provider events have not been independently verified by this application.</p></Panel>
            </div>
          </section>

          <section id="intelligence" className="mt-11 scroll-mt-6">
            <Heading kicker="Governed intelligence" title="Whalez-AI service modes" description="Intelligence may advise, narrate and analyze within approved scopes. It cannot impersonate a customer or make irreversible decisions." />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Bot, name: "Public narrator", note: "Live voice and engagement require a verified dedicated service and policy." },
                { icon: Activity, name: "Signal intelligence", note: "Market signals require verified source attribution, timestamps and risk notices." },
                { icon: ChartNoAxesCombined, name: "Financial coaching", note: "Personalized guidance must respect verified account permissions and portfolio access." },
              ].map(({icon:Icon,name,note}) => <Panel key={name}><Icon className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="mt-4 font-medium text-white">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{note}</p><p className="mt-4 text-xs text-amber-300">Integration not verified</p></Panel>)}
            </div>
          </section>

          <section id="security" className="mt-11 scroll-mt-6">
            <Heading kicker="Trust and governance" title="Identity, policy & audit" description="All management permissions must be enforced by trusted backend identities, with independent controls for high-risk actions." />
            <Panel><div className="grid gap-6 sm:grid-cols-2">
              <div><ShieldCheck className="h-6 w-6 text-sky-400" aria-hidden /><h3 className="mt-3 font-medium">Administrator boundary</h3><p className="mt-2 text-sm text-slate-400">Dedicated hostname, explicit enable flag, verified admin role, email verification and MFA evidence. Deny on uncertainty.</p></div>
              <div><ShieldAlert className="h-6 w-6 text-amber-400" aria-hidden /><h3 className="mt-3 font-medium">Founder and ROOT boundary</h3><p className="mt-2 text-sm text-slate-400">No Founder Console, policy override, signer access, minting, settlement, infrastructure mutation or arbitrary tool execution.</p></div>
            </div></Panel>
          </section>

          <section id="financial" className="mt-11 scroll-mt-6">
            <Heading kicker="Global fintech readiness" title="Financial execution & ecosystem assets" description="A product-readiness overview, not a representation of custody, asset valuation, network finality or live trade execution." />
            <Panel><div className="grid gap-4 sm:grid-cols-3">{["PTN", "PRN", "WHZ"].map(symbol => <div key={symbol} className="rounded-xl border border-slate-800 bg-slate-950 p-4"><div className="flex items-center gap-2"><DatabaseZap className="h-5 w-5 text-sky-400" aria-hidden /><span className="font-semibold">{symbol}</span></div><div className="mt-4"><Status value="blocked" /></div><p className="mt-2 text-xs text-slate-500">Production allocation / settlement unverified</p></div>)}</div><p className="mt-5 text-sm leading-6 text-slate-400">WhalezChain network certification, signer isolation, allocation approvals and settlement evidence are required before any production financial claim or control is enabled.</p></Panel>
          </section>

          <footer className="mt-12 border-t border-slate-800 py-6 text-xs text-slate-500">DeltaAlpha-Trade-Pro Administration · An interface within the Whalez-AI Ecosystem · No automatic execution or provider spending</footer>
        </main>
      </div>
    </div>
  )
}
