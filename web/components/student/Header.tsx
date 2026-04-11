import Link from "next/link";
import { Search, Bell, History } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 w-[calc(100%-16rem)] h-16 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl flex justify-between items-center px-8 shadow-[0_20px_40px_rgba(0,35,111,0.06)]">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            placeholder="Search academic records..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <button className="p-2 text-slate-500 hover:bg-surface-container-high rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-surface-container-high rounded-full transition-colors">
            <History className="w-5 h-5" />
          </button>
        </div>
        <button className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:opacity-80 transition-all">
          AI Assistant
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
          <img
            alt="User avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWUqlLcVAkYLEGm6QsnYbUEQ0ST47Yr-AKoO-KueY0-Hksss2rhDxjbwwghp50JVmiVEcQhC6sdVdVRsyu_b1ni_eVZ8_1QR-66SAybJLkvTEJekXbamsZhNDKZFNDA-I9cG_VG35XIqJLFcOJy3rO1aktFkN5z-rueDQZrJVwNfE-Z-kWarf-EKicC0QN0v996M61k32gIjio54nV3YqreJy8y0pLOhxf7uiT_gKfWLvfHBb_fLQ51EY00_LWLjMDqiRvtOiWGfA"
          />
        </div>
      </div>
    </header>
  );
}
