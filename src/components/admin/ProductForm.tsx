"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";

type Opt = { id: string; name: string };

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Opt[]>([]);
  const [brands, setBrands] = useState<Opt[]>([]);
  const [images, setImages] = useState<{ url: string; publicId?: string; thumbnailUrl?: string; id?: string }[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    shortDescription: "",
    material: "",
    finish: "",
    color: "",
    dimensions: "",
    size: "",
    unit: "piece",
    mrp: "",
    price: "",
    discountPercent: "",
    stockQuantity: "0",
    categoryId: "",
    brandId: "",
    collection: "",
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    Promise.all([fetch("/api/admin/categories").then((r) => r.json()), fetch("/api/admin/brands").then((r) => r.json())]).then(
      ([cats, brs]) => {
        setCategories(cats);
        setBrands(brs);
      }
    );
    if (productId) {
      fetch(`/api/admin/products/${productId}`)
        .then((r) => r.json())
        .then((p) => {
          setForm({
            name: p.name || "",
            sku: p.sku || "",
            description: p.description || "",
            shortDescription: p.shortDescription || "",
            material: p.material || "",
            finish: p.finish || "",
            color: p.color || "",
            dimensions: p.dimensions || "",
            size: p.size || "",
            unit: p.unit || "piece",
            mrp: String(p.mrp ?? ""),
            price: String(p.price ?? ""),
            discountPercent: p.discountPercent != null ? String(p.discountPercent) : "",
            stockQuantity: String(p.stockQuantity ?? 0),
            categoryId: p.categoryId || "",
            brandId: p.brandId || "",
            collection: p.collection || "",
            isPublished: !!p.isPublished,
            isFeatured: !!p.isFeatured,
            isNewArrival: !!p.isNewArrival,
            seoTitle: p.seoTitle || "",
            seoDescription: p.seoDescription || "",
          });
          setImages(p.images || []);
        });
    }
  }, [productId]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      mrp: Number(form.mrp),
      price: Number(form.price),
      discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId || null,
      brandId: form.brandId || null,
      images: productId
        ? images.filter((i) => !i.id).map((i) => ({ url: i.url, publicId: i.publicId, thumbnailUrl: i.thumbnailUrl }))
        : images,
    };

    const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
      method: productId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function deleteImage(imageId: string) {
    if (!productId || !imageId) return;
    await fetch(`/api/admin/products/${productId}/images?imageId=${imageId}`, { method: "DELETE" });
    setImages((imgs) => imgs.filter((i) => i.id !== imageId));
  }

  async function moveImage(index: number, dir: -1 | 1) {
    if (!productId) {
      setImages((imgs) => {
        const next = [...imgs];
        const j = index + dir;
        if (j < 0 || j >= next.length) return imgs;
        [next[index], next[j]] = [next[j], next[index]];
        return next;
      });
      return;
    }
    const next = [...images];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setImages(next);
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: next.map((i) => i.id).filter(Boolean) }),
    });
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/products" className="back-btn">
          ← Products
        </Link>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>{productId ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={onSubmit} className="admin-card form-grid">
        <label>
          Name
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label>
          SKU
          <input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
        </label>
        <label>
          MRP
          <input required type="number" value={form.mrp} onChange={(e) => set("mrp", e.target.value)} />
        </label>
        <label>
          Offer Price
          <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </label>
        <label>
          Discount %
          <input type="number" value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} />
        </label>
        <label>
          Stock
          <input type="number" value={form.stockQuantity} onChange={(e) => set("stockQuantity", e.target.value)} />
        </label>
        <label>
          Category
          <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Brand
          <select value={form.brandId} onChange={(e) => set("brandId", e.target.value)}>
            <option value="">—</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Material
          <input value={form.material} onChange={(e) => set("material", e.target.value)} />
        </label>
        <label>
          Finish
          <input value={form.finish} onChange={(e) => set("finish", e.target.value)} />
        </label>
        <label>
          Color
          <input value={form.color} onChange={(e) => set("color", e.target.value)} />
        </label>
        <label>
          Size
          <input value={form.size} onChange={(e) => set("size", e.target.value)} />
        </label>
        <label>
          Dimensions
          <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
        </label>
        <label>
          Unit
          <input value={form.unit} onChange={(e) => set("unit", e.target.value)} />
        </label>
        <label>
          Collection
          <input value={form.collection} onChange={(e) => set("collection", e.target.value)} />
        </label>
        <label className="full">
          Short description
          <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
        </label>
        <label className="full">
          Description
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <label>
          SEO Title
          <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
        </label>
        <label>
          SEO Description
          <input value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
        </label>
        <label>
          <span>Published</span>
          <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
        </label>
        <label>
          <span>Featured</span>
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
        </label>
        <label>
          <span>New Arrival</span>
          <input type="checkbox" checked={form.isNewArrival} onChange={(e) => set("isNewArrival", e.target.checked)} />
        </label>
        <div className="full">
          <h3 style={{ marginBottom: 8 }}>Images</h3>
          <ImageUploader multiple onUploaded={(files) => setImages((imgs) => [...imgs, ...files])} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            {images.map((img, i) => (
              <div key={img.id || img.url + i} style={{ border: "1px solid #eee", padding: 8, width: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.thumbnailUrl || img.url} alt="" style={{ width: "100%", height: 80, objectFit: "cover" }} />
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  <button type="button" onClick={() => moveImage(i, -1)}>
                    ↑
                  </button>
                  <button type="button" onClick={() => moveImage(i, 1)}>
                    ↓
                  </button>
                  {img.id ? (
                    <button type="button" onClick={() => deleteImage(img.id!)}>
                      ✕
                    </button>
                  ) : (
                    <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {error ? (
          <p className="full" style={{ color: "#dc3545" }}>
            {error}
          </p>
        ) : null}
        <div className="full">
          <button type="submit" className="btn-primary">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
