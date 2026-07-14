import Link from "next/link";
import { listProducts, getFilterOptions } from "@/lib/products";
import { getDefaultStore } from "@/lib/store";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/public/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse tiles, granites, faucets and sanitaryware at Mohit Tiles & Granites.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const store = await getDefaultStore();
  const page = Number(get("page") || 1);
  const contact = await prisma.contactDetails.findUnique({ where: { storeId: store.id } });

  const result = await listProducts({
    storeId: store.id,
    q: get("q"),
    category: get("category"),
    brand: get("brand"),
    size: get("size"),
    material: get("material"),
    finish: get("finish"),
    color: get("color"),
    featured: get("featured") === "true" ? true : undefined,
    newArrival: get("newArrival") === "true" ? true : undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    sort: (get("sort") as "price_asc" | "price_desc" | "newest" | "name" | "featured") || "newest",
    page,
    pageSize: 12,
  });

  const [filters, categories, brands] = await Promise.all([
    getFilterOptions(store.id),
    prisma.category.findMany({
      where: { storeId: store.id, isActive: true },
      select: { name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      where: { storeId: store.id, isActive: true },
      select: { name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    for (const key of [
      "q",
      "category",
      "brand",
      "size",
      "material",
      "finish",
      "color",
      "featured",
      "newArrival",
      "minPrice",
      "maxPrice",
      "sort",
    ]) {
      const v = get(key);
      if (v) params.set(key, v);
    }
    params.set("page", String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← HOME
        </Link>
        <h3>ALL PRODUCTS</h3>
      </header>
      <div className="hero-sub" style={{ background: "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), #111" }}>
        <h1>Shop Our Collection</h1>
      </div>
      <div style={{ padding: "40px 6%" }}>
        <form className="filters-bar" method="get">
          <label>
            Search
            <input name="q" defaultValue={get("q") || ""} placeholder="Product name" />
          </label>
          <label>
            Category
            <select name="category" defaultValue={get("category") || ""}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select name="brand" defaultValue={get("brand") || ""}>
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Material
            <select name="material" defaultValue={get("material") || ""}>
              <option value="">All</option>
              {filters.materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Finish
            <select name="finish" defaultValue={get("finish") || ""}>
              <option value="">All</option>
              {filters.finishes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Color
            <select name="color" defaultValue={get("color") || ""}>
              <option value="">All</option>
              {filters.colors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Size
            <select name="size" defaultValue={get("size") || ""}>
              <option value="">All</option>
              {filters.sizes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Min ₹
            <input name="minPrice" type="number" defaultValue={get("minPrice") || ""} />
          </label>
          <label>
            Max ₹
            <input name="maxPrice" type="number" defaultValue={get("maxPrice") || ""} />
          </label>
          <label>
            Sort
            <select name="sort" defaultValue={get("sort") || "newest"}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="name">Name</option>
              <option value="featured">Featured</option>
            </select>
          </label>
          <label>
            Featured
            <select name="featured" defaultValue={get("featured") || ""}>
              <option value="">Any</option>
              <option value="true">Yes</option>
            </select>
          </label>
          <label>
            New Arrival
            <select name="newArrival" defaultValue={get("newArrival") || ""}>
              <option value="">Any</option>
              <option value="true">Yes</option>
            </select>
          </label>
          <button type="submit" className="btn-primary">
            Apply
          </button>
        </form>

        <p style={{ marginBottom: 24, color: "#666" }}>
          {result.total} product{result.total === 1 ? "" : "s"}
        </p>

        <div className="product-grid">
          {result.items.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              slug={p.slug}
              price={Number(p.price)}
              mrp={Number(p.mrp)}
              discountPercent={p.discountPercent != null ? Number(p.discountPercent) : null}
              imageUrl={p.images[0]?.thumbnailUrl || p.images[0]?.url}
              sku={p.sku}
              unit={p.unit}
              whatsapp={contact?.whatsapp || undefined}
            />
          ))}
        </div>

        {result.totalPages > 1 ? (
          <div className="pagination">
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={buildHref(p)} className={`page-btn${p === result.page ? " active" : ""}`}>
                {p}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
