import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpCircle,
  Bug,
  CheckCircle,
  Circle,
  CircleOff,
  FileText,
  HelpCircle,
  icons,
  PlusCircle,
  Repeat,
  Search,
  Star,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "DOCUMENT",
    label: "DOCUMENT",
    icons: FileText,
  },
  {
    value: "BUG",
    label: "BUG",
    icon: Bug
  },
  {
    value: "FEATURE",
    label: "FEATURE",
    icon: Star
  },
  {
    value: "ENHANCEMENT",
    label: "ENHANCEMENT",
    icon: ArrowUpCircle
  },
  {
    value: "REFACTOR",
    label: "REFACTOR",
    icon: Repeat
  },
  {
    value: "RESERCH",
    label: "RESERCH",
    icon: Search
  },
  {
    value: "TESTING",
    label: "TESTING",
    icon: CheckCircle
  },
]

export const statuses = [
  {
    value: "BACKLOG",
    label: "BACKLOG",
    icon: HelpCircle,
  },
  {
    value: "TODO",
    label: "TODO",
    icon: Circle,
  },
  {
    value: "IN_PROGRESS",
    label: "IN_PROGRESS",
    icon: Timer,
  },
  {
    value: "DONE",
    label: "DONE",
    icon: CheckCircle,
  },
  {
    value: "CANCELED",
    label: "CANCELED",
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: "LOW",
    value: "LOW",
    icon: ArrowDown, // 下向き矢印はLOWの優先度に適しています
  },
  {
    label: "MEDIUM",
    value: "MEDIUM",
    icon: ArrowRight, // 右向き矢印はMEDIUMの優先度に適しています
  },
  {
    label: "HIGH",
    value: "HIGH",
    icon: ArrowUp, // 上向き矢印はHIGHの優先度に適しています
  },
  {
    label: "CRITICAL",
    value: "CRITICAL",
    icon: AlertCircle, // 警告アイコンはCRITICALの優先度に適しています
  },
  {
    label: "OPTIONAL",
    value: "OPTIONAL",
    icon: PlusCircle, // プラスアイコンはOPTIONALの優先度に適しています
  }
];
