import { getProductBySlug } from "@/lib/products";
import { getStoreId } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const storeId = await getStoreId();
  const product = await getProductBySlug(storeId, slug);
  if (!product) return jsonError("Product not found", 404);
  return jsonOk(product, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
