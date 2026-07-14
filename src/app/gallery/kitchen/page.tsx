import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kitchen Designs" };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function KitchenGalleryPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || 1));
  const pageSize = 10;
  const store = await getDefaultStore();

  const where = { storeId: store.id, category: "kitchen", isActive: true };
  const [items, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryImage.count({ where }),
  ]);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← BACK
        </Link>
        <h2 style={{ fontSize: 18, letterSpacing: 1 }}>KITCHEN DESIGNS</h2>
      </header>
      <div
        className="hero-sub"
        style={{
          background: "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)), url('/images/KD.png') center/cover",
        }}
      >
        <h1>Premium Kitchen Designs</h1>
      </div>
      <div style={{ padding: "40px 10%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {items.map((img) => (
            <div key={img.id} style={{ height: 350, overflow: "hidden", border: "1px solid #eee", background: "#f4f4f4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.title || "Kitchen design"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
        {totalPages > 1 ? (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/gallery/kitchen?page=${p}`} className={`page-btn${p === page ? " active" : ""}`}>
                {p}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
