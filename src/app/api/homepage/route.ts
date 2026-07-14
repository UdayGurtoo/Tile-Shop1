import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const storeId = await getStoreId();

  const [banners, offers, blocks, logos, contact, testimonials, categories] = await Promise.all([
    prisma.heroBanner.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.offer.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.homepageBlock.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.clientLogo.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.contactDetails.findUnique({ where: { storeId } }),
    prisma.testimonial.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.category.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return jsonOk(
    { banners, offers, blocks, logos, contact, testimonials, categories },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
