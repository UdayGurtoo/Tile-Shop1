import { prisma } from "../src/lib/prisma";

async function main() {
  const stores = await prisma.store.findMany();
  console.log("Stores:", stores);

  const users = await prisma.user.findMany({ select: { email: true, role: true, storeId: true } });
  console.log("Users:", users);

  const products = await prisma.product.groupBy({ by: ["storeId"], _count: true });
  console.log("Products:", products);

  const categories = await prisma.category.groupBy({ by: ["storeId"], _count: true });
  console.log("Categories:", categories);
}

main().catch(console.error).finally(() => prisma.$disconnect());
