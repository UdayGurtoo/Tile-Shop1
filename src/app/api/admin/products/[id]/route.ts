import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { productSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true, brand: true },
  });
  if (!product) return jsonError("Not found", 404);
  return jsonOk(product);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid data");

  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.product.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);

  const data = parsed.data;
  let slug = data.slug;
  if (data.name && !data.slug) slug = toSlug(data.name);
  if (slug && slug !== existing.slug) {
    const clash = await prisma.product.findFirst({ where: { storeId, slug, NOT: { id } } });
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name != null ? { name: data.name } : {}),
      ...(slug ? { slug } : {}),
      ...(data.sku !== undefined ? { sku: data.sku } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.shortDescription !== undefined ? { shortDescription: data.shortDescription } : {}),
      ...(data.material !== undefined ? { material: data.material } : {}),
      ...(data.finish !== undefined ? { finish: data.finish } : {}),
      ...(data.color !== undefined ? { color: data.color } : {}),
      ...(data.dimensions !== undefined ? { dimensions: data.dimensions } : {}),
      ...(data.size !== undefined ? { size: data.size } : {}),
      ...(data.thickness !== undefined ? { thickness: data.thickness } : {}),
      ...(data.unit != null ? { unit: data.unit } : {}),
      ...(data.mrp != null ? { mrp: new Prisma.Decimal(data.mrp) } : {}),
      ...(data.price != null ? { price: new Prisma.Decimal(data.price) } : {}),
      ...(data.discountPercent !== undefined
        ? {
            discountPercent:
              data.discountPercent != null ? new Prisma.Decimal(data.discountPercent) : null,
          }
        : {}),
      ...(data.stockQuantity != null ? { stockQuantity: data.stockQuantity } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.brandId !== undefined ? { brandId: data.brandId } : {}),
      ...(data.collection !== undefined ? { collection: data.collection } : {}),
      ...(data.isPublished != null ? { isPublished: data.isPublished } : {}),
      ...(data.isFeatured != null ? { isFeatured: data.isFeatured } : {}),
      ...(data.isNewArrival != null ? { isNewArrival: data.isNewArrival } : {}),
      ...(data.sortOrder != null ? { sortOrder: data.sortOrder } : {}),
      ...(data.tags ? { tags: data.tags } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  // Attach new images if provided
  if (Array.isArray(body.images) && body.images.length) {
    const maxOrder = updated.images.reduce((m, i) => Math.max(m, i.sortOrder), -1);
    await prisma.productImage.createMany({
      data: body.images.map(
        (img: { url: string; publicId?: string; thumbnailUrl?: string; alt?: string }, i: number) => ({
          productId: id,
          url: img.url,
          publicId: img.publicId || null,
          thumbnailUrl: img.thumbnailUrl || img.url,
          alt: img.alt || updated.name,
          sortOrder: maxOrder + 1 + i,
        })
      ),
    });
  }

  const full = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true, brand: true },
  });
  return jsonOk(full);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const product = await prisma.product.findFirst({
    where: { id, storeId },
    include: { images: true },
  });
  if (!product) return jsonError("Not found", 404);

  for (const img of product.images) {
    if (img.publicId) await deleteCloudinaryImage(img.publicId);
  }
  await prisma.product.delete({ where: { id } });
  return jsonOk({ ok: true });
}
