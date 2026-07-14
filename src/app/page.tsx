import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultStore } from "@/lib/store";
import { SplashScreen } from "@/components/public/SplashScreen";
import { Header } from "@/components/public/Header";
import { HeroSlider } from "@/components/public/HeroSlider";
import { Reveal } from "@/components/public/Reveal";
import { ContactFloat } from "@/components/public/ContactFloat";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getDefaultStore();
    const seo = await prisma.homepageBlock.findUnique({
      where: { storeId_key: { storeId: store.id, key: "seo_home" } },
    });
    return {
      title: seo?.title || "Mohit Tiles & Granites | 40 Years of Excellence",
      description: seo?.subtitle || undefined,
      openGraph: {
        title: seo?.title || "Mohit Tiles & Granites",
        description: seo?.subtitle || undefined,
        type: "website",
      },
    };
  } catch {
    return {};
  }
}

export default async function HomePage() {
  let store;
  try {
    store = await getDefaultStore();
  } catch {
    return (
      <main style={{ padding: 80, textAlign: "center" }}>
        <h1>Database not configured</h1>
        <p style={{ marginTop: 16 }}>Set DATABASE_URL and run: npm run db:migrate && npm run db:seed</p>
      </main>
    );
  }

  const [banners, blocks, logos, contact, categories, settings] = await Promise.all([
    prisma.heroBanner.findMany({
      where: { storeId: store.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.homepageBlock.findMany({ where: { storeId: store.id, isActive: true } }),
    prisma.clientLogo.findMany({
      where: { storeId: store.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.contactDetails.findUnique({ where: { storeId: store.id } }),
    prisma.category.findMany({
      where: { storeId: store.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSetting.findMany({ where: { storeId: store.id } }),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const block = (key: string) => blocks.find((b) => b.key === key);
  const promo = banners.find((b) => b.type === "PROMO");
  const heroes = banners.filter((b) => b.type === "HERO");
  const sanitarySlugs = ["toilets", "faucets", "wash-basins"];
  const tileSlugs = ["bathroom-tiles", "kitchen", "living-room"];
  const sanitary = categories.filter((c) => sanitarySlugs.includes(c.slug));
  const tiles = categories.filter((c) => tileSlugs.includes(c.slug));
  const logoUrl = settingsMap.logo_url || "/images/logo.png";
  const splashTitle = settingsMap.splash_title || "MOHIT TILES AND GRANITES";

  return (
    <>
      <SplashScreen logoUrl={logoUrl} title={splashTitle} />
      {promo ? <div className="top-promo-banner">{promo.title}</div> : null}
      <Header logoUrl={logoUrl} hasPromo={!!promo} />
      <main className={`main-content${promo ? "" : " no-promo"}`}>
        <HeroSlider
          slides={heroes.map((h) => ({
            id: h.id,
            title: h.title,
            subtitle: h.subtitle,
            imageUrl: h.imageUrl,
          }))}
        />

        <Reveal style={{ background: "#fafafa" }}>
          <h2 className="section-title">{block("sanitary_heading")?.title || "FIND SANITARYWARE BY CATEGORY"}</h2>
          <div className="category-grid">
            {sanitary.map((c) => (
              <Link key={c.id} href={`/categories/${c.slug}`} className="category-card">
                <div className="img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl || "/images/logo.png"} alt={c.name} loading="lazy" />
                  <div className="overlay">
                    <span className="shop-btn">SHOP NOW</span>
                  </div>
                </div>
                <h3>{c.name}</h3>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="section-title">{block("tiles_heading")?.title || "FIND TILES BY CATEGORY"}</h2>
          <div className="category-grid">
            {tiles.map((c) => (
              <Link
                key={c.id}
                href={c.slug === "kitchen" ? "/gallery/kitchen" : `/categories/${c.slug === "bathroom-tiles" || c.slug === "living-room" ? "granites-marbles" : c.slug}`}
                className="category-card"
              >
                <div className="img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl || "/images/logo.png"} alt={c.name} loading="lazy" />
                  <div className="overlay">
                    <span className="shop-btn">SHOP NOW</span>
                  </div>
                </div>
                <h3>{c.name}</h3>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: 32 }}>{contact?.aboutTitle || block("about")?.title || "OUR 40-YEAR LEGACY"}</h2>
            <div style={{ width: 60, height: 3, background: "#ffcc00", margin: "20px auto" }} />
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "#444" }}>
              {contact?.legacyText || block("about")?.body}
            </p>
          </div>
          <div className="brand-slider">
            <div className="brand-track">
              {[...logos, ...logos].map((logo, i) => (
                <div className="brand-logo" key={`${logo.id}-${i}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.imageUrl} alt={logo.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal style={{ background: "#f9f9f9" }}>
          <h2>{block("contact_heading")?.title || "VISIT OUR SHOWROOM"}</h2>
          {contact?.mapEmbedUrl ? (
            <div className="map-container">
              <iframe src={contact.mapEmbedUrl} title="Showroom map" loading="lazy" allowFullScreen />
            </div>
          ) : null}
          <div style={{ marginTop: 20 }}>
            <h1 style={{ fontSize: 28 }}>
              Open {contact?.openDays || "Everyday"} • {contact?.openTime || "10:00"} – {contact?.closeTime || "20:00"}
            </h1>
          </div>
        </Reveal>
      </main>

      {contact ? (
        <ContactFloat
          phone={contact.phonePrimary}
          whatsapp={contact.whatsapp}
          openTime={contact.openTime}
          closeTime={contact.closeTime}
        />
      ) : null}
    </>
  );
}
