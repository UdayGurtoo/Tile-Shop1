import { prisma } from "@/lib/prisma";

const DEFAULT_STORE_SLUG = "mohit-tiles-ghaziabad";

export async function getDefaultStore() {
  const store =
    (await prisma.store.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } })) ??
    (await prisma.store.findUnique({ where: { slug: DEFAULT_STORE_SLUG } }));

  if (!store) throw new Error("No store found. Run: npm run db:seed");
  return store;
}

export async function getStoreId() {
  const store = await getDefaultStore();
  return store.id;
}

export async function getSiteSettings(storeId: string) {
  const rows = await prisma.siteSetting.findMany({ where: { storeId } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getContactDetails(storeId: string) {
  return prisma.contactDetails.findUnique({ where: { storeId } });
}
