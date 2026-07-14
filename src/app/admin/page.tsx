"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  products: number;
  categories: number;
  newInquiries: number;
  lowStock: number;
  unpublished: number;
  recentInquiries: { id: string; name: string; status: string; createdAt: string; message: string }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { label: "Products", value: stats?.products ?? "—", href: "/admin/products" },
    { label: "Categories", value: stats?.categories ?? "—", href: "/admin/categories" },
    { label: "New Inquiries", value: stats?.newInquiries ?? "—", href: "/admin/inquiries" },
    { label: "Low Stock", value: stats?.lowStock ?? "—", href: "/admin/products" },
    { label: "Hidden Products", value: stats?.unpublished ?? "—", href: "/admin/products" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{c.value}</div>
            <div style={{ color: "#666", marginTop: 8, fontSize: 13, textTransform: "uppercase" }}>{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="admin-card">
        <h2 style={{ marginBottom: 16 }}>Recent Inquiries</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentInquiries || []).map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.status}</td>
                <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.message}</td>
                <td>{new Date(i.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
