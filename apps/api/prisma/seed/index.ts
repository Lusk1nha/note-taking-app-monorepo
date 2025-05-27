import { PrismaClient } from '@prisma/client';
import { users } from './data';

let prisma;

async function main() {
  prisma = new PrismaClient();

  for (let user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
