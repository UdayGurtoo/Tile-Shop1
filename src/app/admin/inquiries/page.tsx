"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [status, setStatus] = useState("");

  async function load(s = status) {
    const q = s ? `?status=${s}` : "";
    const res = await fetch(`/api/admin/inquiries${q}`);
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setInquiryStatus(id: string, next: string) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load(status);
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Inquiries</h1>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="SPAM">Spam</option>
        </select>
        <button type="button" className="btn-primary" onClick={() => load(status)}>
          Filter
        </button>
      </div>
      <div className="admin:card admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.phone}</td>
                <td>{i.email}</td>
                <td style={{ maxWidth: 260 }}>{i.message}</td>
                <td>{new Date(i.createdAt).toLocaleString()}</td>
                <td>{i.status}</td>
                <td>
                  <button type="button" onClick={() => setInquiryStatus(i.id, "IN_PROGRESS")} style={{ marginRight: 4 }}>
                    Progress
                  </button>
                  <button type="button" onClick={() => setInquiryStatus(i.id, "RESOLVED")}>
                    Resolve
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
