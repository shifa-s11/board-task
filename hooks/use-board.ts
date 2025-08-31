"use client"

import useSWR from "swr"
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage"
import type { Board, Task } from "@/lib/types"


const readKey = async <T,>(key: string, fallback: T) =>
  Promise.resolve(readJSON<T>(key, fallback))

const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)


function seedIfEmpty() {
  const boards = readJSON<Board[]>(STORAGE_KEYS.BOARDS, [])
  const tasks = readJSON<Task[]>(STORAGE_KEYS.TASKS, [])

  if (boards.length === 0 && tasks.length === 0) {
    const bId = uid()
    const seededBoards: Board[] = [
      { id: bId, name: "My First Board", createdAt: now() },
    ]
    const seededTasks: Task[] = [
      {
        id: uid(),
        boardId: bId,
        title: "Welcome to your Kanban!",
        description: "",
        status: "Pending",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: uid(),
        boardId: bId,
        title: "Drag me to Critical",
        description: "",
        status: "Critical",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: uid(),
        boardId: bId,
        title: "And then to Complete ✅",
        description: "",
        status: "Complete",
        createdAt: now(),
        updatedAt: now(),
      },
    ]
    writeJSON(STORAGE_KEYS.BOARDS, seededBoards)
    writeJSON(STORAGE_KEYS.TASKS, seededTasks)
  }
}

export function useBoards() {
  seedIfEmpty()

 const { data, isLoading,error, mutate } = useSWR<Board[]>(
  STORAGE_KEYS.BOARDS,
  (k) => readKey<Board[]>(k, []),
  { fallbackData: readJSON<Board[]>(STORAGE_KEYS.BOARDS, []) }
)

const boards = data ?? []
  const createBoard = async (name: string) => {
    const next: Board = { id: uid(), name, createdAt: now() }
    const updated = [...boards, next]
    writeJSON(STORAGE_KEYS.BOARDS, updated)
    await mutate(updated, false)
    return next
  }

  const renameBoard = async (id: string, name: string) => {
    const updated = boards.map((b) =>
      b.id === id ? { ...b, name, createdAt: b.createdAt } : b
    )
    writeJSON(STORAGE_KEYS.BOARDS, updated)
    await mutate(updated, false)
  }

  const deleteBoard = async (id: string) => {
    const updatedBoards = boards.filter((b) => b.id !== id)
    const allTasks = readJSON<Task[]>(STORAGE_KEYS.TASKS, [])
    const updatedTasks = allTasks.filter((t) => t.boardId !== id)
    writeJSON(STORAGE_KEYS.BOARDS, updatedBoards)
    writeJSON(STORAGE_KEYS.TASKS, updatedTasks)
    await mutate(updatedBoards, false)
  }

  return { boards, createBoard, renameBoard, deleteBoard,
     isBoardsLoading: isLoading ?? (!data && !error),
   }
}

// --- Tasks Hook ---
export function useTasks(boardId: string) {
  const { data, mutate } = useSWR<Task[]>(
    STORAGE_KEYS.TASKS,
    (k) => readKey<Task[]>(k, []),
    { fallbackData: readJSON<Task[]>(STORAGE_KEYS.TASKS, []) }
  )

  const all = data ?? []
  const tasks = boardId ? all.filter((t) => t.boardId === boardId) : []

  const upsertTask = async (
    input: Omit<Task, "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    let updated = [...all]
    if (input.id) {
      updated = updated.map((t) =>
        t.id === input.id ? { ...t, ...input, updatedAt: now() } : t
      )
    } else {
      const created: Task = {
        id: uid(),
        boardId: input.boardId,
        title: input.title,
        description: input.description ?? "",
        status: input.status,
        assignee: input.assignee ?? "",
        dueDate: input.dueDate ?? "",
        createdAt: now(),
        updatedAt: now(),
      }
      updated.push(created)
    }
    writeJSON(STORAGE_KEYS.TASKS, updated)
    await mutate(updated, false)
  }

  const deleteTask = async (id: string) => {
    const updated = all.filter((t) => t.id !== id)
    writeJSON(STORAGE_KEYS.TASKS, updated)
    await mutate(updated, false)
  }

  const moveTask = async (id: string, nextStatus: Task["status"]) => {
    const updated = all.map((t) =>
      t.id === id ? { ...t, status: nextStatus, updatedAt: now() } : t
    )
    writeJSON(STORAGE_KEYS.TASKS, updated)
    await mutate(updated, false)
  }

  return { tasks, upsertTask, deleteTask, moveTask}
}
