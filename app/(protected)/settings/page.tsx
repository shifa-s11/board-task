"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Upload, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage"

type Prefs = {
  compactMode: boolean
  notifications: boolean
}

const PREFS_KEY = "kanban:prefs"

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>({ compactMode: false, notifications: true })
  const fileRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    try {
      const saved = readJSON<Prefs | null>(PREFS_KEY, null)
      if (saved) {
        setPrefs(saved)
      }
    } catch (e) {
      toast.error("Failed to load preferences.", {
        description: "An error occurred while loading settings from local storage.",
      })
    }
  }, [])

  useEffect(() => {
    try {
      writeJSON(PREFS_KEY, prefs)
    } catch (e) {
      toast.error("Failed to save preferences.", {
        description: "An error occurred while saving settings to local storage.",
      })
    }
  }, [prefs])

  const exportPayload = useMemo(() => {
    return {
      meta: {
        name: " FlowLabel Export",
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      data: {
        auth: readJSON(STORAGE_KEYS.AUTH, false),
        profile: readJSON(STORAGE_KEYS.PROFILE, null),
        boards: readJSON(STORAGE_KEYS.BOARDS, []),
        tasks: readJSON(STORAGE_KEYS.TASKS, []),
        prefs: readJSON(PREFS_KEY, { compactMode: false, notifications: true }),
      },
    }
  }, [])

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `FlowLabel-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Exported!", { description: "Your data was exported as JSON." })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred."
      toast.error("Export failed.", { description: errorMessage })
    }
  }

  const handleImportFile = async (file: File) => {
    setIsImporting(true)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const payload = parsed?.data ?? parsed

      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid import format.")
      }

      if ("auth" in payload) writeJSON(STORAGE_KEYS.AUTH, !!payload.auth)
      if ("profile" in payload) writeJSON(STORAGE_KEYS.PROFILE, payload.profile ?? null)
      if ("boards" in payload) writeJSON(STORAGE_KEYS.BOARDS, payload.boards ?? [])
      if ("tasks" in payload) writeJSON(STORAGE_KEYS.TASKS, payload.tasks ?? [])
      if ("prefs" in payload) writeJSON(PREFS_KEY, payload.prefs ?? { compactMode: false, notifications: true })

      toast.success("Imported!", { description: "Data imported successfully." })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred."
      toast.error("Import failed.", { description: errorMessage })
    } finally {
      setIsImporting(false)
    }
  }

  const handleImportClick = () => {
    fileRef.current?.click()
  }

  const handleClearAll = () => {
    setIsClearing(true)
    try {
      writeJSON(STORAGE_KEYS.AUTH, false)
      writeJSON(STORAGE_KEYS.PROFILE, null)
      writeJSON(STORAGE_KEYS.BOARDS, [])
      writeJSON(STORAGE_KEYS.TASKS, [])
      writeJSON(PREFS_KEY, { compactMode: false, notifications: true })
      toast.success("Cleared!", { description: "All local app data has been cleared." })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred."
      toast.error("Clear failed.", { description: errorMessage })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Manage your local data and preferences.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Data tools */}
        <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Data</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Export, import, or clear your local app data.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleExport} className="w-full sm:w-auto bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="application/json"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleImportFile(f)
                e.currentTarget.value = ""
              }}
            />
            <Button variant="secondary" onClick={handleImportClick} className="w-full sm:w-auto dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700" disabled={isImporting}>
              {isImporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Import JSON
            </Button>
            <Button variant="destructive" onClick={handleClearAll} className="w-full sm:w-auto" disabled={isClearing}>
              {isClearing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Data
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-xl border-none shadow-md dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100">Preferences</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Toggle UI options. Saved locally on this device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Compact mode</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Tighter spacing for dense task lists.</p>
              </div>
              <Switch
                id="compact-mode"
                checked={prefs.compactMode}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, compactMode: v }))}
                aria-label="Toggle compact mode"
                className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Notifications</Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Allow basic toast notifications.</p>
              </div>
              <Switch
                id="notifications"
                checked={prefs.notifications}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, notifications: v }))}
                aria-label="Toggle notifications"
                className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
