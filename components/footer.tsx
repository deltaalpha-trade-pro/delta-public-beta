import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#081019]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">DeltaAlpha-TradePro</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            Account-based public platform access with guided onboarding, dashboard visibility, and controlled engine eligibility.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Platform</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link href="/signup" className="block hover:text-white">
              Create Account
            </Link>
            <Link href="/login" className="block hover:text-white">
              Sign In
            </Link>
            <Link href="/dashboard" className="block hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Support</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link href="/beta-access" className="block hover:text-white">
              Guided Access
            </Link>
            <Link href="/recover" className="block hover:text-white">
              Recover Account
            </Link>
            <Link href="/legal" className="block hover:text-white">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
