import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { contactDetailsSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(await prisma.contactDetails.findUnique({ where: { storeId } }));
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = contactDetailsSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  const item = await prisma.contactDetails.upsert({
    where: { storeId },
    create: { storeId, ...d, emailSecondary: d.emailSecondary || null },
    update: { ...d, emailSecondary: d.emailSecondary || null },
  });
  return jsonOk(item);
}
