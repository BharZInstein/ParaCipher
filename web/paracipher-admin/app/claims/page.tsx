"use client";

import { useState } from "react";

interface Claim {
    id: string;
    wallet: string;
    policyId: string;
    description: string;
    amount: string;
    status: "pending" | "approved" | "rejected";
    filedAt: string;
    location: string;
}

const mockClaims: Claim[] = [
    { id: "CLM-8821", wallet: "0x7a23...4F2b", policyId: "POL-9921", description: "Two-wheeler accident on MG Road", amount: "50,000 MATIC", status: "pending", filedAt: "2 hours ago", location: "Mumbai" },
    { id: "CLM-8820", wallet: "0x9f12...8A3c", policyId: "POL-9920", description: "Bike skid during heavy rain", amount: "50,000 MATIC", status: "pending", filedAt: "5 hours ago", location: "Bangalore" },
    { id: "CLM-8819", wallet: "0x3c88...1D9e", policyId: "POL-9918", description: "Collision at junction", amount: "50,000 MATIC", status: "approved", filedAt: "1 day ago", location: "Delhi" },
    { id: "CLM-8818", wallet: "0x2b44...7E1f", policyId: "POL-9915", description: "Hit by auto-rickshaw", amount: "50,000 MATIC", status: "rejected", filedAt: "2 days ago", location: "Chennai" },
];

export default function Claims() {
    const [claims, setClaims] = useState<Claim[]>(mockClaims);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const handleApprove = (claimId: string) => {
        setClaims(claims.map(c => c.id === claimId ? { ...c, status: "approved" } : c));
        setSelectedClaim(null);
    };

    const handleReject = (claimId: string) => {
        setClaims(claims.map(c => c.id === claimId ? { ...c, status: "rejected" } : c));
        setSelectedClaim(null);
    };

    const filteredClaims = filter === "all" ? claims : claims.filter(c => c.status === filter);
    const pendingCount = claims.filter(c => c.status === "pending").length;

    return (
        <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
            <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">CLAIMS_MANAGEMENT</h1>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">APPROVE / REJECT WORKER CLAIMS</p>
                </div>
                <div className="flex items-center gap-4">
                    {pendingCount > 0 && (
                        <span className="text-xs text-[var(--accent-alert)] border border-[var(--accent-alert)] px-3 py-1 bg-[var(--accent-alert)]/10 animate-pulse">
                            {pendingCount} PENDING REVIEW
                        </span>
                    )}
                </div>
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Claims List */}
                <section className="lg:col-span-2 tech-border p-0 bg-[var(--background)]">
                    <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)] flex justify-between items-center">
                        <h3 className="text-xs font-bold tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-[var(--accent-primary)]" />
                            CLAIM_QUEUE
                        </h3>
                        <div className="flex gap-2">
                            {(["all", "pending", "approved", "rejected"] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-[10px] px-3 py-1 border uppercase ${filter === f ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--background)]' : 'border-[var(--card-border)] text-[var(--text-secondary)]'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--card-border)]">
                        {filteredClaims.map(claim => (
                            <div
                                key={claim.id}
                                onClick={() => setSelectedClaim(claim)}
                                className={`p-4 cursor-pointer hover:bg-[var(--card-hover)] transition-colors ${selectedClaim?.id === claim.id ? 'bg-[var(--card-hover)]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-bold text-[var(--accent-primary)]">{claim.id}</span>
                                        <span className="text-[10px] text-[var(--text-secondary)] ml-2">{claim.filedAt}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 uppercase ${claim.status === 'pending' ? 'bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)]' :
                                            claim.status === 'approved' ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)]' :
                                                'bg-[var(--accent-alert)]/20 text-[var(--accent-alert)]'
                                        }`}>
                                        {claim.status}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--foreground)] mb-2">{claim.description}</p>
                                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                                    <span>WALLET: {claim.wallet}</span>
                                    <span>AMOUNT: {claim.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Claim Detail Panel */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="tech-border p-6 bg-[var(--background-secondary)]">
                        <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2">CLAIM_DETAILS</h3>

                        {selectedClaim ? (
                            <div className="space-y-4 text-xs">
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">CLAIM_ID</label>
                                    <p className="text-[var(--accent-primary)] font-bold">{selectedClaim.id}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">WALLET_ADDRESS</label>
                                    <p className="text-[var(--foreground)] font-mono">{selectedClaim.wallet}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">POLICY_ID</label>
                                    <p className="text-[var(--foreground)]">{selectedClaim.policyId}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">DESCRIPTION</label>
                                    <p className="text-[var(--foreground)]">{selectedClaim.description}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">LOCATION</label>
                                    <p className="text-[var(--foreground)]">{selectedClaim.location}</p>
                                </div>
                                <div>
                                    <label className="text-[var(--text-secondary)] block mb-1">PAYOUT_AMOUNT</label>
                                    <p className="text-[var(--accent-success)] font-bold text-lg">{selectedClaim.amount}</p>
                                </div>

                                {selectedClaim.status === 'pending' && (
                                    <div className="pt-4 border-t border-[var(--card-border)] space-y-2">
                                        <button
                                            onClick={() => handleApprove(selectedClaim.id)}
                                            className="w-full btn-tech h-10 text-xs bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)] hover:bg-[var(--accent-success)] hover:text-white"
                                        >
                                            APPROVE_CLAIM
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedClaim.id)}
                                            className="w-full btn-tech h-10 text-xs bg-[var(--accent-alert)]/10 text-[var(--accent-alert)] border-[var(--accent-alert)] hover:bg-[var(--accent-alert)] hover:text-white"
                                        >
                                            REJECT_CLAIM
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[var(--text-secondary)] text-xs">Select a claim to view details</p>
                        )}
                    </div>

                    <div className="tech-border p-4 bg-[var(--background)]">
                        <h3 className="text-xs font-bold tracking-widest mb-3">QUICK_STATS</h3>
                        <div className="space-y-2 text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">PENDING:</span>
                                <span className="text-[var(--accent-secondary)]">{claims.filter(c => c.status === 'pending').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">APPROVED (24H):</span>
                                <span className="text-[var(--accent-success)]">{claims.filter(c => c.status === 'approved').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">REJECTED (24H):</span>
                                <span className="text-[var(--accent-alert)]">{claims.filter(c => c.status === 'rejected').length}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
