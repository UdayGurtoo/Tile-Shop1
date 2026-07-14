import { NextRequest } from "next/server";
import { requireAdmin, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { InquiryStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const status = req.nextUrl.searchParams.get("status") as InquiryStatus | null;
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const pageSize = Math.min(100, Number(req.nextUrl.searchParams.get("pageSize") || 20));
  const where = { storeId, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactInquiry.count({ where }),
  ]);
  return jsonOk({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
