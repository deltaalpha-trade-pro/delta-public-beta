"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("pending_email")
      : null

  const verify = async () => {
    setLoading(true)

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      router.push("/dashboard")
    } else {
      alert(data.error || "Verification failed")
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Verify Account</h1>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 5-digit code"
      />

      <button onClick={verify} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  )
}
