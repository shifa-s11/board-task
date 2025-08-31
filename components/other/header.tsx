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
import { Menu, Plus, Search, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar"
import Link from "next/link"
import { useProfile, useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useBoards } from "@/hooks/use-board"

export function Header() {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const initials = (profile?.name || "User")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const router = useRouter()
  const { logout } = useAuth()
  const { createBoard } = useBoards()

  // Theme toggle
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored ? stored === "dark" : !!prefersDark
    setIsDark(dark)
    if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", dark)
  }, [])
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("theme", isDark ? "dark" : "light")
    if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const [query, setQuery] = useState("")

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md shadow-sm transition-colors">
      <div className="flex h-14 items-center px-4 gap-3">
        {/* Mobile Sidebar Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-xl hover:bg-accent">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <Link
          href="/dashboard"
          className="font-bold text-3xl px-6 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent hover:opacity-90 transition"
        >
          FlowLabel
        </Link>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/projects?q=${encodeURIComponent(query)}`)
              }}
              placeholder="Search boards and tasks..."
              className="pl-10 rounded-xl focus:ring-2 focus:ring-emerald-500 transition"
              aria-label="Search"
            />
          </div>
          
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setIsDark((v) => !v)}
            className="hidden md:inline-flex rounded-xl hover:bg-accent"
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 rounded-full hover:ring-2 hover:ring-emerald-500 transition"
                aria-label="User menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-emerald-600 text-white font-medium">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>👤 Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>⚙️ Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                🚪 Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}


// "use client"

// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Menu, Plus, Search, Sun, Moon, LogOut, User } from "lucide-react"
// import { useEffect, useState } from "react"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { SidebarNav } from "./sidebar"
// import Link from "next/link"
// import { useProfile, useAuth } from "@/hooks/use-auth"
// import { useRouter } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { useBoards } from "@/hooks/use-board"
// import { toast } from "sonner"


// export function Header() {
//   const [open, setOpen] = useState(false)
//   const { profile } = useProfile()
//   const userInitials = (profile?.name || "User").split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
//   const router = useRouter()
//   const { logout } = useAuth()
//   const { createBoard } = useBoards()

// const [isDark, setIsDark] = useState(false)
//   useEffect(() => {
//     const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
//     const prefersDark =
//       typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
//     const dark = stored ? stored === "dark" : !!prefersDark
//     setIsDark(dark)
//     if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", dark)
//   }, [])
//   useEffect(() => {
//     if (typeof window !== "undefined") localStorage.setItem("theme", isDark ? "dark" : "light")
//     if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", isDark)
//   }, [isDark])

//   const [query, setQuery] = useState("")

//   const handleCreateBoard = async () => {
//     const name = window.prompt("Enter new board name:");
//     if (name) {
//       try {
//         const board = await createBoard(name.trim());
//         toast.success(`Board "${board.name}" created!`);
//         router.push(`/boards/${board.id}`);
//       } catch (error) {
//         toast.error("Failed to create board.");
//       }
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push("/login");
//   };

//   return (
//     <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8 gap-3">
//         <Sheet open={open} onOpenChange={setOpen}>
//           <SheetTrigger asChild className="md:hidden">
//             <Button variant="ghost" size="icon" aria-label="Open menu">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-72">
//             <SidebarNav onNavigate={() => setOpen(false)} />
//           </SheetContent>
//         </Sheet>
        
//         <Link href="/dashboard" className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
//           Kanban Flow
//         </Link>

//         {/* Search (desktop) */}
//         <div className="hidden md:flex items-center gap-2 ml-4 flex-1 max-w-xl">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
//             <Input
//               placeholder="Search boards and tasks..."
//               className="pl-10 h-10 rounded-full border-zinc-300 bg-zinc-100 text-zinc-900 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
//               aria-label="Search"
//             />
//           </div>
//           <Button onClick={handleCreateBoard} className="bg-emerald-600 hover:bg-emerald-700 rounded-full text-sm font-semibold">
//             <Plus className="h-4 w-4 mr-1" />
//             New
//           </Button>
//         </div>

//         <div className="ml-auto flex items-center gap-2">
//           {/* Theme toggle */}
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label="Toggle theme"
//             onClick={() => setIsDark(!isDark)}
//             className="hidden md:inline-flex rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
//           >
//             {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="px-2" aria-label="User menu">
//                 <Avatar className="h-8 w-8 border border-emerald-600 dark:border-emerald-500 transition-transform hover:scale-105">
//                   <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 font-semibold">{userInitials}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="dark:bg-zinc-900 dark:border-zinc-700">
//               <DropdownMenuLabel className="font-semibold">{profile?.name || "My Account"}</DropdownMenuLabel>
//               <DropdownMenuSeparator className="dark:bg-zinc-700" />
//               <DropdownMenuItem onClick={() => router.push("/profile")} className="text-zinc-900 dark:text-zinc-100">
//                 <User className="h-4 w-4 mr-2" /> Profile
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => router.push("/settings")} className="text-zinc-900 dark:text-zinc-100">
//                 <Settings className="h-4 w-4 mr-2" /> Settings
//               </DropdownMenuItem>
//               <DropdownMenuSeparator className="dark:bg-zinc-700" />
//               <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
//                 <LogOut className="h-4 w-4 mr-2" /> Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }