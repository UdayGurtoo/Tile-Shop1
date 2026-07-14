"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
    };
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage(data.message || "Sent!");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ marginBottom: 8 }}>Send an Enquiry</h2>
      <input name="name" required placeholder="Your name" style={{ padding: 12, border: "1px solid #ddd" }} />
      <input name="phone" placeholder="Phone" style={{ padding: 12, border: "1px solid #ddd" }} />
      <input name="email" type="email" placeholder="Email" style={{ padding: 12, border: "1px solid #ddd" }} />
      <input name="subject" placeholder="Subject" style={{ padding: 12, border: "1px solid #ddd" }} />
      <textarea name="message" required rows={5} placeholder="Message" style={{ padding: 12, border: "1px solid #ddd", fontFamily: "inherit" }} />
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Submit"}
      </button>
      {status === "ok" || status === "error" ? (
        <p style={{ color: status === "ok" ? "#28a745" : "#dc3545" }}>{message}</p>
      ) : null}
    </form>
  );
}
