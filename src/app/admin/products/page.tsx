"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  stockQuantity: number;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  category?: { name: string } | null;
  images: { url: string; thumbnailUrl?: string | null }[];
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(search = q) {
    setLoading(true);
    const res = await fetch(`/api/admin/products?q=${encodeURIComponent(search)}&pageSize=100`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" style={{ padding: 10, border: "1px solid #ddd", flex: 1 }} />
        <button className="btn-primary" type="submit">
          Search
        </button>
      </form>
      <div className="admin-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]?.thumbnailUrl || p.images[0]?.url || "/images/logo.png"} alt="" width={48} height={48} style={{ objectFit: "cover" }} />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || "—"}</td>
                  <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td>{p.stockQuantity}</td>
                  <td style={{ fontSize: 12 }}>
                    <button type="button" onClick={() => patch(p.id, { isPublished: !p.isPublished })} style={{ marginRight: 4 }}>
                      {p.isPublished ? "Visible" : "Hidden"}
                    </button>
                    <button type="button" onClick={() => patch(p.id, { isFeatured: !p.isFeatured })} style={{ marginRight: 4 }}>
                      {p.isFeatured ? "★ Featured" : "Feature"}
                    </button>
                    <button type="button" onClick={() => patch(p.id, { isNewArrival: !p.isNewArrival })}>
                      {p.isNewArrival ? "New" : "Mark New"}
                    </button>
                  </td>
                  <td>
                    <Link href={`/admin/products/${p.id}/edit`} style={{ marginRight: 8, color: "#000", fontWeight: 700 }}>
                      Edit
                    </Link>
                    <button type="button" className="btn-danger" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
