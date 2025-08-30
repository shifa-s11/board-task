export const STORAGE_KEYS = {
  AUTH: "auth.isAuthenticated",
  PROFILE: "profile",
  BOARDS: "boards",
  TASKS: "tasks",
} as const

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}
