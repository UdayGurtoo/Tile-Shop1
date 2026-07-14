import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/gallery/kitchen`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const store = await getDefaultStore();
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        where: { storeId: store.id, isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { storeId: store.id, isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.brand.findMany({
        where: { storeId: store.id, isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...categories.map((c) => ({
        url: `${base}/categories/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...brands.map((b) => ({
        url: `${base}/brands/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
