import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [GroupsResolver, GroupsService, PrismaService],
})
export class GroupsModule { }
