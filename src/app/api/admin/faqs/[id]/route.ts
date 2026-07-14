import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { faqSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = faqSchema.partial().safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.fAQ.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  return jsonOk(await prisma.fAQ.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.fAQ.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  await prisma.fAQ.delete({ where: { id } });
  return jsonOk({ ok: true });
}
