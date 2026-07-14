import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { getDefaultStore } from "@/lib/store";
import { prisma } from "@/lib/prisma";
import { formatInr, whatsappLink, siteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getDefaultStore();
  const product = await getProductBySlug(store.id, slug);
  if (!product) return { title: "Product not found" };
  const image = product.images[0]?.url;
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || product.description || undefined,
    alternates: { canonical: siteUrl(`/products/${product.slug}`) },
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription || undefined,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const store = await getDefaultStore();
  const product = await getProductBySlug(store.id, slug);
  if (!product) notFound();
  const contact = await prisma.contactDetails.findUnique({ where: { storeId: store.id } });
  const wa = contact?.whatsapp || "919818697434";
  const price = Number(product.price);
  const mrp = Number(product.mrp);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    sku: product.sku || undefined,
    image: product.images.map((i) => i.url),
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "INR",
      price: price,
      availability: product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: siteUrl(`/products/${product.slug}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="sub-header">
        <Link href="/products" className="back-btn">
          ← PRODUCTS
        </Link>
        <h3>{product.name}</h3>
      </header>
      <div style={{ marginTop: 70, padding: "40px 6%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ background: "#f9f9f9", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]?.url || "/images/mtg-logo.svg"}
              alt={product.name}
              style={{ maxHeight: 480, objectFit: "contain", width: "100%" }}
            />
          </div>
          {product.images.length > 1 ? (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {product.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.id} src={img.thumbnailUrl || img.url} alt={img.alt || product.name} loading="lazy" style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #eee" }} />
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 12, textTransform: "uppercase" }}>{product.name}</h1>
          {product.sku ? <p style={{ color: "#666", marginBottom: 12 }}>SKU: {product.sku}</p> : null}
          {product.brand ? <p style={{ marginBottom: 8 }}>Brand: <strong>{product.brand.name}</strong></p> : null}
          {product.category ? <p style={{ marginBottom: 8 }}>Category: <strong>{product.category.name}</strong></p> : null}
          {mrp > price ? <p className="mrp">MRP: {formatInr(mrp)}</p> : null}
          <p className="offer-price" style={{ fontSize: 28 }}>
            {formatInr(price)}
            {product.unit === "sq ft" ? "/sq ft" : ""}
          </p>
          {product.discountPercent ? <p className="tag">{Math.round(Number(product.discountPercent))}% OFF</p> : null}
          <p style={{ margin: "20px 0", lineHeight: 1.7, color: "#444" }}>{product.description || product.shortDescription}</p>
          <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, marginBottom: 24, fontSize: 14 }}>
            {product.material ? (<><dt>Material</dt><dd>{product.material}</dd></>) : null}
            {product.finish ? (<><dt>Finish</dt><dd>{product.finish}</dd></>) : null}
            {product.color ? (<><dt>Color</dt><dd>{product.color}</dd></>) : null}
            {product.size ? (<><dt>Size</dt><dd>{product.size}</dd></>) : null}
            {product.dimensions ? (<><dt>Dimensions</dt><dd>{product.dimensions}</dd></>) : null}
            <dt>Stock</dt>
            <dd>{product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock"}</dd>
          </dl>
          <a className="btn-wa" href={whatsappLink(wa, `Enquiry for ${product.name}`)} target="_blank" rel="noopener noreferrer">
            ENQUIRE NOW
          </a>
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important}}`}</style>
    </>
  );
}
