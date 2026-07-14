import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { brandSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(
    await prisma.brand.findMany({ where: { storeId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
  );
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = brandSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  let slug = d.slug || toSlug(d.name);
  if (await prisma.brand.findFirst({ where: { storeId, slug } })) slug = `${slug}-${Date.now().toString(36)}`;
  return jsonOk(
    await prisma.brand.create({
      data: {
        storeId,
        name: d.name,
        slug,
        description: d.description || null,
        logoUrl: d.logoUrl || null,
        website: d.website || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    }),
    { status: 201 }
  );
}
