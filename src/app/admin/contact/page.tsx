"use client";

import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;
        const next: Record<string, string> = {};
        for (const [k, v] of Object.entries(d)) {
          if (typeof v === "string" || typeof v === "number") next[k] = String(v);
          else if (v == null) next[k] = "";
        }
        setForm(next);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };
    const res = await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMessage(res.ok ? "Contact details saved" : "Save failed");
  }

  const fields = [
    "businessName",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "phonePrimary",
    "phoneSecondary",
    "whatsapp",
    "email",
    "emailSecondary",
    "mapEmbedUrl",
    "latitude",
    "longitude",
    "openTime",
    "closeTime",
    "openDays",
    "facebookUrl",
    "instagramUrl",
    "youtubeUrl",
    "aboutTitle",
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Contact Details</h1>
      <form onSubmit={save} className="admin-card form-grid">
        {fields.map((key) => (
          <label key={key}>
            {key}
            <input value={form[key] || ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </label>
        ))}
        <label className="full">
          Legacy text
          <textarea rows={4} value={form.legacyText || ""} onChange={(e) => setForm((f) => ({ ...f, legacyText: e.target.value }))} />
        </label>
        <label className="full">
          About HTML
          <textarea rows={4} value={form.aboutHtml || ""} onChange={(e) => setForm((f) => ({ ...f, aboutHtml: e.target.value }))} />
        </label>
        <div className="full">
          <button type="submit" className="btn-primary">
            Save
          </button>
          {message ? <span style={{ marginLeft: 12 }}>{message}</span> : null}
        </div>
      </form>
    </div>
  );
}
