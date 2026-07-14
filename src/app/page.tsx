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

async function fetchHomeData(storeId: string, retries = 3) {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const blocks = await prisma.homepageBlock.findMany({ where: { storeId, isActive: true } });
    const logos = await prisma.clientLogo.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const contact = await prisma.contactDetails.findUnique({ where: { storeId } });
    const categories = await prisma.category.findMany({
      where: { storeId, isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const settings = await prisma.siteSetting.findMany({ where: { storeId } });
    return { banners, blocks, logos, contact, categories, settings };
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchHomeData(storeId, retries - 1);
    }
    throw err;
  }
}

export default async function HomePage() {
  let store;
  let data;
  try {
    store = await getDefaultStore();
    data = await fetchHomeData(store.id);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return (
      <main style={{ padding: 80, textAlign: "center", fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Connecting to Cloud Database...</h1>
        <p style={{ color: "#666", marginBottom: 16 }}>
          If you just added DATABASE_URL on Vercel (`tile-shop3`), the database pool is initializing across regions.
        </p>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Please ensure DATABASE_URL includes `&pgbouncer=true&connect_timeout=30` and click Redeploy in Vercel.
        </p>
        <div style={{ background: "#fff3f3", border: "1px solid #ffcaca", padding: 16, borderRadius: 8, marginBottom: 24, textAlign: "left", fontSize: 13, color: "#b00", wordBreak: "break-all" }}>
          <strong>Exact Vercel Error:</strong><br />
          {errorMsg}
        </div>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Refresh Page
        </Link>
      </main>
    );
  }

  const { banners, blocks, logos, contact, categories, settings } = data;

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
