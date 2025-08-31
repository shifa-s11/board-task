"use client"

import type { Task } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { toast } from "sonner"


const statusToVariant = {
  Pending: "pending",
  Critical: "critical",
  Urgent: "urgent",
  Complete: "complete",
} as const

type StatusVariant = (typeof statusToVariant)[keyof typeof statusToVariant]

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task
  onEdit: () => void
  onDelete: (taskId: string) => Promise<void>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const [isDeleting, setIsDeleting] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  }

  const handleDeleteClick = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } catch {
      toast.error("Failed to delete task.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-transparent shadow-md transition-all duration-200 ease-in-out hover:shadow-lg dark:bg-zinc-900 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <Card className="p-4 bg-white dark:bg-zinc-950 h-full">
        <div className="flex items-start justify-between">
          {/* drag handle */}
          <div
            {...listeners}
            {...attributes}
            className="p-1 -ml-1 text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0 px-2">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 break-words">{task.title}</div>
            {task.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 break-words">{task.description}</p>
            )}
          </div>

          {/* edit/delete dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Task actions"
                className="dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-zinc-900 dark:border-zinc-700"
            >
              <DropdownMenuItem
                onClick={onEdit}
                className="text-zinc-900 dark:text-zinc-100"
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-red-600 dark:text-red-400"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* status + metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={statusToVariant[task.status] as StatusVariant} className="capitalize">
            {task.status}
          </Badge>
          {task.assignee && (
            <Badge
              variant="secondary"
              className="bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white"
            >
              {task.assignee}
            </Badge>
          )}
          {task.dueDate && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </Card>
    </div>
  )
}

