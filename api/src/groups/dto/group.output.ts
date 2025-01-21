import { ObjectType, Field } from '@nestjs/graphql';
import { GroupMember } from './group-member.output';

@ObjectType()
export class Group {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [GroupMember], { nullable: true })
  members?: GroupMember[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
