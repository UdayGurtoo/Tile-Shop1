import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 80, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>404</h1>
      <p style={{ marginBottom: 24 }}>Page not found</p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </main>
  );
}
