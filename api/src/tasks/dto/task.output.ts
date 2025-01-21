import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { LABEL, Priority, STATUS } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { register } from 'module';

registerEnumType(Priority, {
  name: 'Priority',
});

registerEnumType(STATUS, {
  name: 'STATUS',
});

registerEnumType(LABEL, {
  name: 'LABEL',
});

@ObjectType()
export class Task {
  @Field()
  id: number; // タスクID

  @Field()
  title: string; // タスクのタイトル

  @Field({ nullable: true })
  description?: string; // タスクの説明（オプション）

  @Field()
  @IsEnum(STATUS)
  status: STATUS; // タスクの完了状態

  @Field()
  @IsEnum(LABEL)
  label: LABEL;

  @Field(() => Priority)
  @IsEnum(Priority)
  priority: Priority; // 優先度 (HIGH, MEDIUM, LOW, CRITICAL, OPTIONAL)

  @Field({ nullable: true })
  dueDate?: Date; // 締切日（オプション）

  @Field()
  ownerId: string; // タスク作成者のID

  @Field({ nullable: true })
  groupId?: string; // グループID（個人タスクの場合はnull）

  @Field()
  isPrivate: boolean; // プライベートタスクかどうか

  @Field(() => [String])
  tags: string[]; // タスクに関連付けられたタグ

  @Field()
  createdAt: Date; // 作成日時

  @Field()
  updatedAt: Date; // 更新日時

  @Field(() => Date, { nullable: true })
  deletedAt?: Date; // 論理削除日時
}
