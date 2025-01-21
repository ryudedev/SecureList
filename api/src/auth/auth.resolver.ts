import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './dto/jwt.output';
import { LoginResponse } from './dto/login-response.dto';
import { User } from './dto/user.output';

@Resolver()
export class AuthResolver {
  private blacklistedTokens = new Set<string>();

  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) { }

  @Mutation(() => String)
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ): Promise<string> {
    const hashedPassword = await this.authService.hashPassword(password);
    // メールアドレスが既に登録されているか確認
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new UnauthorizedException('User already exists');
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return this.authService.generateToken(user.id);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      // email.trim()

      if (!user) {
        console.log('User not found:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.authService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.authService.generateToken(user.id);
      return { token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @Mutation(() => JwtPayload)
  async verifyToken(@Args('token') token: string): Promise<JwtPayload> {
    if (this.blacklistedTokens.has(token)) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
    return this.authService.verifyToken(token);
  }

  @Mutation(() => Boolean)
  async logout(@Args('token') token: string): Promise<boolean> {
    if (this.blacklistedTokens.has(token)) return false;
    this.blacklistedTokens.add(token);
    return true;
  }

  @Query(() => User)
  async me(@Context() ctx: any): Promise<User> {
    const user = ctx.req.user;
    if (!user) throw new UnauthorizedException('Not authorized');
    return this.prisma.user.findUnique({ where: { id: user.userId } });
  }
}
