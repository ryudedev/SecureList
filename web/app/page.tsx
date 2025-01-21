"use client";
import { useAuth } from "@/components/provider/authProvider";
import { LoginForm } from "@/components/auth/loginForm";
import { useEffect, useState } from "react";
import { UserNav } from "@/components/nav/userNav";
import { DataTable } from "@/components/table/data-table";
import Image from "next/image";
import { GET_TASKS } from "@/graphql/queries/task";
import { useQuery } from "@apollo/client";
import { columns } from "@/components/table/columns";
import { Task } from "@/types";

export default function Home() {
  const { token } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: tasksData } = useQuery(GET_TASKS, {
    skip: !token,
    onCompleted: (data) => {
      data.tasks = data.tasks.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    },
  });

  useEffect(() => {
    // 初期化状態の処理
    if (token !== undefined) {
      setIsInitializing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // トークンが存在する場合のアニメーション
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShowMainContent(true);
      }, 300); // フェードアウトが完了する前にメインコンテンツを準備

      return () => clearTimeout(timer);
    } else {
      // トークンが存在しない場合のアニメーション
      setIsAnimating(false);
      setShowMainContent(false);

    }
  }, [token]);

  if (isInitializing) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* LoginForm */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${!token
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
          }`}
      >
        <LoginForm />
      </div>

      {/* Todo画面 */}
      {(showMainContent || token) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-white transition-all duration-700 ease-out ${token && isAnimating
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
            }`}
        >
          <div className="md:hidden">
            <Image
              src="/examples/tasks-light.png"
              width={1280}
              height={998}
              alt="Playground"
              className="block dark:hidden"
            />
            <Image
              src="/examples/tasks-dark.png"
              width={1280}
              height={998}
              alt="Playground"
              className="hidden dark:block"
            />
          </div>
          <div className="hidden w-full h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Task Management
                </h2>
                <p className="text-muted-foreground">
                  Here&apos;s a list of your tasks for this month!
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <UserNav />
              </div>
            </div>
            {tasksData && <DataTable data={tasksData.tasks} columns={columns} />}
          </div>
        </div>
      )}
    </div>
  );
}
