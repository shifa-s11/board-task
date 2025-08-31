"use client"

import { type ReactNode, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "./header"
import { SidebarNav } from "./sidebar"
import { readJSON, STORAGE_KEYS } from "@/lib/storage"

export function ProtectedShell({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const storedAuth = readJSON<string | null>(STORAGE_KEYS.AUTH, null)
    if (!isAuthenticated || !storedAuth) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:flex w-60 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <SidebarNav />
        </aside>
        <aside className="md:hidden fixed inset-y-0 left-0 z-40 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 peer-open:translate-x-0">
          <SidebarNav />
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
