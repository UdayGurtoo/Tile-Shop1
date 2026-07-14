import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { listProducts } from "@/lib/products";
import { productSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { Prisma } from "@prisma/client";

async function storeIdFromSession(session: { user: { storeId?: string } }) {
  return session.user.storeId || (await getStoreId());
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = await storeIdFromSession(session!);
  const sp = req.nextUrl.searchParams;

  const result = await listProducts({
    storeId,
    q: sp.get("q") || undefined,
    category: sp.get("category") || undefined,
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 50,
    publishedOnly: false,
    sort: "newest",
  });
  return jsonOk(result);
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  // Reuse public POST logic body
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid data");

  const storeId = await storeIdFromSession(session!);
  const data = parsed.data;
  let slug = data.slug || toSlug(data.name);
  if (await prisma.product.findFirst({ where: { storeId, slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
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
      tags: data.tags || [],
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      images: {
        create: images.map(
          (img: { url: string; publicId?: string; thumbnailUrl?: string; alt?: string }, i: number) => ({
            url: img.url,
            publicId: img.publicId || null,
            thumbnailUrl: img.thumbnailUrl || img.url,
            alt: img.alt || data.name,
            sortOrder: i,
          })
        ),
      },
    },
    include: { images: true },
  });

  return jsonOk(product, { status: 201 });
}
