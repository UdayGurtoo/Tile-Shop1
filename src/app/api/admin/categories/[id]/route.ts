import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { categorySchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const body = await req.json();
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");

  const existing = await prisma.category.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);

  const data = parsed.data;
  let slug = data.slug;
  if (data.name && !slug) slug = toSlug(data.name);

  const item = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name != null ? { name: data.name } : {}),
      ...(slug ? { slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {}),
      ...(data.parentId !== undefined ? { parentId: data.parentId } : {}),
      ...(data.isActive != null ? { isActive: data.isActive } : {}),
      ...(data.sortOrder != null ? { sortOrder: data.sortOrder } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
    },
  });
  return jsonOk(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.category.findFirst({
    where: { id, storeId },
    include: { _count: { select: { products: true } } },
  });
  if (!existing) return jsonError("Not found", 404);
  if (existing._count.products > 0) {
    return jsonError("Cannot delete category with products. Move or delete products first.");
  }
  await prisma.category.delete({ where: { id } });
  return jsonOk({ ok: true });
}
