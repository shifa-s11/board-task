"use client"

import { useBoards } from "@/hooks/use-board"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2,LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const { boards, createBoard, renameBoard, deleteBoard } = useBoards()
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [rename, setRename] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, isLoading, router])

  if (!hydrated || isLoading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-dvh w-full bg-gray-50 dark:bg-zinc-950 p-4 md:p-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Boards</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Organize your tasks by boards.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Create Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Board name"
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    if (name.trim().length < 2) return
                    const b = await createBoard(name.trim())
                    toast.success("Board created", { description: b.name })
                    setName("")
                    setOpen(false)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {boards.length === 0 ? (
          <Card className="border-dashed bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader>
              <CardTitle>No boards yet</CardTitle>
              <CardDescription>Get started by creating your first board.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Create Board
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <Card
                key={b.id}
                className="group bg-white dark:bg-zinc-900 shadow-md transition hover:shadow-lg"
              >
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="truncate">{b.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(b.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 text-sm text-zinc-600 hover:text-emerald-700 dark:text-zinc-300"
      aria-label="Board actions"
    >
      <Pencil className="h-4 w-4" />
      Edit
    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setRenamingId(b.id)
                          setRename(b.name)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          await deleteBoard(b.id)
                          toast.success("Board deleted")
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <Link className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors" href={`/boards/${b.id}`}>
 <LinkIcon className="h-4 w-4 mr-1" />
 Open board
</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {renamingId && (
          <Dialog open onOpenChange={() => setRenamingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rename Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                <label className="text-sm font-medium">New name</label>
                <Input
                  value={rename}
                  onChange={(e) => setRename(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    if (rename.trim().length < 2) return
                    await renameBoard(renamingId, rename.trim())
                    setRenamingId(null)
                    setRename("")
                    toast.success("Board renamed")
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </main>
  )
}
