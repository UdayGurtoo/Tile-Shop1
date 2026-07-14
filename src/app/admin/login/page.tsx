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
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
      <form onSubmit={onSubmit} style={{ background: "#fff", padding: 40, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: 22, textAlign: "center" }}>Admin Login</h1>
        <p style={{ textAlign: "center", color: "#666", fontSize: 13 }}>Mohit Tiles & Granites</p>
        <input name="email" type="email" required placeholder="Email" style={{ padding: 12, border: "1px solid #ddd" }} />
        <input name="password" type="password" required placeholder="Password" style={{ padding: 12, border: "1px solid #ddd" }} />
        {error ? <p style={{ color: "#dc3545", fontSize: 13 }}>{error}</p> : null}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
