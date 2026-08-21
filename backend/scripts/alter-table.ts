import { prisma } from '../../database/prisma';

async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE "RagDocument" ALTER COLUMN embedding TYPE vector(3072);');
  console.log('Altered column to 3072 dims');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
