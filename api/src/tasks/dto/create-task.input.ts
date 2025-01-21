import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Priority, STATUS, LABEL } from '@prisma/client';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => STATUS, { defaultValue: STATUS.TODO }) // デフォルト値をTODOに修正
  @IsEnum(STATUS)
  status?: STATUS;

  @Field(() => LABEL, { defaultValue: LABEL.DOCUMENT }) // デフォルト値をDOCUMENTに修正
  @IsEnum(LABEL)
  label?: LABEL;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dueDate?: string; // ISO 8601フォーマットの日付文字列

  @Field({ defaultValue: false })
  @IsBoolean()
  isPrivate: boolean;

  @Field(() => [String], { nullable: 'itemsAndList', defaultValue: [] }) // デフォルト値を空配列に修正
  @IsArray()
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  groupId?: string;
}
