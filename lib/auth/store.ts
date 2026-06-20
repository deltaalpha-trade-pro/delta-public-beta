type User = {
  email: string
  password: string
  status: "PENDING_VERIFICATION" | "VERIFIED"
  verificationCode: string
}

const users = new Map<string, User>()

export const store = {
  createUser(user: User) {
    users.set(user.email, user)
  },

  getUser(email: string) {
    return users.get(email)
  },

  updateUser(email: string, data: Partial<User>) {
    const user = users.get(email)
    if (!user) return null
    const updated = { ...user, ...data }
    users.set(email, updated)
    return updated
  }
}
