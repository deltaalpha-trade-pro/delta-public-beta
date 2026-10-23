import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign-in is temporarily unavailable"
      subtitle="This public deployment is currently operating without an enabled account-authentication bridge."
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">
          No credentials have been submitted. Request controlled beta access while account sign-in is being brought online.
        </p>
        <Button asChild className="w-full">
          <Link href="/beta-access">Request controlled beta access</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          This does not create an account or activate trading, custody, or settlement authority.
        </p>
      </div>
    </AuthCard>
  )
}
