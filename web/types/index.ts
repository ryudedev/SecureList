import { Group, GroupType } from "@/data/group"
import { Label, LabelType } from "@/data/label"
import { Priority, PriorityType } from "@/data/priority"
import { Status, StatusType } from "@/data/status"

// enum LabelEnum {
//   BACKLOG = "backlog",
//   TODO = "todo",
//   IN_PROGRESS = "in progress",
//   DONE = "done",
//   CANCELED = "canceled",
// }

export type LabelProps = {
  types: LabelType
  value: Label<string>
}

// enum StatusEnum {
//   DOCUMENT = "document",
//   BUG = "bug",
//   FEATURE = "feature",
//   ENHANCEMENT = "enhancement",
//   REFACTOR = "refactor",
//   RESEARCH = "research",
//   TESTING = "testing",
// }

export type StatusProps = {
  types: StatusType
  value: Status<string>
}

// enum PriorityEnum {
//   HIGH = "high",
//   MEDIUM = "medium",
//   LOW = "low",
//   CRITICAL = "critical",
//   OPTIONAL = "optional",
// }

export type PriorityProps = {
  types: PriorityType
  value: Priority<string>
}

export type GroupProps = {
  types: GroupType
  value: Group<string>
}


export type FieldProps = LabelProps | StatusProps | PriorityProps | GroupProps

export type ListProps = Label<LabelType>[] | Status<StatusType>[] | Priority<PriorityType>[] | Group<GroupType>[]
export type ListType = Label<LabelType> | Status<StatusType> | Priority<PriorityType> | Group<GroupType>

export type Task = {
  id: string
  title: string
  description?: string
  status: string
  label: string
  priority: string
  dueDate?: Date
  ownerId: string
  groupId?: string
  isPrivate: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type GetTasksQueryResult = {
  tasks: Task[]
}
