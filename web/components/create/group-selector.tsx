"use client"

import * as React from "react"
import { PopoverProps } from "@radix-ui/react-popover"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Group as DataGroup, GroupType } from "@/data/group"
import { FieldProps } from "@/types"

interface GroupSelectorProps extends PopoverProps {
  types: readonly GroupType[]
  group: DataGroup[]
  value: DataGroup<string> | (() => DataGroup<string>)
  onFieldChange: (_data: FieldProps) => void
}

export function GroupSelector({ group, types, value, onFieldChange, ...props }: GroupSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const privateObj = {
    id: "197CCA32-43B6-4DFC-AB9B-EE3651822B30",
    name: "Private",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "groupId",
  }
  const [selectedStatus, setSelectedStatus] = React.useState<DataGroup>(value)
  const [_peekedStatus, setPeekedStatus] = React.useState<DataGroup>(value)

  return (
    <div className="grid gap-2">
      <Label htmlFor="model">Group</Label>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a model"
            className="w-full justify-between"
          >
            {selectedStatus ? selectedStatus.name : "Select a model..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <Command loop>
            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
              <CommandInput placeholder="Search Group..." />
              <CommandEmpty>No Group found.</CommandEmpty>
              {types.map((type) => (
                <CommandGroup key={type} heading={type}>
                  <LabelItem
                    model={privateObj}
                    isSelected={selectedStatus?.id === privateObj.id}
                    onPeek={(g) => setPeekedStatus(g)}
                    onSelect={() => {
                      setSelectedStatus(privateObj)
                      setOpen(false)
                      onFieldChange({ types: "groupId", value: privateObj })
                    }}
                  />
                  {group
                    .filter((g) => g.type === type)
                    .map((g) => (
                      <LabelItem
                        key={g.id}
                        model={g}
                        isSelected={selectedStatus?.id === g.id}
                        onPeek={(g) => setPeekedStatus(g)}
                        onSelect={() => {
                          setSelectedStatus(g)
                          setOpen(false)
                          onFieldChange({ types: "groupId", value: g })
                        }}
                      />
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div >
  )
}

interface LabelItemProps {
  model: DataGroup
  isSelected: boolean
  onSelect: () => void
  onPeek: (_model: DataGroup) => void
}

function LabelItem({ model, isSelected, onSelect, onPeek }: LabelItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onPeek(model)
      }
    })
  })

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      ref={ref}
      className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
    >
      {model.name}
      <Check
        className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}
      />
    </CommandItem>
  )
}
