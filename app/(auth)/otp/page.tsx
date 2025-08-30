"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OtpSchema, type OtpInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth, useProfile } from "@/hooks/use-auth"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

export default function OtpPage() {
  const router = useRouter()
  const { verifyOtp } = useAuth()
  const { profile } = useProfile()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OtpInput>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  })

  async function onSubmit(values: OtpInput) {
    setIsLoading(true)
    try {
      if (!profile?.email) {
        toast.error("Missing email", {
          description: "Please log in again.",
        })
        return router.replace("/login")
      }
      await verifyOtp(profile.email, values.code)
      toast.success("Authenticated", {
        description: "Welcome!",
      })
      router.replace("/profile")
    } catch (err: any) {
      toast.error("Invalid OTP", {
        description: String(err?.message ?? "Please try again"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-100 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm rounded-xl border-none shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl dark:bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Enter OTP 🔐
          </CardTitle>
          <CardDescription className="mt-2 text-balance text-zinc-600 dark:text-zinc-400">
            We've sent a 6-digit code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="sr-only">One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                        disabled={isLoading}
                      >
                        <InputOTPGroup className="flex w-full justify-center">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                      For testing purposes, use:{" "}
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        123456
                      </span>
                    </div>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-md bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
