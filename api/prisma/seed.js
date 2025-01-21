import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await hashPassword('komotor0124');
    // 1つ目のOrganizationを作成
    const user1 = await prisma.user.create({
      data: {
        email: 'kr20030124@gmail.com',
        password: hashedPassword,
      },
    });
    console.log('Created user:', user1);
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
