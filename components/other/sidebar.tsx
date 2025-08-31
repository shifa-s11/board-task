"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, KanbanSquare, Settings } from "lucide-react"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Project Management", icon: KanbanSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ]
  return (
    <aside className="h-full w-full flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 transition-colors pt-8">

      <nav className="flex-1 p-4 space-y-2 pt-8">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
