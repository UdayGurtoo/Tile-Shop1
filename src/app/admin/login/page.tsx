"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", padding: 20 }}>
      <form onSubmit={onSubmit} style={{ background: "#fff", padding: 40, width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 16, borderRadius: 12 }}>
        <h1 style={{ fontSize: 24, textAlign: "center", fontWeight: 700, margin: 0 }}>Admin Login</h1>
        <p style={{ textAlign: "center", color: "#666", fontSize: 13, margin: 0 }}>Mohit Tiles & Granites</p>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px 14px", borderRadius: 8, fontSize: 12, color: "#475569", textAlign: "center" }}>
          <strong>🔑 Admin Credentials:</strong><br />
          Email: <code style={{ color: "#0f172a" }}>admin@mohit.com</code><br />
          Password: <code style={{ color: "#0f172a" }}>StrongPassword@123</code>
        </div>
        <input name="email" type="email" required defaultValue="admin@mohit.com" placeholder="Email" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }} />
        <input name="password" type="password" required defaultValue="StrongPassword@123" placeholder="Password" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }} />
        {error ? <p style={{ color: "#dc3545", fontSize: 13, textAlign: "center", margin: 0 }}>{error}</p> : null}
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 14, fontSize: 15, fontWeight: 600 }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
