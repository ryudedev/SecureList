"use client"
import { LabelSelector } from "@/components/create/label-selector";
import { PrioritySelector } from "@/components/create/priority-selector";
import { StatusSelector } from "@/components/create/status-selector";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { label, LabelType, types as labelTypes } from "@/data/label";
import { priority, PriorityType, types as priorityTypes } from "@/data/priority";
import { group, GroupType, types as groupType } from "@/data/group";
import { Task, taskSchema } from "@/data/schema";
import { status, StatusType, types as statusTypes } from "@/data/status";
import { cn } from "@/lib/utils";
import { FieldProps, ListProps, ListType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { GroupSelector } from "@/components/create/group-selector";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK } from "@/graphql/mutations/task";
import { GET_GROUPS } from "@/graphql/queries/group";
import { GET_TASKS } from "@/graphql/queries/task";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Create() {
  // mutationを作成
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }]
  });
  const { data, loading, error } = useQuery(GET_GROUPS);
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: null,
      status: "BACKLOG",
      label: "DOCUMENT",
      priority: "MEDIUM",
      dueDate: null,
      groupId: null,
      isPrivate: true,
      tags: [],
    },
  });
  const router = useRouter();

  const initValues = useMemo(() => {
    const getInitialValue = (list: ListProps, key: LabelType | StatusType | PriorityType | GroupType, defaultValue: ListType) => {
      return list.find((item) => item.name === form.getValues(key)) || defaultValue;
    };

    return {
      status: getInitialValue(status, "status", status[0]),
      label: getInitialValue(label, "label", label[0]),
      priority: getInitialValue(priority, "priority", priority[0]),
      group: getInitialValue(group, "groupId", group[0]),
    };
  }, [form]);

  const onFieldChange = (data: FieldProps) => {
    if (data.types === "groupId" && data.value.name === "Private") {
      form.setValue(data.types, null);
      form.setValue("isPrivate", true);
    } else if (data.types === "groupId" && data.value.name !== "Private") {
      form.setValue(data.types, data.value.name);
      form.setValue("isPrivate", false);
    } else {
      form.setValue(data.types, data.value.name);
    }
  };

  const handleSubmit = async () => {
    // formの内容をログに出力
    console.log(form.getValues());
    // mutationを実行
    const res = await createTask({
      variables: {
        data: form.getValues(),
      },
    });
    const data = res.data;
    if (data) router.push("/");
  };

  useEffect(() => {
    console.log(data);
  }, [data])

  if (error) {
    // Groupが取得できなかった場合のエラー処理
    toast({
      variant: "destructive",
      title: "Failed to fetch groups",
      description: "Please try again later.",
    })
  }

  return (
    <div className="w-screen h-screen bg-white flex-1 space-y-4 p-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="h-full flex flex-row space-x-8"
        >
          <div className="flex-[3] flex flex-col space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter task title..."
                      {...field}
                      className="border-none text-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task details..."
                      {...field}
                      value={field.value ?? ""}
                      className="border-none resize-none text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="h-full flex-1 flex flex-col justify-between">
            <div className="flex flex-col space-y-8">
              <FormField
                control={form.control}
                name="status"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <StatusSelector
                        types={statusTypes}
                        status={status}
                        value={initValues.status}
                        onFieldChange={onFieldChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <LabelSelector
                        types={labelTypes}
                        label={label}
                        value={initValues.label}
                        onFieldChange={onFieldChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <PrioritySelector
                        types={priorityTypes}
                        priority={priority}
                        value={initValues.priority}
                        onFieldChange={onFieldChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2 w-full">
                        <Label>DueDate</Label>
                        <div className="flex flex-row justify-between items-center space-x-2">
                          <Popover>
                            <PopoverTrigger asChild className="flex-[3]">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    // フィールドの値を表示
                                    new Date(field.value).toLocaleDateString()
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? date.toISOString().split("T")[0] : "" // ISOフォーマットの日付文字列に変換
                                  )
                                }
                                disabled={(date: Date) =>
                                  date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 10))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {field.value && (
                            <X
                              className="h-4 w-4 cursor-pointer mx-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                form.setValue("dueDate", ""); // 必須なので空文字列を設定
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!loading ? (
                <FormField
                  control={form.control}
                  name="groupId"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <GroupSelector
                          types={groupType}
                          group={data.groups}
                          value={initValues.group}
                          onFieldChange={onFieldChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : <p>loading...</p>}
            </div>
            <Button type="submit">Create Task</Button>
          </div>
        </form >
      </Form >
    </div >
  );
}
