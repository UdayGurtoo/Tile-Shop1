"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin/portal", label: "⚡ Quick Portal" },
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid #222", marginBottom: 12 }}>
        <strong style={{ color: "#ffcc00" }}>MOHIT ADMIN</strong>
        <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{name}</p>
      </div>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href)) ? "active" : undefined}>
          {l.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        style={{ margin: "24px", background: "transparent", border: "1px solid #333", color: "#ccc", padding: "10px 16px", cursor: "pointer", width: "calc(100% - 48px)" }}
      >
        Sign out
      </button>
    </aside>
  );
}
