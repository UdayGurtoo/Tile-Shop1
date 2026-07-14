import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(await prisma.testimonial.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = testimonialSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(await prisma.testimonial.create({ data: { storeId, name: d.name, role: d.role || null, company: d.company || null, content: d.content, rating: d.rating ?? 5, avatarUrl: d.avatarUrl || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0 } }), { status: 201 });
}
