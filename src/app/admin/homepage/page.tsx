"use client";

import { useEffect, useState } from "react";

type Block = {
  id?: string;
  key: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export default function AdminHomepagePage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) => setBlocks(d.blocks || []));
  }, []);

  async function save() {
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
    setMessage(res.ok ? "Saved" : "Failed to save");
  }

  function update(index: number, key: keyof Block, value: string | number | boolean) {
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, [key]: value } : b)));
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Homepage Content</h1>
      {blocks.map((b, i) => (
        <div key={b.key} className="admin-card form-grid">
          <label>
            Key
            <input value={b.key} disabled />
          </label>
          <label>
            Sort
            <input type="number" value={b.sortOrder ?? 0} onChange={(e) => update(i, "sortOrder", Number(e.target.value))} />
          </label>
          <label className="full">
            Title
            <input value={b.title || ""} onChange={(e) => update(i, "title", e.target.value)} />
          </label>
          <label className="full">
            Subtitle
            <input value={b.subtitle || ""} onChange={(e) => update(i, "subtitle", e.target.value)} />
          </label>
          <label className="full">
            Body
            <textarea rows={3} value={b.body || ""} onChange={(e) => update(i, "body", e.target.value)} />
          </label>
        </div>
      ))}
      <button type="button" className="btn-primary" onClick={save}>
        Save Homepage
      </button>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
