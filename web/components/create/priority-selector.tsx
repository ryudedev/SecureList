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

import { Priority as DataPriority, PriorityType } from "@/data/priority"
import { FieldProps } from "@/types"

interface LabelSelectorProps extends PopoverProps {
  types: readonly PriorityType[]
  priority: DataPriority[]
  value: DataPriority<string> | (() => DataPriority<string>)
  onFieldChange: (_data: FieldProps) => void
}

export function PrioritySelector({ priority, types, value, onFieldChange, ...props }: LabelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<DataPriority>(value)
  const [_peekedStatus, setPeekedStatus] = React.useState<DataPriority>(value)

  return (
    <div className="grid gap-2">
      <Label htmlFor="model">Status</Label>
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
              <CommandInput placeholder="Search Statuss..." />
              <CommandEmpty>No Statuss found.</CommandEmpty>
              {types.map((type) => (
                <CommandGroup key={type} heading={type}>
                  {priority
                    .filter((p) => p.type === type)
                    .map((p) => (
                      <LabelItem
                        key={p.id}
                        model={p}
                        isSelected={selectedStatus?.id === p.id}
                        onPeek={(p) => setPeekedStatus(p)}
                        onSelect={() => {
                          setSelectedStatus(p)
                          setOpen(false)
                          onFieldChange({ types: "priority", value: p })
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
  model: DataPriority
  isSelected: boolean
  onSelect: () => void
  onPeek: (_model: DataPriority) => void
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
