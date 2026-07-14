import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { heroBannerSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(
    await prisma.heroBanner.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } })
  );
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = heroBannerSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(
    await prisma.heroBanner.create({
      data: {
        storeId,
        title: d.title,
        subtitle: d.subtitle || null,
        imageUrl: d.imageUrl,
        publicId: d.publicId || null,
        linkUrl: d.linkUrl || null,
        ctaText: d.ctaText || null,
        type: d.type || "HERO",
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    }),
    { status: 201 }
  );
}
