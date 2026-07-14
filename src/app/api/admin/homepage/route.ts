import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const blockSchema = z.object({
  key: z.string().min(1),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const [blocks, settings, logos] = await Promise.all([
    prisma.homepageBlock.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany({ where: { storeId } }),
    prisma.clientLogo.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonOk({ blocks, settings, logos });
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const body = await req.json();
  const blocks = Array.isArray(body.blocks) ? body.blocks : [body];
  const results = [];
  for (const raw of blocks) {
    const parsed = blockSchema.safeParse(raw);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid block");
    const d = parsed.data;
    const item = await prisma.homepageBlock.upsert({
      where: { storeId_key: { storeId, key: d.key } },
      create: {
        storeId,
        key: d.key,
        title: d.title || null,
        subtitle: d.subtitle || null,
        body: d.body || null,
        imageUrl: d.imageUrl || null,
        linkUrl: d.linkUrl || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
      update: {
        title: d.title || null,
        subtitle: d.subtitle || null,
        body: d.body || null,
        imageUrl: d.imageUrl || null,
        linkUrl: d.linkUrl || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    });
    results.push(item);
  }
  return jsonOk(results);
}
