import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from '../../tasks/dto/task.output'; // Task DTO のパスを調整してください
import { Group } from '../../groups/dto/group.output'; // Group DTO のパスを調整してください
import { IsEmail, IsArray } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  // @Field(() => [String])
  // @IsArray()
  // roles: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @Field(() => [Group], { nullable: true })
  groups?: Group[];
}
