import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/public/ProductCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getDefaultStore();
  const brand = await prisma.brand.findFirst({ where: { storeId: store.id, slug } });
  return { title: brand?.name || "Brand", description: brand?.description || undefined };
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const store = await getDefaultStore();
  const brand = await prisma.brand.findFirst({ where: { storeId: store.id, slug, isActive: true } });
  if (!brand) notFound();
  const contact = await prisma.contactDetails.findUnique({ where: { storeId: store.id } });
  const result = await listProducts({ storeId: store.id, brand: slug, pageSize: 48 });

  return (
    <>
      <header className="sub-header">
        <Link href="/brands" className="back-btn">
          ← BRANDS
        </Link>
        <h3>{brand.name}</h3>
      </header>
      <div className="hero-sub" style={{ background: "#111" }}>
        <h1>{brand.name}</h1>
      </div>
      <div style={{ padding: "40px 6%" }}>
        <p style={{ textAlign: "center", marginBottom: 40, color: "#555" }}>{brand.description}</p>
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
      </div>
    </>
  );
}
