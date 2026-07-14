"use client";

import Link from "next/link";

export default function AdminPortalPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header Banner */}
      <div
        className="admin-card"
        style={{
          background: "#000",
          color: "#fff",
          borderLeft: "6px solid #ffcc00",
          padding: "28px 32px",
          marginBottom: 28,
          borderRadius: 4,
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: "#ffcc00" }}>
          🚀 Client & Admin Quick-Access Hub
        </h1>
        <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, maxWidth: 750 }}>
          Welcome to your centralized Website Management Portal. Select a section below to add,
          update, or remove products, showcase gallery photos, or adjust promotional banners instantly.
        </p>
      </div>

      {/* Quick Credentials Reminder Box */}
      <div
        className="admin-card"
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          padding: "16px 20px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <strong style={{ color: "#92400e", fontSize: 14 }}>🔑 Default Login Details:</strong>{" "}
          <span style={{ fontSize: 14, color: "#78350f" }}>
            Email: <b>admin@mohittiles.com</b> &nbsp;|&nbsp; Password:{" "}
            <b>ChangeMe_StrongPassword123!</b>
          </span>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary"
          style={{ background: "#92400e", color: "#fff", textDecoration: "none" }}
        >
          + Quick Add Product
        </Link>
      </div>

      {/* Section 1 */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "2px solid #000",
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              background: "#000",
              color: "#ffcc00",
              fontWeight: 800,
              padding: "4px 10px",
              fontSize: 13,
              borderRadius: 2,
            }}
          >
            SECTION 1
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Product & Catalogue Management
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🛍️</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>All Products & Pricing</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                View your complete catalog of granite, tiles, and sanitaryware. Update prices, MRP, discounts, and inventory stock.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/admin/products" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>
                Manage Products
              </Link>
              <Link
                href="/admin/products/new"
                style={{
                  background: "#ffcc00",
                  color: "#000",
                  padding: "10px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                + Add New
              </Link>
            </div>
          </div>

          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🗂️</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Product Categories</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Organize items under Toilets, Faucets, Wash Basins, Kitchen, and Granites & Marbles. Change category thumbnail images.
              </p>
            </div>
            <Link href="/admin/categories" className="btn-primary" style={{ textAlign: "center" }}>
              Manage Categories
            </Link>
          </div>

          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🏷️</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Partner Brands</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Manage brand logos (*CERA*, *SOMANY*, and custom partners) displayed across the website and filter pages.
              </p>
            </div>
            <Link href="/admin/brands" className="btn-primary" style={{ textAlign: "center" }}>
              Manage Brands
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "2px solid #000",
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              background: "#000",
              color: "#ffcc00",
              fontWeight: 800,
              padding: "4px 10px",
              fontSize: 13,
              borderRadius: 2,
            }}
          >
            SECTION 2
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Gallery & Visual Showcase
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Inspiration & Showroom Gallery</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Upload kitchen designs, luxury bathroom installations, or real-life customer project photos to inspire new buyers.
              </p>
            </div>
            <Link href="/admin/gallery" className="btn-primary" style={{ textAlign: "center" }}>
              Upload & Manage Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "2px solid #000",
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              background: "#000",
              color: "#ffcc00",
              fontWeight: 800,
              padding: "4px 10px",
              fontSize: 13,
              borderRadius: 2,
            }}
          >
            SECTION 3
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Homepage Banners, Offers & Contact
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📢</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Hero Sliders & Banners</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Add or edit the large full-width banner slides shown on top of your website landing page.
              </p>
            </div>
            <Link href="/admin/banners" className="btn-primary" style={{ textAlign: "center" }}>
              Manage Banners
            </Link>
          </div>

          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Special Offers & Promos</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Update seasonal sale banners (like *FLAT 30% OFF*) or limited time discounts.
              </p>
            </div>
            <Link href="/admin/offers" className="btn-primary" style={{ textAlign: "center" }}>
              Manage Offers
            </Link>
          </div>

          <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📍</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Showroom Contact & Inquiries</h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Change store phone numbers, WhatsApp links, Google Maps, and check incoming contact form inquiries.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/admin/contact" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>
                Contact Details
              </Link>
              <Link href="/admin/inquiries" className="btn-primary" style={{ flex: 1, textAlign: "center", background: "#333" }}>
                View Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
