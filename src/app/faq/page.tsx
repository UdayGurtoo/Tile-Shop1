import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqPage() {
  const store = await getDefaultStore();
  const faqs = await prisma.fAQ.findMany({
    where: { storeId: store.id, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← HOME
        </Link>
        <h3>FAQs</h3>
      </header>
      <div className="hero-sub" style={{ background: "#111" }}>
        <h1>Frequently Asked Questions</h1>
      </div>
      <div style={{ padding: "60px 6%", maxWidth: 800, margin: "0 auto" }}>
        {faqs.map((f) => (
          <details key={f.id} style={{ marginBottom: 16, border: "1px solid #eee", padding: 16 }}>
            <summary style={{ fontWeight: 700, cursor: "pointer" }}>{f.question}</summary>
            <p style={{ marginTop: 12, color: "#444", lineHeight: 1.7 }}>{f.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}
