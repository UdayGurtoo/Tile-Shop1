import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import { ContactForm } from "@/components/public/ContactForm";
import { Footer } from "@/components/public/Footer";
import { formatTime12h } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const store = await getDefaultStore();
  const contact = await prisma.contactDetails.findUnique({ where: { storeId: store.id } });

  return (
    <>
      <header className="sub-header">
        <Link href="/" className="back-btn">
          ← HOME
        </Link>
        <h3>CONTACT US</h3>
      </header>
      <div className="hero-sub" style={{ background: "#111" }}>
        <h1>Visit Our Showroom</h1>
      </div>
      <div style={{ padding: "60px 6%", maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <h2 style={{ marginBottom: 16 }}>{contact?.businessName}</h2>
          <p style={{ lineHeight: 1.8, color: "#444" }}>
            {contact?.addressLine1}
            <br />
            {contact?.city}, {contact?.state}
            <br />
            Phone: {contact?.phonePrimary}
            <br />
            Email: {contact?.email}
            <br />
            Hours: {contact?.openDays} {formatTime12h(contact?.openTime || "10:00")} to {formatTime12h(contact?.closeTime || "20:00")}
          </p>
          {contact?.mapEmbedUrl ? (
            <div className="map-container" style={{ marginTop: 24, height: 280 }}>
              <iframe src={contact.mapEmbedUrl} title="Map" loading="lazy" />
            </div>
          ) : null}
        </div>
        <ContactForm />
      </div>
      <Footer
        businessName={contact?.businessName || store.name}
        phone={contact?.phonePrimary || "+91 98111 22233"}
        openTime={contact?.openTime || "10:00"}
        closeTime={contact?.closeTime || "20:00"}
        openDays={contact?.openDays || "Everyday"}
      />
    </>
  );
}
