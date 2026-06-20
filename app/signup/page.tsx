"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/lib/auth/client"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)

    const res = await signup({
      email,
      password,
      fullName: "",
      company: "",
      accountLevel: "basic"
    })

    setLoading(false)

    if (res?.success) {
      localStorage.setItem("pending_email", email)
      router.push("/verify")
    } else {
      alert(res?.error || "Signup failed")
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Create Account</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </div>
  )
}
