// Authentication utilities and session management

import type { User } from "./types"
import { db } from "./database"

// Simple session storage (in production, use secure session management)
const sessions = new Map<string, { userId: string; expiresAt: Date }>()

export const auth = {
  // Login function
  login: async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
    const user = db.users.findByEmail(email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In production, use proper password hashing (bcrypt, etc.)
    if (user.password !== password) {
      return { success: false, error: "Invalid password" }
    }

    // Generate session token
    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    sessions.set(token, { userId: user.id, expiresAt })

    return {
      success: true,
      user: { ...user, password: undefined } as User, // Don't send password
      token,
    }
  },

  // Verify session token
  verifyToken: (token: string): User | null => {
    const session = sessions.get(token)

    if (!session || session.expiresAt < new Date()) {
      if (session) sessions.delete(token) // Clean up expired session
      return null
    }

    const user = db.users.findById(session.userId)
    return user ? ({ ...user, password: undefined } as User) : null
  },

  // Logout function
  logout: (token: string): boolean => {
    return sessions.delete(token)
  },

  // Check if user has required role
  hasRole: (user: User, requiredRole: string | string[]): boolean => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(user.role)
  },

  // Check if user can access resource
  canAccess: (user: User, resource: string): boolean => {
    const permissions = {
      admin: ["*"], // Admin can access everything
      faculty: ["timetables:read", "profile:read", "profile:update"],
      coordinator: [
        "timetables:read",
        "timetables:create",
        "timetables:update",
        "data:read",
        "data:create",
        "data:update",
      ],
    }

    const userPermissions = permissions[user.role] || []
    return userPermissions.includes("*") || userPermissions.includes(resource)
  },
}

// Generate a simple session token (in production, use crypto.randomBytes)
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Middleware function for API routes
export function requireAuth(requiredRole?: string | string[]) {
  return (handler: Function) => {
    return async (req: any, res: any) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token

      if (!token) {
        return res.status(401).json({ error: "Authentication required" })
      }

      const user = auth.verifyToken(token)
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" })
      }

      if (requiredRole && !auth.hasRole(user, requiredRole)) {
        return res.status(403).json({ error: "Insufficient permissions" })
      }

      req.user = user
      return handler(req, res)
    }
  }
}
