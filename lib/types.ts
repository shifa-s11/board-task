import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
export type LoginInput = z.infer<typeof LoginSchema>

export const OtpSchema = z.object({
  code: z
    .string()
    .min(6, "Enter 6 digits")
    .max(6, "Enter 6 digits")
    .regex(/^\d{6}$/, "Must be 6 digits"),
})
export type OtpInput = z.infer<typeof OtpSchema>

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  contact: z.string().optional(),
  country: z.string().min(1, "Select a country"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
export type ProfileInput = z.infer<typeof ProfileSchema>

export const BoardSchema = z.object({
  name: z.string().min(2, "Board name must be at least 2 characters"),
})
export type BoardInput = z.infer<typeof BoardSchema>

export const TaskStatusEnum = z.enum(["Pending", "Critical", "Urgent", "Complete"])
export const TaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: TaskStatusEnum,
  assignee: z.string().optional(),
  dueDate: z.string().optional(), // ISO date string
})
export type TaskInput = z.infer<typeof TaskSchema>

export type Board = {
  id: string
  name: string
  createdAt: string
}

export type Task = {
  id: string
  boardId: string
  title: string
  description?: string
  status: z.infer<typeof TaskStatusEnum>
  assignee?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
   isDeleted?: boolean
}