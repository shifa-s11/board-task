"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function ForgotPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4 bg-gray-100 dark:bg-zinc-950">
      <Card className="max-w-md w-full rounded-xl border-none shadow-xl dark:bg-zinc-900">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-balance">
            Oops — Feature coming soon
          </CardTitle>
          <CardDescription className="mt-2 text-zinc-600 dark:text-zinc-400 text-balance">
            Password reset isn’t implemented in this local-only demo. Continue with the Login → OTP flow to access the
            app (use code 123456).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors">
            <Link href="/login">Back to Login</Link>
          </Button>
          <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
            Tip: You can update your profile details after signing in.
          </p>
        </CardContent>
      </Card>
 </main>
 )}