"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "grid_view" },
    { label: "Mission Control", path: "/mission-control", icon: "monitoring" },
    { label: "Claims", path: "/claims", icon: "fact_check" },
    { label: "Workers", path: "/workers", icon: "group" },
    { label: "Treasury", path: "/treasury", icon: "account_balance" },
    { label: "Smart Contracts", path: "/smart-contract-status", icon: "code" },
    { label: "Oracle Logs", path: "/oracle-event-logs", icon: "terminal" },
    { label: "Liquidity Pool", path: "/liquidity-pool", icon: "currency_bitcoin" },
];

export default function Sidebar() {
    const pathname = usePathname();

    // Don't show sidebar on landing page
    if (pathname === "/") return null;

    return (
        <aside className="w-64 border-r border-[var(--card-border)] bg-[var(--background)] flex flex-col h-screen sticky top-0 font-mono text-sm z-50">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-[var(--card-border)] bg-[var(--background-secondary)]">
                <Link href="/" className="group flex items-center gap-3 relative w-40 h-8">
                    <Image
                        src="/ParaCipher.png"
                        alt="ParaCipher"
                        fill
                        className="object-contain object-left"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`
                flex items-center gap-3 px-4 py-3 border transition-all duration-300
                ${isActive
                                    ? "border-[var(--accent-success)] bg-[var(--accent-success)]/5 text-[var(--accent-success)]"
                                    : "border-transparent text-[var(--text-secondary)] hover:border-[var(--card-border)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]"
                                }
              `}
                        >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            <span className="uppercase tracking-wider text-xs">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-[var(--accent-success)] animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Status */}
            <div className="p-4 border-t border-[var(--card-border)] bg-[var(--background-secondary)] text-[10px] text-[var(--text-secondary)]">
                <div className="flex justify-between items-center mb-2">
                    <span>CONNECTION</span>
                    <span className="text-[var(--accent-success)]">SECURE</span>
                </div>
                <div className="w-full bg-[var(--card-border)] h-[1px]" />
                <div className="mt-2 font-mono">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                </div>
            </div>
        </aside>
    );
}
