import { Field, ObjectType, Int } from '@nestjs/graphql';

// 共通のクラスを定義
@ObjectType() // GraphQL型定義用
export class DefaultJwtPayload {
  @Field(() => Int) // GraphQL用デコレータ
  exp: number;

  @Field(() => Int)
  iat: number;
}

@ObjectType()
export class JwtPayload extends DefaultJwtPayload {
  @Field(() => String)
  userId: string;
}
