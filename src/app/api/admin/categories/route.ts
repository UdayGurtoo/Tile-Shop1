import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { categorySchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const items = await prisma.category.findMany({
    where: { storeId },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");

  const storeId = session!.user.storeId || (await getStoreId());
  const data = parsed.data;
  let slug = data.slug || toSlug(data.name);
  if (await prisma.category.findFirst({ where: { storeId, slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const item = await prisma.category.create({
    data: {
      storeId,
      name: data.name,
      slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      parentId: data.parentId || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });
  return jsonOk(item, { status: 201 });
}
