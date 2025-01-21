import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthResolver, AuthService, PrismaService, ConfigService],
  exports: [AuthService],
})
export class AuthModule { }
