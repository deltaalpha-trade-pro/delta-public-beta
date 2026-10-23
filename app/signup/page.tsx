import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    <AuthCard
      title="Account creation is not enabled yet"
      subtitle="New account creation remains gated until the production authentication service is verified."
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">
          The public deployment does not currently accept new account credentials. You can request controlled beta access for review.
        </p>
        <Button asChild className="w-full">
          <Link href="/beta-access">Request controlled beta access</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          A beta access request is not an account, approval, or permission to use live financial services.
        </p>
      </div>
    </AuthCard>
  )
}
