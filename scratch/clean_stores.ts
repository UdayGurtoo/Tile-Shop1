import { prisma } from "../src/lib/prisma";

async function main() {
  const stores = await prisma.store.findMany({ orderBy: { createdAt: "desc" } });
  console.log("All stores in DB:", stores.map(s => ({ id: s.id, name: s.name, createdAt: s.createdAt })));

  if (stores.length > 1) {
    const activeStore = stores[0]; // Newest one
    console.log("Keeping primary active store:", activeStore.id);
    for (let i = 1; i < stores.length; i++) {
      const old = stores[i];
      const prodCount = await prisma.product.count({ where: { storeId: old.id } });
      if (prodCount === 0) {
        console.log(`Deleting empty old store: ${old.id}`);
        await prisma.store.delete({ where: { id: old.id } }).catch(e => console.log("Could not delete old store:", e.message));
      } else {
        console.log(`Old store ${old.id} has ${prodCount} products. Migrating to ${activeStore.id}...`);
        await prisma.product.updateMany({ where: { storeId: old.id }, data: { storeId: activeStore.id } });
        await prisma.category.updateMany({ where: { storeId: old.id }, data: { storeId: activeStore.id } });
        await prisma.brand.updateMany({ where: { storeId: old.id }, data: { storeId: activeStore.id } });
        await prisma.store.delete({ where: { id: old.id } }).catch(() => {});
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
