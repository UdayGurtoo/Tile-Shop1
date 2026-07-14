import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const store = await getDefaultStore();
  const [contact, services, logos] = await Promise.all([
    prisma.contactDetails.findUnique({ where: { storeId: store.id } }),
    prisma.service.findMany({ where: { storeId: store.id, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.clientLogo.findMany({ where: { storeId: store.id, isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← BACK TO HOME
        </Link>
      </header>
      <div className="hero-sub">
        <h1>ABOUT US</h1>
      </div>
      <div style={{ padding: "80px 6%", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, marginBottom: 24 }}>{contact?.aboutTitle || "OUR 40-YEAR LEGACY"}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "#444", marginBottom: 60 }}>{contact?.legacyText}</p>
        <div style={{ textAlign: "left", background: "#f9f9f9", padding: 40, borderRadius: 12, marginBottom: 60, border: "1px solid #eee" }}>
          <div dangerouslySetInnerHTML={{ __html: contact?.aboutHtml || "" }} />
        </div>
        <h3 style={{ fontSize: 24, marginBottom: 30 }}>TRUSTED BY LEADING BUILDERS & ARCHITECTS</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", opacity: 0.7 }}>
          {logos.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.id} src={l.imageUrl || "/images/mtg-logo.svg"} alt={l.name} style={{ height: 50, objectFit: "contain" }} />
          ))}
        </div>
      </div>
      <div style={{ background: "#f1f1f1", padding: "80px 6%", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, marginBottom: 40 }}>WHAT WE OFFER</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, maxWidth: 1200, margin: "0 auto" }}>
          {services.map((s) => (
            <div key={s.id} className="admin-card" style={{ textAlign: "left" }}>
              <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#555", lineHeight: 1.6 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
