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
    { path: "/system-overview", label: "System Overview", icon: "dashboard" },
    { path: "/mission-control", label: "Mission Control", icon: "radar" },
    { path: "/smart-contract-status", label: "Smart Contracts", icon: "code" },
    { path: "/oracle-event-logs", label: "Oracle Logs", icon: "article" },
    { path: "/liquidity-pool", label: "Liquidity Pool", icon: "water_drop" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--pop-yellow)] flex items-center justify-center">
              <span className="material-symbols-outlined text-black !text-[24px]">shield</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                ParaCipher
              </h1>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest">Mission Control</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`neo-nav-item w-full ${isActive ? "active" : ""}`}
              >
                <span className="material-symbols-outlined !text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 p-3 bg-[var(--background)]">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse"></span>
            <div>
              <p className="text-xs font-bold text-[var(--success)]">All Systems Operational</p>
              <p className="text-[10px] text-[var(--muted)]">Last checked: 2s ago</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
