"use client";

import { Search, Bell, History, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-64 w-[calc(100%-16rem)] h-16 z-40 bg-surface/70 backdrop-blur-xl flex justify-between items-center px-8 border-b border-secondary/10">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60 w-5 h-5" />
          <input
            className="w-full bg-neutral border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-secondary/60 text-on-surface"
            placeholder="Rechercher..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-secondary hover:bg-neutral rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-secondary/20 rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-on-surface mb-3">Notifications</h3>
                <p className="text-sm text-secondary">Aucune nouvelle notification</p>
              </div>
            )}
          </div>
          <button className="p-2 text-secondary hover:bg-neutral rounded-full transition-colors">
            <History className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <User size={18} />
          </div>
          <div className="text-sm">
            <p className="font-bold text-on-surface">Étudiant</p>
            <p className="text-xs text-secondary">Licence</p>
          </div>
        </div>
      </div>
    </header>
  );
}
