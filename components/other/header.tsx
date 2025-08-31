"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, User } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "@/components/other/sidebar"
import Link from "next/link"
import { useProfile, useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const router = useRouter()
  const { logout } = useAuth()

  const userInitials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('')
    : profile?.email 
      ? profile.email[0].toUpperCase()
      : "NA";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 dark:bg-zinc-950 dark:border-zinc-800">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          {/* Logo/Brand Name */}
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-500 transition-colors hover:text-emerald-700">
            Kanban Flow
          </Link>
        </div>
        
        {/* User Account Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0" aria-label="User menu">
                <Avatar className="h-9 w-9 border-2 border-emerald-500 transition-transform duration-200 hover:scale-105">
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-md shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
              <DropdownMenuLabel className="text-zinc-900 dark:text-zinc-100">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-zinc-700" />
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-zinc-700">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}