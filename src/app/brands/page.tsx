import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Brands" };

export default async function BrandsPage() {
  const store = await getDefaultStore();
  const brands = await prisma.brand.findMany({
    where: { storeId: store.id, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← BACK TO HOME
        </Link>
      </header>
      <div className="hero-sub" style={{ background: "#111" }}>
        <h1>Our Official Brands</h1>
      </div>
      <div style={{ padding: "80px 6%", maxWidth: 1200, margin: "0 auto" }}>
        <div className="product-grid">
          {brands.map((b) => (
            <Link key={b.id} href={`/brands/${b.slug}`} className="item-card" style={{ padding: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.logoUrl || "/images/mtg-logo.svg"} alt={b.name} style={{ height: 100, width: "auto", margin: "0 auto 20px", objectFit: "contain" }} />
              <h2 style={{ textAlign: "center" }}>{b.name}</h2>
              <p style={{ textAlign: "center", color: "#666", marginTop: 12 }}>{b.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
