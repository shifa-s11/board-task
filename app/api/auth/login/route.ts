import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    // Issue a fake session token (not secure - mock only)
    const token = `mock-token-${Math.random().toString(36).slice(2)}`
    const userId = `user_${Buffer.from(email).toString("base64").slice(0, 8)}`
    return NextResponse.json({ ok: true, token, user: { id: userId, email } })
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
