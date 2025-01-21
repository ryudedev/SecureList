export const types = ["label"] as const

export type LabelType = (typeof types)[number]

export interface Label<Type = string> {
  id: string
  name: string
  description: string
  type: Type
}

export const label: Label<LabelType>[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "DOCUMENT",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "label",
  },
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "BUG",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "label",
  },
  {
    id: "ac0797b0-7e31-43b6-a494-da7e2ab43445",
    name: "FEATURE",
    description: "Capable of straightforward tasks, very fast, and lower cost.",
    type: "label",
  },
  {
    id: "be638fb1-973b-4471-a49c-290325085802",
    name: "ENHANCEMENT",
    description:
      "Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.",
    type: "label",
  },
  {
    id: "b43c0ea9-5ad4-456a-ae29-26cd77b6d0fb",
    name: "REFACTOR",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "label",
  },
  {
    id: "52BCDDED-BCA5-4AB5-9253-8ACCC268BF04",
    name: "RESEARCh",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "label",
  },
  {
    id: "BBE1EC74-32C0-415C-8F8D-7B3163C29028",
    name: "TESTING",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "label",
  },
]
