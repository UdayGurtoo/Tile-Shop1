import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const storeId = await getStoreId();
  const categories = await prisma.category.findMany({
    where: { storeId, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return jsonOk(categories, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
  });
}
