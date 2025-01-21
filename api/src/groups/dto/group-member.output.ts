import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GroupRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

registerEnumType(GroupRole, {
  name: 'GroupRole',
});

@ObjectType()
export class GroupMember {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  groupId: string;

  @Field(() => String)
  userId: string;

  @Field(() => GroupRole)
  @IsEnum(GroupRole)
  role: GroupRole;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
