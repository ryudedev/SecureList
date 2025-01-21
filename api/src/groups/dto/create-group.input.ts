import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGroupInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
