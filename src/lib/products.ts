import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductListParams = {
  q?: string;
  category?: string;
  brand?: string;
  size?: string;
  material?: string;
  finish?: string;
  color?: string;
  featured?: boolean;
  newArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  collection?: string;
  page?: number;
  pageSize?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "name" | "featured";
  storeId: string;
  publishedOnly?: boolean;
};

export async function listProducts(params: ProductListParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 12));
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    storeId: params.storeId,
    ...(params.publishedOnly !== false ? { isPublished: true } : {}),
  };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { sku: { contains: params.q, mode: "insensitive" } },
      { tags: { has: params.q } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.brand) {
    where.brand = { slug: params.brand };
  }
  if (params.size) where.size = { equals: params.size, mode: "insensitive" };
  if (params.material) where.material = { equals: params.material, mode: "insensitive" };
  if (params.finish) where.finish = { equals: params.finish, mode: "insensitive" };
  if (params.color) where.color = { equals: params.color, mode: "insensitive" };
  if (params.collection) where.collection = { equals: params.collection, mode: "insensitive" };
  if (params.featured) where.isFeatured = true;
  if (params.newArrival) where.isNewArrival = true;

  if (params.minPrice != null || params.maxPrice != null) {
    where.price = {};
    if (params.minPrice != null) where.price.gte = params.minPrice;
    if (params.maxPrice != null) where.price.lte = params.maxPrice;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (params.sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
    case "featured":
      orderBy = { isFeatured: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        brand: true,
      },
      orderBy: [{ sortOrder: "asc" }, orderBy],
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductBySlug(storeId: string, slug: string) {
  return prisma.product.findFirst({
    where: { storeId, slug, isPublished: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
    },
  });
}

export async function getFilterOptions(storeId: string) {
  const products = await prisma.product.findMany({
    where: { storeId, isPublished: true },
    select: { material: true, finish: true, color: true, size: true },
  });

  const uniq = (values: (string | null)[]) =>
    [...new Set(values.filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));

  return {
    materials: uniq(products.map((p) => p.material)),
    finishes: uniq(products.map((p) => p.finish)),
    colors: uniq(products.map((p) => p.color)),
    sizes: uniq(products.map((p) => p.size)),
  };
}
