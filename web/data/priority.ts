export const types = ["priority"] as const

export type PriorityType = (typeof types)[number]

export interface Priority<Type = string> {
  id: string
  name: string
  description: string
  type: Type
}

export const priority: Priority<PriorityType>[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "HIGH",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "priority",
  },
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "MEDIUM",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "priority",
  },
  {
    id: "ac0797b0-7e31-43b6-a494-da7e2ab43445",
    name: "LOW",
    description: "Capable of straightforward tasks, very fast, and lower cost.",
    type: "priority",
  },
  {
    id: "be638fb1-973b-4471-a49c-290325085802",
    name: "CRITICAL",
    description:
      "Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.",
    type: "priority",
  },
  {
    id: "b43c0ea9-5ad4-456a-ae29-26cd77b6d0fb",
    name: "OPTIONAL",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "priority",
  },
]
