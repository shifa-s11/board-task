

export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  boardId: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: number
  updatedAt: number
}

export interface Board {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

let boards = new Map<string, Board>()
let tasks = new Map<string, Task>()

function now() {
  return Date.now()
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function seedMockData() {
  if (boards.size > 0) return

  const b1: Board = { id: uid("board"), name: "Product Roadmap", createdAt: now(), updatedAt: now() }
  const b2: Board = { id: uid("board"), name: "Marketing Plan", createdAt: now(), updatedAt: now() }
  boards.set(b1.id, b1)
  boards.set(b2.id, b2)

  const exampleTasks: Omit<Task, "id" | "createdAt" | "updatedAt">[] = [
    { boardId: b1.id, title: "Spec v1", description: "Draft initial spec", status: "todo" },
    { boardId: b1.id, title: "API contract", description: "Define REST endpoints", status: "in-progress" },
    { boardId: b1.id, title: "MVP demo", description: "Clickable demo for stakeholders", status: "done" },
    { boardId: b2.id, title: "Landing copy", description: "H1/H2 and hero CTA", status: "todo" },
  ]

  for (const t of exampleTasks) {
    const id = uid("task")
    tasks.set(id, { id, createdAt: now(), updatedAt: now(), ...t })
  }
}

export function resetMockData() {
  boards = new Map()
  tasks = new Map()
  seedMockData()
}

export const db = {
  // Boards
  listBoards(): Board[] {
    return Array.from(boards.values()).sort((a, b) => b.createdAt - a.createdAt)
  },
  getBoard(id: string): Board | undefined {
    return boards.get(id)
  },
  createBoard(name: string): Board {
    const b: Board = { id: uid("board"), name, createdAt: now(), updatedAt: now() }
    boards.set(b.id, b)
    return b
  },
  updateBoard(id: string, patch: Partial<Pick<Board, "name">>): Board | undefined {
    const b = boards.get(id)
    if (!b) return undefined
    const updated: Board = { ...b, ...patch, updatedAt: now() }
    boards.set(id, updated)
    return updated
  },
  deleteBoard(id: string): boolean {
    // delete board and its tasks
    const ok = boards.delete(id)
    if (ok) {
      for (const t of Array.from(tasks.values())) {
        if (t.boardId === id) tasks.delete(t.id)
      }
    }
    return ok
  },

  // Tasks
  listTasks(boardId: string): Task[] {
    return Array.from(tasks.values())
      .filter((t) => t.boardId === boardId)
      .sort((a, b) => a.createdAt - b.createdAt)
  },
  getTask(id: string): Task | undefined {
    return tasks.get(id)
  },
  createTask(input: { boardId: string; title: string; description?: string; status?: TaskStatus }): Task {
    const t: Task = {
      id: uid("task"),
      boardId: input.boardId,
      title: input.title,
      description: input.description,
      status: input.status ?? "todo",
      createdAt: now(),
      updatedAt: now(),
    }
    tasks.set(t.id, t)
    return t
  },
  updateTask(id: string, patch: Partial<Pick<Task, "title" | "description" | "status">>): Task | undefined {
    const t = tasks.get(id)
    if (!t) return undefined
    const updated: Task = { ...t, ...patch, updatedAt: now() }
    tasks.set(id, updated)
    return updated
  },
  deleteTask(id: string): boolean {
    return tasks.delete(id)
  },
}
seedMockData()
