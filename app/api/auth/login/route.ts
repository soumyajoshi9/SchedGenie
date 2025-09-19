import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { seedDatabase } from "@/lib/database"

// Initialize database with seed data
seedDatabase()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const result = await auth.login(email, password)

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        user: result.user,
        token: result.token,
      })

      // Set httpOnly cookie for additional security
      response.cookies.set("token", result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
      })

      return response
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
