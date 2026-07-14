import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
  publicId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const category = req.nextUrl.searchParams.get("category") || undefined;
  return jsonOk(
    await prisma.galleryImage.findMany({
      where: { storeId, ...(category ? { category } : {}) },
      orderBy: { sortOrder: "asc" },
    })
  );
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = gallerySchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(
    await prisma.galleryImage.create({
      data: {
        storeId,
        title: d.title || null,
        imageUrl: d.imageUrl,
        publicId: d.publicId || null,
        category: d.category || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    }),
    { status: 201 }
  );
}
