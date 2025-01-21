export const types = ["groupId"] as const

export type GroupType = (typeof types)[number]

export interface Group<Type = string> {
  id: string
  name: string
  description: string
  type: Type
}

export const group: Group<GroupType>[] = [
  {
    id: "197CCA32-43B6-4DFC-AB9B-EE3651822B30",
    name: "Private",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "groupId",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "IE4A",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "groupId",
  },
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "SK3A",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "groupId",
  },
  {
    id: "ac0797b0-7e31-43b6-a494-da7e2ab43445",
    name: "IE4B",
    description: "Capable of straightforward tasks, very fast, and lower cost.",
    type: "groupId",
  },
]
