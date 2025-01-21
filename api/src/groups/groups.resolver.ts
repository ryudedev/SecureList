import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupInput } from './dto/create-group.input';
import { Group } from './dto/group.output';
import { UnauthorizedException } from '@nestjs/common';
import { GroupRole } from '@prisma/client';

@Resolver('Group')
export class GroupsResolver {
  constructor(private readonly prisma: PrismaService) { }

  @Query(() => [Group])
  async groups(@Context() ctx: any): Promise<Group[]> {
    const { userId } = ctx.req.user;
    // 認証エラー
    if (userId !== ctx.req.user.userId)
      new UnauthorizedException('Not authorized');

    return await this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId, // 自身のuserIdをメンバーとして持つグループを検索
          },
        },
      },
      include: { members: true }, // メンバー情報も含めて取得
    });
  }

  @Mutation(() => Group)
  async createGroup(
    @Args('data') data: CreateGroupInput,
    @Context() ctx: any,
  ): Promise<Group> {
    const { userId } = ctx.req.user;
    // 認証エラー
    if (userId !== ctx.req.user.userId)
      new UnauthorizedException('Not authorized');

    return await this.prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        members: {
          create: {
            userId: userId, // ユーザーIDを指定
            role: GroupRole.ADMIN,
          },
        },
      },
      include: { members: true },
    });
  }

  @Mutation(() => Group)
  async addUserToGroup(
    @Args('groupId') groupId: string,
    @Args('userId') userId: string,
    @Context() ctx: any,
  ): Promise<Group> {
    // 認証エラー
    if (ctx.req.user.userId !== ctx.req.user.userId)
      throw new UnauthorizedException('Not authorized');

    // グループに該当ユーザーが存在するか確認
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    if (group.members.some((member) => member.userId === userId)) {
      throw new Error('User already in group');
    }

    // GroupMemberを作成して関連付ける
    await this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: GroupRole.MEMBER,
      },
    });

    // 更新後のグループを返す
    return await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
  }

  @Mutation(() => Group)
  async removeUserFromGroup(
    @Args('groupId') groupId: string,
    @Args('userId') userId: string,
    @Context() ctx: any,
  ): Promise<Group> {
    if (userId !== ctx.req.user.userId)
      throw new UnauthorizedException('Not authorized');

    // グループに該当ユーザーが存在するか確認
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // ユーザーがグループに所属しているか確認
    const memberToRemove = group.members.find(
      (member) => member.userId === userId,
    );

    if (!memberToRemove) {
      throw new Error('User not found in group');
    }

    // 最後のメンバーが削除されるのを防ぐ
    if (group.members.length === 1) {
      throw new Error('Cannot remove the last member from a group');
    }

    // メンバーを削除
    await this.prisma.groupMember.delete({
      where: { id: memberToRemove.id },
    });

    // 更新後のグループを返す
    return await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
  }
}
