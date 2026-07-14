import { prisma } from "@/lib/prisma";
import type { Store } from "@prisma/client";

const DEFAULT_STORE_SLUG = "mohit-tiles-ghaziabad";

export async function getDefaultStore(retries = 2): Promise<Store> {
  try {
    const store =
      (await prisma.store.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" } })) ??
      (await prisma.store.findUnique({ where: { slug: DEFAULT_STORE_SLUG } }));

    if (!store) throw new Error("No store found. Run: npm run db:seed");
    return store;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return getDefaultStore(retries - 1);
    }
    throw err;
  }
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
