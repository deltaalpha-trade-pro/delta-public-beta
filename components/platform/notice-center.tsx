import type { PublicPlatformState } from "@/lib/platform/types"

export function NoticeCenter({ state }: { state: PublicPlatformState }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Statements & Notices</p>
        <div className="mt-5 space-y-4">
          {state.notices.slice(0, 3).map((notice) => (
            <div key={notice.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{notice.title}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{notice.tone}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{notice.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Support & Events</p>
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">{state.support.channel}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Response target: {state.support.responseTarget}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Escalation posture: {state.support.escalationAvailable ? "Available when policy review requires it." : "Unavailable"}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {state.events.slice(0, 3).map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">{event.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{event.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
