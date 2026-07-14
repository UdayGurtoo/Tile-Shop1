import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.contactInquiry.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  return jsonOk(await prisma.contactInquiry.update({ where: { id }, data: parsed.data }));
}
