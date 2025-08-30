import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return NextResponse.json({ error: "email and code are required" }, { status: 400 })
    if (String(code).length !== 6) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 })
    }
    return NextResponse.json({ ok: true, email })
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}