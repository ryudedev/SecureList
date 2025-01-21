'use client'

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { labels, priorities, statuses } from "@/data/data"
import { GET_TASK_BY_ID } from "@/graphql/queries/task"
import { useQuery } from "@apollo/client"
import { ChevronLeft } from "lucide-react"
import React from "react"

type ParamsProps = { params: Promise<{ id: string }> }

export default function DetailTask({ params }: ParamsProps) {
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams

  const { data, loading, error } = useQuery(GET_TASK_BY_ID, {
    skip: !id || !Number(id),
    variables: { id: Number(id) },
  })

  if (loading) return <div className="w-screen h-screen bg-white flex justify-center items-center"><p>Loading...</p></div>
  if (error) return <div className="w-screen h-screen bg-white flex justify-center items-center"><p>Error: {error.message}</p></div>

  const status = statuses.find((status) => status.value === data?.taskByID?.status)
  const label = labels.find((label) => label.value === data?.taskByID?.label)
  const priority = priorities.find((priority) => priority.value === data?.taskByID?.priority)

  return (
    <div className="w-screen h-screen bg-white flex-1 space-y-4 p-20">
      <div className="h-full flex flex-row space-x-8">
        <ChevronLeft className="h-8 w-8 cursor-pointer" onClick={() => window.history.back()} />
        <div className="flex-[3] flex flex-col space-y-8">
          <h1 className="text-2xl">{data?.taskByID?.title || "No Title"}</h1>
          <p>{data?.taskByID?.description || "No Description"}</p>
        </div>
        <Separator orientation="vertical" />
        <div className="h-full flex-1 flex flex-col justify-between">
          <div className="flex flex-col space-y-8">
            <div className="grid gap-2">
              <Label className="text-gray-400">Status</Label>
              <div className="flex w-[100px] items-center">
                {status && status.icon && (
                  <>
                    <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{status.label}</span>
                  </>
                )}
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-400">Label</Label>
                <div className="flex items-center">
                  {label && label.icon && (
                    <>
                      <label.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{label.label}</span>
                    </>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-400">Priority</Label>
                  <div className="flex items-center">
                    {priority && priority.icon && (
                      <>
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{priority.label}</span>
                      </>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-400">Due Date</Label>
                    <p>
                      {data?.taskByID?.dueDate
                        ? new Date(data.taskByID.dueDate).toLocaleDateString()
                        : "No Due Date"}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-400">Group ID</Label>
                    <p>{data?.taskByID?.groupId || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
