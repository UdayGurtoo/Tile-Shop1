"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Item = {
  id: string;
  name?: string;
  title?: string;
  question?: string;
  slug?: string;
  isActive?: boolean;
  imageUrl?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  content?: string;
  answer?: string;
  discountText?: string | null;
  type?: string;
  subtitle?: string | null;
  sortOrder?: number;
  category?: string | null;
  status?: string;
  phone?: string | null;
  email?: string | null;
  message?: string;
  createdAt?: string;
  _count?: { products: number };
};

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "select" | "image";
  options?: { value: string; label: string }[];
};

export function EntityManager({
  title,
  endpoint,
  fields,
  nameKey = "name",
}: {
  title: string;
  endpoint: string;
  fields: Field[];
  nameKey?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(endpoint);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : data.items || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  function startEdit(item: Item) {
    setEditingId(item.id);
    const next: Record<string, unknown> = {};
    for (const f of fields) next[f.key] = (item as Record<string, unknown>)[f.key] ?? (f.type === "checkbox" ? false : "");
    setForm(next);
  }

  function reset() {
    setEditingId(null);
    const next: Record<string, unknown> = {};
    for (const f of fields) next[f.key] = f.type === "checkbox" ? true : "";
    setForm(next);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    reset();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>{title}</h1>
      <form onSubmit={save} className="admin-card form-grid">
        {fields.map((f) => (
          <label key={f.key} className={f.type === "textarea" || f.type === "image" ? "full" : undefined}>
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            ) : f.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={!!form[f.key]}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.checked }))}
              />
            ) : f.type === "select" ? (
              <select value={String(form[f.key] ?? "")} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}>
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "image" ? (
              <div>
                <input
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  placeholder="Image URL"
                />
                <ImageUploader
                  onUploaded={(files) => setForm((s) => ({ ...s, [f.key]: files[0]?.url }))}
                />
              </div>
            ) : (
              <input
                type={f.type || "text"}
                value={String(form[f.key] ?? "")}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
              />
            )}
          </label>
        ))}
        {error ? <p className="full" style={{ color: "#dc3545" }}>{error}</p> : null}
        <div className="full" style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button type="button" onClick={reset}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{(item as Record<string, unknown>)[nameKey] as string}</td>
                <td>{item.isActive === false ? "No" : item.status || "Yes"}</td>
                <td>
                  <button type="button" onClick={() => startEdit(item)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button type="button" className="btn-danger" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
