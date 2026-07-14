import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminRole(session.user.role)) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  // Auto-sync session storeId to the latest active database store
  const activeStores = await prisma.store.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  if (activeStores[0]) {
    session.user.storeId = activeStores[0].id;
  } else if (!session.user.storeId) {
    session.user.storeId = await getStoreId();
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
