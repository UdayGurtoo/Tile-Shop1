import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, isAdminRole } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminRole(session.user.role)) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
