"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })

async function onSubmit(values: LoginInput) {
  setIsLoading(true)
  try {
    await login(values.email, values.password)
    toast.success("Check your email", {
      description: "Enter the 6-digit OTP to continue.",
    })
    router.push("/otp")
  } catch (err: unknown) {
    let errorMessage = "Unable to login"
    if (err instanceof Error) {
      errorMessage = err.message
    }
    toast.error("Login failed", {
      description: errorMessage,
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
            Welcome back 👋
          </CardTitle>
          <CardDescription className="mt-2 text-balance text-zinc-600 dark:text-zinc-400">
            Sign in to continue to FlowLabel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        type="password"
                        autoComplete="current-password"
                        className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                    <div className="flex justify-end text-sm">
                      <Link href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                        Forgot password?
                      </Link>
                    </div>
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
                    Signing in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            By continuing you agree to our{" "}
            <Link href="#" className="font-medium text-zinc-700 underline underline-offset-2 hover:text-emerald-600 dark:text-zinc-300">
              Terms
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </main>
  )
}