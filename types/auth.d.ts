declare module '#auth-utils' {
  type UserRole = 'viewer' | 'contributor'

  interface User {
    role: UserRole
  }

  interface UserSession {
    lastAttemptAt?: number
  }
}

export {}
