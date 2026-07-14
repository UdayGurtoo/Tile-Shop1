import { getFilterOptions } from "@/lib/products";
import { getStoreId } from "@/lib/store";
import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const storeId = await getStoreId();
  const [options, categories, brands] = await Promise.all([
    getFilterOptions(storeId),
    prisma.category.findMany({
      where: { storeId, isActive: true },
      select: { name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      where: { storeId, isActive: true },
      select: { name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return jsonOk(
    { ...options, categories, brands },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } }
  );
}
