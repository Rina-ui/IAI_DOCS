import AdminSidebar from "@/components/admin/Sidebar";
import RoleGuard from "@/components/RoleGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Espace Admin | IAI_DOCS",
    template: "%s | IAI_DOCS",
  },
  description: "Espace administrateur - Gestion complète du système",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="bg-surface text-on-surface min-h-screen">
        <AdminSidebar />
        <main className="ml-64 min-h-screen">
          <div className="pt-24 px-10 pb-12">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
