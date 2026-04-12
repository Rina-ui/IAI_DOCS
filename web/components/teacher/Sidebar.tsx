"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  CheckSquare,
  MessageSquare,
  BookOpen,
  LogOut,
  GraduationCap,
} from "lucide-react";
import tokenService from "@/lib/tokenService";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/teacher" },
  { icon: FileText, label: "Examens", href: "/teacher/exams" },
  { icon: Upload, label: "Télécharger", href: "/teacher/exams/upload" },
  { icon: CheckSquare, label: "Validations", href: "/teacher/validations" },
  { icon: MessageSquare, label: "Forum", href: "/teacher/forum" },
  { icon: BookOpen, label: "Matières", href: "/teacher/subjects" },
];

export default function TeacherSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    tokenService.removeToken();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface border-r border-secondary/10 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary/10">
        <Link href="/teacher" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-tertiary rounded-xl flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-on-surface text-lg">IAI_DOCS</h1>
            <p className="text-xs text-secondary">Espace Enseignant</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-secondary hover:bg-neutral hover:text-on-surface"
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-secondary/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
