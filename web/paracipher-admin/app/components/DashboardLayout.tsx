"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: "/system-overview", label: "System Overview", icon: "📊" },
    { path: "/smart-contract-status", label: "Smart Contract Status", icon: "📜" },
    { path: "/oracle-event-logs", label: "Oracle & Event Logs", icon: "🔮" },
    { path: "/liquidity-pool", label: "Liquidity Pool", icon: "💧" },
    { path: "/mission-control", label: "Mission Control", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="text-[var(--accent)]">Para</span>Cipher
              </h1>
              <p className="text-xs text-[var(--muted)]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

