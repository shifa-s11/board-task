"use client"

import { useParams, useRouter } from "next/navigation"
import { useBoards, useTasks } from "@/hooks/use-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { TaskCard } from "@/components/other/boards-comp/task-card"
import { KanbanBoard } from "@/components/other/boards-comp/board-drag"
import { Dialog } from "@/components/ui/dialog"
import { TaskDialog } from "@/components/other/boards-comp/task-dialog"
import type { Task, TaskInput } from "@/lib/types"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

export default function BoardDetailPage() {
  const params = useParams<{ id: string }>()
  const boardId = params.id
  const { boards } = useBoards()
  const board = useMemo(() => boards.find((b) => b.id === boardId), [boards, boardId])
  const { tasks, upsertTask, deleteTask, moveTask } = useTasks(boardId)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [isUpserting, setIsUpserting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Auth and hydration checks
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, isAuthLoading, router])

  if (!hydrated || isAuthLoading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!board) {
    return (
      <section className="space-y-4 p-4 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/projects")} className="text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Board not found.</p>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">The requested board could not be found. It may have been deleted.</p>
        </div>
      </section>
    )
  }

  const grouped = {
    Pending: tasks.filter((t) => t.status === "Pending"),
    Critical: tasks.filter((t) => t.status === "Critical"),
    Urgent: tasks.filter((t) => t.status === "Urgent"),
    Complete: tasks.filter((t) => t.status === "Complete"),
  }

  const handleUpsertTask = async (values: TaskInput, taskId?: string) => {
    setIsUpserting(true)
    try {
      await upsertTask({ boardId, id: taskId, ...values })
      toast.success(taskId ? "Task updated!" : "Task created!", {
        description: taskId ? `The task has been successfully updated.` : `A new task has been created.`,
      })
      setOpen(false)
      setEditing(null)
    } catch (err) {
      toast.error("Failed to save task.", {
        description: `Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
      })
    } finally {
      setIsUpserting(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setIsDeleting(true)
    try {
      await deleteTask(taskId)
      toast.success("Task deleted!", {
        description: `The task has been permanently removed.`,
      })
    } catch (err) {
      toast.error("Failed to delete task.", {
        description: `Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="space-y-6 container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/projects")} className="text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{board.name}</h1>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        onMove={moveTask}
        renderColumn={(status) =>
          (grouped as any)[status].map((task: Task) => (
            <div key={task.id} id={task.id} className="mb-4">
              <TaskCard
                task={task}
                onEdit={() => setEditing(task)}
                onDelete={() => handleDeleteTask(task.id)}
                isDeleting={isDeleting}
              />
            </div>
          ))
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        {open && <TaskDialog onSubmit={handleUpsertTask} onClose={() => setOpen(false)} isSaving={isUpserting} />}
      </Dialog>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        {editing && (
          <TaskDialog
            initial={editing}
            onSubmit={(v) => handleUpsertTask(v, editing.id)}
            onClose={() => setEditing(null)}
            isSaving={isUpserting}
          />
        )}
      </Dialog>
    </section>
  )
}