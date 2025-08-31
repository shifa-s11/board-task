"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type TaskInput, TaskSchema, TaskStatusEnum, type Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export function TaskDialog({
  initial,
  onSubmit,
  onClose,
  isSaving,
}: {
  initial?: Partial<Task>
  onSubmit: (values: TaskInput) => Promise<void>
  onClose: () => void
  isSaving: boolean
}) {
  const form = useForm<TaskInput>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      status: initial?.status ?? "Pending",
      assignee: initial?.assignee ?? "",
      dueDate: initial?.dueDate ?? "",
    },
    mode: "onChange",
  })

  const submit = async (v: TaskInput) => {
    await onSubmit(v)
  }

  return (
    <DialogContent className="sm:max-w-xl dark:bg-zinc-900">
      <DialogHeader>
        <DialogTitle className="text-zinc-900 dark:text-zinc-100">{initial ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogDescription className="text-zinc-600 dark:text-zinc-400">Fill in the task details and save.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Task title"
                    className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Optional description"
                    className="min-h-[100px] rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSaving}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
                      {TaskStatusEnum.options.map((s) => (
                        <SelectItem key={s} value={s} className="text-zinc-900 dark:text-zinc-100">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <FormMessage className="text-xs text-red-500" />
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assignee</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Who is responsible?"
                      className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                      disabled={isSaving}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initial ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

