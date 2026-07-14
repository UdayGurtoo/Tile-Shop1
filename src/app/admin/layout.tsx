import { getServerSession } from "next-auth";
import { authOptions, isAdminRole } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/SessionProvider";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdminRole(session.user.role)) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <AdminNav name={session.user.name || "Admin"} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
