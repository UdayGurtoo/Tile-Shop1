import { requireAdmin, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const storeId = session!.user.storeId || (await getStoreId());

  const [products, categories, newInquiries, lowStock, unpublished] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.category.count({ where: { storeId } }),
    prisma.contactInquiry.count({ where: { storeId, status: "NEW" } }),
    prisma.product.count({
      where: { storeId, stockQuantity: { lte: 5 } },
    }),
    prisma.product.count({ where: { storeId, isPublished: false } }),
  ]);

  const recentInquiries = await prisma.contactInquiry.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return jsonOk({
    products,
    categories,
    newInquiries,
    lowStock,
    unpublished,
    recentInquiries,
  });
}
