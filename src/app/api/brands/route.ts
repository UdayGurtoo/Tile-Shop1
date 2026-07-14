import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const storeId = await getStoreId();
  const brands = await prisma.brand.findMany({
    where: { storeId, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return jsonOk(brands, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
  });
}
