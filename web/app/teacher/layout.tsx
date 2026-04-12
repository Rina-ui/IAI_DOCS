import TeacherSidebar from "@/components/teacher/Sidebar";
import RoleGuard from "@/components/RoleGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Espace Enseignant | IAI_DOCS",
    template: "%s | IAI_DOCS",
  },
  description: "Espace enseignant - Gestion des examens et validations",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["teacher", "admin"]}>
      <div className="bg-surface text-on-surface min-h-screen">
        <TeacherSidebar />
        <main className="ml-64 min-h-screen">
          <div className="pt-24 px-10 pb-12">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
