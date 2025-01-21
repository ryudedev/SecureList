import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput } from './dto/create-task.input';
import { Task } from './dto/task.output';
import { UpdateTaskInput } from './dto/update-task.input';
import { GroupTasks, MyTaskOutput } from './dto/my-task.output';
import { LABEL, STATUS, Priority } from '@prisma/client';

@Resolver('Task')
export class TasksResolver {
  constructor(private readonly prisma: PrismaService) { }

  @Mutation(() => Task)
  async createTask(
    @Args('data') data: CreateTaskInput,
    @Context() ctx: any,
  ): Promise<Task> {
    const { userId }: { userId: string } = ctx.req.user;

    if (!data.isPrivate && !data.groupId) {
      throw new Error('groupId is required when task is not private');
    }

    if (data.isPrivate && data.groupId) {
      throw new Error('groupId must not be provided when task is private');
    }

    if (data.groupId) {
      const membership = await this.prisma.groupMember.findFirst({
        where: {
          userId: userId,
          groupId: data.groupId,
        },
      });

      if (!membership) {
        throw new Error('You are not a member of the specified group');
      }
    }

    const taskData = {
      title: data.title,
      description: data.description || null,
      status: data.status ?? STATUS.BACKLOG,
      priority: data.priority ?? Priority.MEDIUM,
      label: data.label ?? LABEL.DOCUMENT,
      owner: {
        connect: {
          id: userId,
        },
      },
      isPrivate: data.isPrivate,
      ...(data.groupId && !data.isPrivate
        ? {
          group: {
            connect: {
              id: data.groupId,
            },
          },
        }
        : {}),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      tags: data.tags ?? [],
    };

    return this.prisma.task.create({
      data: taskData,
    });
  }

