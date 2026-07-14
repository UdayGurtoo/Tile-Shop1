import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { faqSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(await prisma.fAQ.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = faqSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(await prisma.fAQ.create({ data: { storeId, question: d.question, answer: d.answer, category: d.category || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0 } }), { status: 201 });
}
