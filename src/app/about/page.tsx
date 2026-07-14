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
          ← HOME
        </Link>
        <h3>ABOUT US</h3>
      </header>
      <div className="hero-sub" style={{ background: "#111" }}>
        <h1>{contact?.aboutTitle || "Our Legacy"}</h1>
      </div>
      <div style={{ padding: "60px 6%", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "#444" }}>{contact?.legacyText}</p>
        {contact?.aboutHtml ? (
          <div style={{ marginTop: 24, textAlign: "left" }} dangerouslySetInnerHTML={{ __html: contact.aboutHtml }} />
        ) : null}
        <div className="brand-slider" style={{ marginTop: 40 }}>
          <div className="brand-track">
            {[...logos, ...logos].map((l, i) => (
              <div className="brand-logo" key={`${l.id}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.imageUrl} alt={l.name} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
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
