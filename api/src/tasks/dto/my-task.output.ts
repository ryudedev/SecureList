import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from './task.output';

@ObjectType()
export class GroupTasks {
  @Field()
  groupId: string;

  @Field(() => [Task])
  tasks: Task[];
}

@ObjectType()
export class MyTaskOutput {
  @Field(() => [Task])
  private: Task[];

  @Field(() => [GroupTasks])
  group: GroupTasks[];
}
