import { z } from "zod"

export const authSchema = z.object({
  email: z.string().min(1, {
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(1, {
    message: "パスワードを入力してください",
  }),
})

export const taskSchema = z.object({
  // 必須
  title: z.string().min(1, { message: "Please enter a title." }),
  // nullを許容
  description: z.string().nullable(),
  // デフォルト値を設定
  status: z.string().default("backlog"),
  // デフォルト値を設定
  label: z.string().default("document"),
  // デフォルト値を設定
  priority: z.string().default("medium"),
  // nullを許容, undefinedを許容
  dueDate: z.string().nullable(),
  // nullを許容
  groupId: z.string().nullable(),
  // デフォルト値を設定
  isPrivate: z.boolean().default(false),
  // デフォルト値を設定
  tags: z.array(z.string()).default([]),
})

export type Auth = z.infer<typeof authSchema>
export type Task = z.infer<typeof taskSchema>
