import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/utils";

type SlugEntity = "product" | "category" | "brand";

async function slugExists(
  entity: SlugEntity,
  storeId: string,
  slug: string,
  excludeId?: string
) {
  const not = excludeId ? { NOT: { id: excludeId } } : {};
  switch (entity) {
    case "product":
      return prisma.product.findFirst({ where: { storeId, slug, ...not }, select: { id: true } });
    case "category":
      return prisma.category.findFirst({ where: { storeId, slug, ...not }, select: { id: true } });
    case "brand":
      return prisma.brand.findFirst({ where: { storeId, slug, ...not }, select: { id: true } });
  }
}

export async function ensureUniqueSlug(
  entity: SlugEntity,
  storeId: string,
  name: string,
  providedSlug?: string,
  excludeId?: string
) {
  const base = toSlug(providedSlug || name);
  let slug = base;
  let counter = 1;
  while (await slugExists(entity, storeId, slug, excludeId)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}
