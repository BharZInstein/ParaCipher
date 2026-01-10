"use client";

import { useState } from "react";

interface Worker {
    wallet: string;
    safetyScore: number;
    safeDays: number;
    totalClaims: number;
    discount: number;
    status: "active" | "inactive";
    lastActive: string;
    region: string;
}

const mockWorkers: Worker[] = [
    { wallet: "0x7a23...4F2b", safetyScore: 120, safeDays: 24, totalClaims: 1, discount: 10, status: "active", lastActive: "2 min ago", region: "Mumbai" },
    { wallet: "0x9f12...8A3c", safetyScore: 105, safeDays: 15, totalClaims: 0, discount: 0, status: "active", lastActive: "5 min ago", region: "Bangalore" },
    { wallet: "0x3c88...1D9e", safetyScore: 85, safeDays: 8, totalClaims: 2, discount: 0, status: "active", lastActive: "1 hour ago", region: "Delhi" },
    { wallet: "0x2b44...7E1f", safetyScore: 150, safeDays: 45, totalClaims: 0, discount: 20, status: "active", lastActive: "10 min ago", region: "Chennai" },
    { wallet: "0x5e99...2C7a", safetyScore: 70, safeDays: 3, totalClaims: 3, discount: -10, status: "inactive", lastActive: "3 days ago", region: "Hyderabad" },
];

export default function Workers() {
    const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddSafeDay = (wallet: string) => {
        setWorkers(workers.map(w => {
            if (w.wallet === wallet) {
                const newScore = w.safetyScore + 5;
                const newSafeDays = w.safeDays + 1;
                let newDiscount = w.discount;
                if (newScore >= 150) newDiscount = 20;
                else if (newScore >= 120) newDiscount = 10;
                return { ...w, safetyScore: newScore, safeDays: newSafeDays, discount: newDiscount };
            }
            return w;
        }));
    };

    const filteredWorkers = workers.filter(w =>
        w.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getScoreColor = (score: number) => {
        if (score >= 120) return "text-[var(--accent-success)]";
        if (score >= 100) return "text-[var(--foreground)]";
        return "text-[var(--accent-alert)]";
    };

    return (
        <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
            <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">WORKER_MANAGEMENT</h1>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">REPUTATION & SAFETY SCORE TRACKING</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--accent-success)] border border-[var(--accent-success)] px-3 py-1 bg-[var(--accent-success)]/10">
                        {workers.filter(w => w.status === 'active').length} ACTIVE WORKERS
                    </span>
                </div>
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workers List */}
                <section className="lg:col-span-2 tech-border p-0 bg-[var(--background)]">
                    <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)] flex justify-between items-center gap-4">
                        <h3 className="text-xs font-bold tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-[var(--accent-primary)]" />
                            REGISTERED_WALLETS
                        </h3>
                        <div className="flex-1 max-w-xs relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]">&gt;</span>
                            <input
                                type="text"
                                placeholder="Search wallet or region..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] p-2 pl-8 text-xs text-[var(--foreground)] focus:border-[var(--accent-primary)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[var(--card-border)] text-[var(--text-secondary)]">
                                    <th className="p-4 font-normal">WALLET</th>
                                    <th className="p-4 font-normal">SCORE</th>
                                    <th className="p-4 font-normal">SAFE_DAYS</th>
                                    <th className="p-4 font-normal">CLAIMS</th>
                                    <th className="p-4 font-normal">DISCOUNT</th>
                                    <th className="p-4 font-normal">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--card-border)]">
                                {filteredWorkers.map(worker => (
                                    <tr
                                        key={worker.wallet}
                                        onClick={() => setSelectedWorker(worker)}
                                        className={`hover:bg-[var(--card-hover)] cursor-pointer ${selectedWorker?.wallet === worker.wallet ? 'bg-[var(--card-hover)]' : ''}`}
                                    >
                                        <td className="p-4 font-mono text-[var(--accent-primary)]">{worker.wallet}</td>
                                        <td className={`p-4 font-bold ${getScoreColor(worker.safetyScore)}`}>{worker.safetyScore}</td>
                                        <td className="p-4">{worker.safeDays}</td>
                                        <td className="p-4">{worker.totalClaims}</td>
                                        <td className="p-4">
                                            <span className={worker.discount > 0 ? 'text-[var(--accent-success)]' : worker.discount < 0 ? 'text-[var(--accent-alert)]' : ''}>
                                                {worker.discount > 0 ? `${worker.discount}% OFF` : worker.discount < 0 ? `${Math.abs(worker.discount)}% SURGE` : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAddSafeDay(worker.wallet); }}
                                                className="text-[10px] px-2 py-1 border border-[var(--accent-success)] text-[var(--accent-success)] hover:bg-[var(--accent-success)] hover:text-white transition-colors"
                                            >
                                                +SAFE_DAY
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Worker Detail Panel */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="tech-border p-6 bg-[var(--background-secondary)]">
                        <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2">WORKER_PROFILE</h3>

                        {selectedWorker ? (
                            <div className="space-y-4 text-xs">
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">WALLET_ADDRESS</label>
                                    <p className="text-[var(--accent-primary)] font-mono font-bold">{selectedWorker.wallet}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">REGION</label>
                                    <p className="text-[var(--foreground)]">{selectedWorker.region}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">STATUS</label>
                                    <span className={`px-2 py-0.5 text-[10px] ${selectedWorker.status === 'active' ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)]' : 'bg-[var(--accent-alert)]/20 text-[var(--accent-alert)]'}`}>
                                        {selectedWorker.status.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">LAST_ACTIVE</label>
                                    <p className="text-[var(--foreground)]">{selectedWorker.lastActive}</p>
                                </div>

                                <div className="pt-4 border-t border-[var(--card-border)]">
                                    <label className="text-[var(--text-secondary)] block mb-2">SAFETY_SCORE</label>
                                    <div className="flex items-end gap-2">
                                        <span className={`text-3xl font-bold ${getScoreColor(selectedWorker.safetyScore)}`}>
                                            {selectedWorker.safetyScore}
                                        </span>
                                        <span className="text-[var(--text-secondary)] mb-1">/ 200</span>
                                    </div>
                                    <div className="mt-2 h-2 bg-[var(--card-border)]">
                                        <div
                                            className={`h-full transition-all ${selectedWorker.safetyScore >= 120 ? 'bg-[var(--accent-success)]' : selectedWorker.safetyScore >= 100 ? 'bg-[var(--foreground)]' : 'bg-[var(--accent-alert)]'}`}
                                            style={{ width: `${Math.min(100, (selectedWorker.safetyScore / 200) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[var(--card-border)] grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-lg font-bold text-[var(--foreground)]">{selectedWorker.safeDays}</p>
                                        <p className="text-[9px] text-[var(--text-secondary)]">SAFE_DAYS</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-[var(--accent-alert)]">{selectedWorker.totalClaims}</p>
                                        <p className="text-[9px] text-[var(--text-secondary)]">CLAIMS</p>
                                    </div>
                                    <div>
                                        <p className={`text-lg font-bold ${selectedWorker.discount > 0 ? 'text-[var(--accent-success)]' : 'text-[var(--foreground)]'}`}>
                                            {selectedWorker.discount}%
                                        </p>
                                        <p className="text-[9px] text-[var(--text-secondary)]">DISCOUNT</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[var(--text-secondary)] text-xs">Select a worker to view profile</p>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}
