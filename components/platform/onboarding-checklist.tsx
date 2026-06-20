export function OnboardingChecklist({ items }: any) {
  return (
    <div>
      {items.map((item: any, index: number) => {
        const label = String(item.label ?? index)
        return (
          <div
            key={label}
            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
