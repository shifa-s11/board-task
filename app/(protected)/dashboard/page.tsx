"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { readJSON, STORAGE_KEYS } from "@/lib/storage"
import type { Task } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Plus, LinkIcon, Loader2 } from "lucide-react"
import { useBoards } from "@/hooks/use-board"
import { toast } from "sonner"

const fetcher = async <T,>(key: string): Promise<T> => {
  const data = readJSON<T>(key, [] as unknown as T); 
  if (data === null) {
    return Promise.resolve([] as unknown as T);
  }
  return Promise.resolve(data);
};

export default function DashboardPage() {
  const router = useRouter()
const { boards, createBoard, isBoardsLoading } = useBoards()
  const { data: allTasks = [], isLoading: isTasksLoading } = useSWR<Task[]>(
    STORAGE_KEYS.TASKS,
    (k) => fetcher<Task[]>(k),
    {
      fallbackData: [],
      revalidateOnFocus: true,
    }
  )

  const stats = useMemo(() => {
    const totalBoards = boards.length
    const totalTasks = allTasks.length
    const byStatus = {
      Pending: allTasks.filter((t) => t.status === "Pending").length,
      Critical: allTasks.filter((t) => t.status === "Critical").length,
      Urgent: allTasks.filter((t) => t.status === "Urgent").length,
      Complete: allTasks.filter((t) => t.status === "Complete").length,
    }
    const recent = [...allTasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
    return { totalBoards, totalTasks, byStatus, recent }
  }, [boards, allTasks])

  const [boardName, setBoardName] = useState("")
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)

  async function handleCreateBoard() {
    if (boardName.trim().length < 2) {
      toast.error("Board name must be at least 2 characters.");
      return;
    }
    setIsCreatingBoard(true);
    try {
      const b = await createBoard(boardName.trim())
      setBoardName("")
      toast.success("Board created!", {
        description: `Board "${b.name}" has been created.`,
      })
      router.push(`/boards/${b.id}`)
    } catch (err) {
      toast.error("Failed to create board.", {
        description: `Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
      });
    } finally {
      setIsCreatingBoard(false);
    }
  }

  const chartData = [
    { status: "Pending", value: stats.byStatus.Pending },
    { status: "Critical", value: stats.byStatus.Critical },
    { status: "Urgent", value: stats.byStatus.Urgent },
    { status: "Complete", value: stats.byStatus.Complete },
  ];

  if (isBoardsLoading || isTasksLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-zinc-500">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
            Overview of your boards and tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="outline" className="w-full sm:w-auto dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">Go to Projects</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full sm:w-auto dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">Edit Profile</Button>
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-xl border-none shadow-md transition-all duration-200 ease-in-out hover:shadow-lg dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Total Boards</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalBoards}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500 dark:text-zinc-400">All boards you’ve created</CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-md transition-all duration-200 ease-in-out hover:shadow-lg dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Total Tasks</CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTasks}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500 dark:text-zinc-400">Across all boards</CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-md transition-all duration-200 ease-in-out hover:shadow-lg dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Done</CardDescription>
            <CardTitle className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.byStatus.Complete}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500 dark:text-zinc-400">Tasks marked as completed</CardContent>
        </Card>
      </div>

      {/* Tasks by status chart */}
      <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Tasks by Status</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Distribution of tasks across your workflow</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {stats.totalTasks === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-sm text-zinc-500">
              <p>No tasks yet. Create a board to get started.</p>
              <Button onClick={() => router.push("/projects")} variant="link" className="mt-2 text-emerald-600">
                Go to Projects
              </Button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-zinc-300 dark:stroke-zinc-700" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} className="text-xs text-zinc-500 dark:text-zinc-400" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} className="text-xs text-zinc-500 dark:text-zinc-400" />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Quick create board + Boards preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Quick Create</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Spin up a new board</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Board name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              aria-label="Board name"
              className="flex-1 h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
              disabled={isCreatingBoard}
            />
            <Button onClick={handleCreateBoard} className="w-full sm:w-auto bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950" disabled={isCreatingBoard || boardName.trim().length < 2}>
              {isCreatingBoard ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Your Boards</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">Jump back into your work</CardDescription>
            </div>
            {boards.length > 6 && (
              <Link href="/projects">
                <Button variant="link" className="text-emerald-600 dark:text-emerald-400">View All</Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {boards.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No boards yet. Create one to begin.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {boards.slice(0, 6).map((b) => {
                  const count = allTasks.filter((t) => t.boardId === b.id)
                  const done = count.filter((t) => t.status === "Complete").length
                  return (
                    <li key={b.id} className="rounded-md border border-zinc-300 dark:border-zinc-700 p-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <div className="flex items-center justify-between">
                        <Link href={`/boards/${b.id}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                          {b.name}
                        </Link>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {done}/{count.length} done
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Created {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Recent Activity</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Latest task updates across boards</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No recent activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recent.map((t) => (
                <li key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md border border-zinc-300 dark:border-zinc-700 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">{t.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.status.replace("-", " ")} • {new Date(t.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge variant={t.status as 'default' | 'secondary' | 'outline'}>{t.status}</Badge>
                    <Separator orientation="vertical" className="h-6 dark:bg-zinc-700 hidden sm:block" />
                    <Link href={`/boards/${t.boardId}`} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" /> Open board
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}