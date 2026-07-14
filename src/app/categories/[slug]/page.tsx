import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/public/ProductCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string; brand?: string; collection?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getDefaultStore();
  const category = await prisma.category.findFirst({ where: { storeId: store.id, slug, isActive: true } });
  if (!category) return { title: "Category" };
  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const store = await getDefaultStore();
  const category = await prisma.category.findFirst({ where: { storeId: store.id, slug, isActive: true } });
  if (!category) notFound();

  const contact = await prisma.contactDetails.findUnique({ where: { storeId: store.id } });
  const brands = await prisma.brand.findMany({
    where: { storeId: store.id, isActive: true, products: { some: { categoryId: category.id, isPublished: true } } },
    orderBy: { sortOrder: "asc" },
  });

  const page = Number(sp.page || 1);
  const result = await listProducts({
    storeId: store.id,
    category: slug,
    brand: sp.brand,
    collection: sp.collection,
    page,
    pageSize: 12,
  });

  const collections = [
    ...new Set(
      (
        await prisma.product.findMany({
          where: { storeId: store.id, categoryId: category.id, isPublished: true, collection: { not: null } },
          select: { collection: true },
        })
      )
        .map((p) => p.collection)
        .filter(Boolean) as string[]
    ),
  ];

  const heroImage = category.imageUrl || "/images/MB.png";

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← HOME
        </Link>
        <h3>{category.name.toUpperCase()}</h3>
      </header>
      <div
        className="hero-sub"
        style={{
          background: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('${heroImage}') center/cover`,
        }}
      >
        <h1>{category.name}</h1>
      </div>

      {brands.length > 0 ? (
        <div style={{ padding: "40px 6%", textAlign: "center", background: "#fafafa", borderBottom: "1px solid #eee" }}>
          <h2 style={{ marginBottom: 24, fontSize: 22, letterSpacing: 1 }}>SELECT A BRAND</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            <Link href={`/categories/${slug}`} style={{ fontWeight: 700, color: !sp.brand ? "#000" : "#888" }}>
              All
            </Link>
            {brands.map((b) => (
              <Link key={b.id} href={`/categories/${slug}?brand=${b.slug}`} style={{ textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.logoUrl || "/images/mtg-logo.svg"} alt={b.name} style={{ width: 180, height: 90, objectFit: "contain", background: "#fff", padding: 10, border: "1px solid #ddd" }} />
                <p style={{ marginTop: 10, fontWeight: 700 }}>{b.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {collections.length > 0 ? (
        <div style={{ padding: "20px 6%", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {collections.map((c) => (
            <Link key={c} href={`/categories/${slug}?collection=${encodeURIComponent(c)}${sp.brand ? `&brand=${sp.brand}` : ""}`} className="page-btn">
              {c}
            </Link>
          ))}
        </div>
      ) : null}

      <div style={{ padding: "40px 6%" }}>
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
              <Link
                key={p}
                href={`/categories/${slug}?page=${p}${sp.brand ? `&brand=${sp.brand}` : ""}${sp.collection ? `&collection=${sp.collection}` : ""}`}
                className={`page-btn${p === page ? " active" : ""}`}
              >
                {p}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
