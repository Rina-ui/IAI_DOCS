import Sidebar from "@/components/student/Sidebar";
import Header from "@/components/student/Header";
import FloatingAI from "@/components/student/FloatingAI";
import RoleGuard from "@/components/RoleGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Tableau de bord | IAI_DOCS",
    template: "%s | IAI_DOCS",
  },
  description: "Espace d'apprentissage intelligent avec correction IA",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <div className="bg-surface text-on-surface min-h-screen">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <Header />
          <div className="pt-24 px-10 pb-12">{children}</div>
        </main>
        <FloatingAI />
      </div>
    </RoleGuard>
  );
}
