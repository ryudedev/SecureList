import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Priority, STATUS, LABEL } from '@prisma/client';
import { CreateTaskInput } from './create-task.input';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => STATUS, { nullable: true })
  @IsEnum(STATUS)
  @IsOptional()
  status?: STATUS;

  @Field(() => LABEL, { nullable: true })
  @IsEnum(LABEL)
  @IsOptional()
  label?: LABEL;

  @Field(() => Priority, { nullable: true })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dueDate?: string; // ISO 8601フォーマットの日付文字列

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  groupId?: string;
}
