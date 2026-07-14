import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { brandSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = brandSchema.partial().safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.brand.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  const d = parsed.data;
  return jsonOk(
    await prisma.brand.update({
      where: { id },
      data: {
        ...(d.name != null ? { name: d.name } : {}),
        ...(d.slug || d.name ? { slug: d.slug || toSlug(d.name!) } : {}),
        ...(d.description !== undefined ? { description: d.description } : {}),
        ...(d.logoUrl !== undefined ? { logoUrl: d.logoUrl } : {}),
        ...(d.website !== undefined ? { website: d.website } : {}),
        ...(d.isActive != null ? { isActive: d.isActive } : {}),
        ...(d.sortOrder != null ? { sortOrder: d.sortOrder } : {}),
      },
    })
  );
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.brand.findFirst({
    where: { id, storeId },
    include: { _count: { select: { products: true } } },
  });
  if (!existing) return jsonError("Not found", 404);
  if (existing._count.products > 0) return jsonError("Cannot delete brand with products");
  await prisma.brand.delete({ where: { id } });
  return jsonOk({ ok: true });
}