  // タスクを更新する
  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: number,
    @Args('data') data: UpdateTaskInput,
    @Context() ctx: any,
  ): Promise<Task> {
    const { userId } = ctx.req.user;

    // タスクの存在確認
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // 権限チェック
    if (task.ownerId !== userId) {
      throw new Error('Not authorized to update this task');
    }

    // バリデーションチェック
    if (data.isPrivate !== undefined && data.groupId !== undefined) {
      if (!data.isPrivate && !data.groupId) {
        throw new Error('groupId is required when task is not private');
      }

      if (data.isPrivate && data.groupId) {
        throw new Error('groupId must not be provided when task is private');
      }
    }

    // プライベートタスクからグループタスクへの変更、またはその逆の場合のチェック
    if (data.isPrivate !== undefined && task.isPrivate !== data.isPrivate) {
      if (!data.isPrivate && !data.groupId) {
        throw new Error('groupId is required when converting to a group task');
      }

      if (!data.isPrivate) {
        const membership = await this.prisma.groupMember.findFirst({
          where: {
            userId,
            groupId: data.groupId,
          },
        });

        if (!membership) {
          throw new Error('You are not a member of the specified group');
        }
      }
    } else if (
      !task.isPrivate &&
      data.groupId !== undefined &&
      data.groupId !== task.groupId
    ) {
      // グループタスクの別グループへの移動時
      const membership = await this.prisma.groupMember.findFirst({
        where: {
          userId,
          groupId: data.groupId,
        },
      });

      if (!membership) {
        throw new Error('You are not a member of the specified group');
      }
    }

    // 更新データの準備
    const updateData = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.label !== undefined && { label: data.label }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
      ...(data.isPrivate
        ? { groupId: null }
        : data.groupId !== undefined && { groupId: data.groupId }),
    };

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  // タスクを削除する
  @Mutation(() => Task)
  async deleteTask(@Args('id') id: number, @Context() ctx: any): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (task.ownerId !== ctx.req.user.userId) throw new Error('Not authorized');
    if (!task) throw new Error('Task not found');
    if (task.deletedAt) throw new Error('Task already deleted');

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() }, // 論理削除
    });
  }

  // タスクを取得する
  @Query(() => [Task])
  async tasks(@Context() ctx: any): Promise<Task[]> {
    console.log('ctx.req.user:', ctx.req.user);
    if (!ctx.req.user) throw new Error('Not authorized');
    const { userId } = ctx.req.user; // JWTトークンからユーザーIDを取得
    return this.prisma.task.findMany({
      where: { ownerId: userId, deletedAt: null },
    });
  }

  // グループタスクを取得する
  @Query(() => [Task])
  async groupTasks(
    @Args('groupId') groupId: string,
    @Context() ctx: any,
  ): Promise<Task[]> {
    if (!ctx.req.user) throw new Error('Not authorized');
    return this.prisma.task.findMany({
      where: { groupId, deletedAt: null },
    });
  }

  // タスクを復元する
  @Mutation(() => Task)
  async restoreTask(
    @Args('id') id: number,
    @Context() ctx: any,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (ctx.req.user.userId !== task.ownerId) throw new Error('Not authorized');
    if (!task) throw new Error('Task not found');
    if (!task.deletedAt) throw new Error('Task is not deleted');

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: null }, // 論理削除を解除
    });
  }

  // 削除されたタスクを取得する
  @Query(() => [Task])
  async deletedTasks(@Context() ctx: any): Promise<Task[]> {
    if (!ctx.req.user) throw new Error('Not authorized');
    const { userId } = ctx.req.user; // JWTトークンからユーザーIDを取得
    return await this.prisma.task.findMany({
      where: { ownerId: userId, deletedAt: { not: null } },
    });
  }

  // 削除済みのタスクを永続的に削除する
  @Mutation(() => Task)
  async purgeTask(@Args('id') id: number, @Context() ctx: any): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new Error('Task not found');
    if (task.ownerId !== ctx.req.user.userId) throw new Error('Not authorized');
    if (!task.deletedAt) throw new Error('Task is not deleted');

    return this.prisma.task.delete({ where: { id } });
  }

  // 自身のタスク一覧
  @Query(() => MyTaskOutput)
  async myTasks(@Context() ctx: any): Promise<MyTaskOutput> {
    if (!ctx.req.user) throw new Error('Not authorized');
    const { userId } = ctx.req.user; // JWTトークンからユーザーIDを取得
    // privateなタスクとグループタスクを分割して返す
    const tasks = await this.prisma.task.findMany({
      where: { ownerId: userId, deletedAt: null },
    });
    // プライベートタスクを抽出
    const privateTasks: Task[] = tasks.filter((task) => task.isPrivate);

    // グループタスクを抽出し、groupIdごとにグループ化
    const groupedTasks = tasks
      .filter((task) => !task.isPrivate && task.groupId)
      .reduce(
        (acc, task) => {
          const groupId = task.groupId as string;
          if (!acc[groupId]) {
            acc[groupId] = [];
          }
          acc[groupId].push(task);
          return acc;
        },
        {} as Record<string, Task[]>,
      );

    // グループタスクの形をGroupTasks[]に変換
    const groupTasksArray: GroupTasks[] = Object.entries(groupedTasks).map(
      ([groupId, tasks]) => ({
        groupId,
        tasks,
      }),
    );
    console.log(
      JSON.stringify(
        {
          private: privateTasks,
          group: groupTasksArray,
        },
        null,
        2,
      ),
    );

    const res: MyTaskOutput = {
      private: privateTasks,
      group: groupTasksArray,
    };
    return res;
  }

  // IDでタスクを取得する
  @Query(() => Task)
  async taskByID(@Args('id') id: number, @Context() ctx: any): Promise<Task> {
    if (!ctx.req.user) throw new Error('Not authorized');
    const { userId } = ctx.req.user; // JWTトークンからユーザーIDを取得
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new Error('Task not found');
    if (task.ownerId !== userId) throw new Error('Not authorized');
    return task;
  }
}
