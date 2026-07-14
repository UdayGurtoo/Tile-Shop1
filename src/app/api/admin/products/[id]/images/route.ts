import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await req.json();
  const imageIds: string[] = body.imageIds;
  if (!Array.isArray(imageIds)) return jsonError("imageIds array required");

  await prisma.$transaction(
    imageIds.map((imageId, index) =>
      prisma.productImage.updateMany({
        where: { id: imageId, productId: id },
        data: { sortOrder: index },
      })
    )
  );

  const images = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: { sortOrder: "asc" },
  });
  return jsonOk(images);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const imageId = req.nextUrl.searchParams.get("imageId");
  if (!imageId) return jsonError("imageId required");

  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId: id } });
  if (!image) return jsonError("Image not found", 404);
  if (image.publicId) await deleteCloudinaryImage(image.publicId);
  await prisma.productImage.delete({ where: { id: imageId } });
  return jsonOk({ ok: true });
}
