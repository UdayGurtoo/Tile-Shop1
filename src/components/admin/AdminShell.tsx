"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
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

export default function AdminShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-5 py-5">
          <Link href="/admin" className="block">
            <span className="text-lg font-bold tracking-tight text-amber-400">
              Mohit Tiles
            </span>
            <span className="mt-0.5 block text-xs uppercase tracking-widest text-zinc-500">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    isActive(item.href, item.exact)
                      ? "bg-amber-500/15 font-medium text-amber-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <p className="truncate text-sm font-medium text-zinc-200">
            {session.user?.name || session.user?.email}
          </p>
          <p className="truncate text-xs text-zinc-500">{session.user?.email}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-3 w-full rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-300"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
