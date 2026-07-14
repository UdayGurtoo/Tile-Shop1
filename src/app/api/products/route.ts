import { NextRequest } from "next/server";
import { listProducts } from "@/lib/products";
import { getStoreId } from "@/lib/store";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { productSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const storeId = await getStoreId();
  const sp = req.nextUrl.searchParams;

  const result = await listProducts({
    storeId,
    q: sp.get("q") || undefined,
    category: sp.get("category") || undefined,
    brand: sp.get("brand") || undefined,
    size: sp.get("size") || undefined,
    material: sp.get("material") || undefined,
    finish: sp.get("finish") || undefined,
    color: sp.get("color") || undefined,
    collection: sp.get("collection") || undefined,
    featured: sp.get("featured") === "true" ? true : undefined,
    newArrival: sp.get("newArrival") === "true" ? true : undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    sort: (sp.get("sort") as "price_asc" | "price_desc" | "newest" | "name" | "featured") || "newest",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 12,
    publishedOnly: true,
  });

  return jsonOk(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid data");

  const storeId = session!.user.storeId || (await getStoreId());
  const data = parsed.data;
  let slug = data.slug || toSlug(data.name);

  const existing = await prisma.product.findFirst({ where: { storeId, slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const images = Array.isArray(body.images) ? body.images : [];

  const product = await prisma.product.create({
    data: {
      storeId,
      name: data.name,
      slug,
      sku: data.sku || null,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
      material: data.material || null,
      finish: data.finish || null,
      color: data.color || null,
      dimensions: data.dimensions || null,
      size: data.size || null,
      thickness: data.thickness || null,
      unit: data.unit || "piece",
      mrp: new Prisma.Decimal(data.mrp),
      price: new Prisma.Decimal(data.price),
      discountPercent:
        data.discountPercent != null ? new Prisma.Decimal(data.discountPercent) : null,
      stockQuantity: data.stockQuantity ?? 0,
      categoryId: data.categoryId || null,
      brandId: data.brandId || null,
      collection: data.collection || null,
      isPublished: data.isPublished ?? true,
      isFeatured: data.isFeatured ?? false,
      isNewArrival: data.isNewArrival ?? false,
      sortOrder: data.sortOrder ?? 0,
      specifications: (data.specifications as Prisma.InputJsonValue | undefined) ?? undefined,
      tags: data.tags || [],
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      seoKeywords: data.seoKeywords || null,
      images: {
        create: images.map(
          (
            img: { url: string; publicId?: string; thumbnailUrl?: string; alt?: string; sortOrder?: number },
            i: number
          ) => ({
            url: img.url,
            publicId: img.publicId || null,
            thumbnailUrl: img.thumbnailUrl || img.url,
            alt: img.alt || data.name,
            sortOrder: img.sortOrder ?? i,
          })
        ),
      },
    },
    include: { images: true, category: true, brand: true },
  });

  return jsonOk(product, { status: 201 });
}
