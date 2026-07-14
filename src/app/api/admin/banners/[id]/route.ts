import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { heroBannerSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = heroBannerSchema.partial().safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.heroBanner.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  const d = parsed.data;
  return jsonOk(
    await prisma.heroBanner.update({
      where: { id },
      data: {
        ...(d.title != null ? { title: d.title } : {}),
        ...(d.subtitle !== undefined ? { subtitle: d.subtitle } : {}),
        ...(d.imageUrl != null ? { imageUrl: d.imageUrl } : {}),
        ...(d.publicId !== undefined ? { publicId: d.publicId } : {}),
        ...(d.linkUrl !== undefined ? { linkUrl: d.linkUrl } : {}),
        ...(d.ctaText !== undefined ? { ctaText: d.ctaText } : {}),
        ...(d.type != null ? { type: d.type } : {}),
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
  const existing = await prisma.heroBanner.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  await prisma.heroBanner.delete({ where: { id } });
  return jsonOk({ ok: true });
}
