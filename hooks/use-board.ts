"use client"

import useSWR from "swr"
import type { Board, Task } from "@/lib/types"
import axios from "axios"

const axiosFetcher = async <T,>(url: string): Promise<T> => {
  try {
    const res = await axios.get(url)
    return res.data as T
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Request failed"
    throw new Error(errorMessage)
  }
}

export function useBoards() {
  const { data, mutate } = useSWR<Board[]>("/api/boards", axiosFetcher, {
    fallbackData: [],
  })

  const createBoard = async (name: string) => {
    try {
      const res = await axios.post("/api/boards", { name })
      await mutate() // revalidate list
      return res.data as Board
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unable to create board"
      throw new Error(errorMessage)
    }
  }

  const renameBoard = async (id: string, name: string) => {
    try {
      await axios.patch(`/api/boards/${id}`, { name })
      await mutate()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unable to rename board"
      throw new Error(errorMessage)
    }
  }

  const deleteBoard = async (id: string) => {
    try {
      await axios.delete(`/api/boards/${id}`)
      await mutate()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unable to delete board"
      throw new Error(errorMessage)
    }
  }

  return { boards: data ?? [], createBoard, renameBoard, deleteBoard }
}

export function useTasks(boardId: string) {
  const key = boardId ? `/api/boards/${boardId}/tasks` : null
  const { data, mutate } = useSWR<Task[]>(key, axiosFetcher, { fallbackData: [] })

  const tasks = data ?? []

  const upsertTask = async (input: Omit<Task, "createdAt" | "updatedAt"> & { id?: string }) => {
    try {
      if (input.id) {
        await axios.patch(`/api/tasks/${input.id}`, input)
      } else {
        await axios.post(`/api/boards/${input.boardId}/tasks`, input)
      }
      await mutate()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || `Unable to ${input.id ? 'update' : 'create'} task`
      throw new Error(errorMessage)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      await mutate()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unable to delete task"
      throw new Error(errorMessage)
    }
  }

  const moveTask = async (id: string, nextStatus: Task["status"]) => {
    try {
      await axios.patch(`/api/tasks/${id}`, { status: nextStatus })
      await mutate()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unable to move task"
      throw new Error(errorMessage)
    }
  }

  return { tasks, upsertTask, deleteTask, moveTask }
}
