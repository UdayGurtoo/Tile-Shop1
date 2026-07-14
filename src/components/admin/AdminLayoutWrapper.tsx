"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Session } from "next-auth";
import AdminShell from "./AdminShell";

export default function AdminLayoutWrapper({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && !session) {
      router.replace("/admin/login");
    }
  }, [isLogin, session, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Checking session…
      </div>
    );
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
