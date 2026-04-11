"use client";

import {
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tableau de bord",
      href: "/student",
      icon: LayoutDashboard,
    },
    {
      name: "Examens",
      href: "/student/exams",
      icon: GraduationCap,
    },
    {
      name: "Formations",
      href: "/student/training",
      icon: FileText,
    },
    {
      name: "Forum",
      href: "/student/forum",
      icon: Layers,
    },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-neutral border-r border-secondary/20 flex flex-col py-8 px-4 gap-2 z-50">
      {/* Branding */}
      <div className="mb-10 px-2 flex flex-col items-center text-center">
        <Image
          src="/images/logoIAI.png"
          alt="Logo IAI"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
          IAI_DOCS
        </h1>
        <div className="h-1 w-8 bg-primary my-2 rounded-full"></div>
        <p className="text-xs text-secondary font-medium tracking-tight">
          Atelier Académique
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/student" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold bg-surface ring-1 ring-secondary/20 shadow-sm"
                  : "text-secondary hover:text-on-surface hover:bg-surface/80"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-headline font-medium text-sm tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-secondary/20 pt-4">
        <button className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
