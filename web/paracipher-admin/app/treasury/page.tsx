"use client";

import { useState } from "react";

interface Transaction {
    id: string;
    type: "deposit" | "withdrawal" | "payout";
    amount: string;
    wallet: string;
    timestamp: string;
    txHash: string;
}

const mockTransactions: Transaction[] = [
    { id: "TX-001", type: "deposit", amount: "+100,000 MATIC", wallet: "0xADMIN...1234", timestamp: "2 hours ago", txHash: "0x8a2f...4c1b" },
    { id: "TX-002", type: "payout", amount: "-50,000 MATIC", wallet: "0x7a23...4F2b", timestamp: "5 hours ago", txHash: "0x3d9e...7a2c" },
    { id: "TX-003", type: "payout", amount: "-50,000 MATIC", wallet: "0x9f12...8A3c", timestamp: "1 day ago", txHash: "0x1f4b...9e3d" },
    { id: "TX-004", type: "withdrawal", amount: "-25,000 MATIC", wallet: "0xADMIN...1234", timestamp: "2 days ago", txHash: "0x6c8a...2f1e" },
];

export default function Treasury() {
    const [fundAmount, setFundAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFund = () => {
        if (!fundAmount) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setFundAmount("");
            alert(`Funded ${fundAmount} MATIC successfully!`);
        }, 2000);
    };

    const handleWithdraw = () => {
        if (!withdrawAmount) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setWithdrawAmount("");
            alert(`Withdrew ${withdrawAmount} MATIC successfully!`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
            <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">TREASURY_CONTROL</h1>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">FUND CONTRACTS & WITHDRAW PREMIUMS</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--accent-primary)] border border-[var(--accent-primary)] px-3 py-1 bg-[var(--accent-primary)]/10">
                        POLYGON MAINNET
                    </span>
                </div>
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance Overview */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="tech-border p-6 bg-[var(--background)]">
                        <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">CLAIMPAYOUT_BALANCE</span>
                        <div className="mt-2">
                            <p className="text-3xl font-bold text-[var(--accent-success)]">4,250,000</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">MATIC</p>
                        </div>
                        <div className="mt-4 text-[10px] text-[var(--text-secondary)]">
                            <p>CONTRACT: 0x9f...1c8d</p>
                            <p className="text-[var(--accent-success)]">SUFFICIENT FOR ~85 PAYOUTS</p>
                        </div>
                    </div>

                    <div className="tech-border p-6 bg-[var(--background)]">
                        <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">PREMIUM_POOL</span>
                        <div className="mt-2">
                            <p className="text-3xl font-bold text-[var(--accent-primary)]">892,500</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">MATIC</p>
                        </div>
                        <div className="mt-4 text-[10px] text-[var(--text-secondary)]">
                            <p>CONTRACT: 0x73...4a2b</p>
                            <p className="text-[var(--accent-secondary)]">WITHDRAWABLE BY OWNER</p>
                        </div>
                    </div>

                    <div className="tech-border p-6 bg-[var(--background)]">
                        <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">AAVE_YIELD_EARNED</span>
                        <div className="mt-2">
                            <p className="text-3xl font-bold text-[var(--foreground)]">42,850</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">MATIC (12.5% APY)</p>
                        </div>
                        <div className="mt-4 text-[10px] text-[var(--text-secondary)]">
                            <p>STRATEGY: AAVE_V3_LENDING</p>
                            <p className="text-[var(--accent-success)]">AUTO-COMPOUNDING</p>
                        </div>
                    </div>
                </div>

                {/* Fund Contract */}
                <section className="tech-border p-6 bg-[var(--background-secondary)]">
                    <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[var(--accent-success)]" />
                        FUND_CONTRACT
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] mb-4">
                        Deposit MATIC to ClaimPayout.sol for worker payouts.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] block mb-1">AMOUNT (MATIC)</label>
                            <input
                                type="number"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                placeholder="100000"
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] focus:border-[var(--accent-success)] outline-none"
                            />
                        </div>
                        <button
                            onClick={handleFund}
                            disabled={isProcessing || !fundAmount}
                            className={`w-full btn-tech h-12 text-xs bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)] hover:bg-[var(--accent-success)] hover:text-white ${isProcessing ? 'opacity-50' : ''}`}
                        >
                            {isProcessing ? 'PROCESSING...' : 'FUND_CONTRACT()'}
                        </button>
                    </div>
                </section>

                {/* Withdraw Premiums */}
                <section className="tech-border p-6 bg-[var(--background-secondary)]">
                    <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[var(--accent-secondary)]" />
                        WITHDRAW_PREMIUMS
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] mb-4">
                        Withdraw collected premiums from InsurancePolicy.sol.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] block mb-1">AMOUNT (MATIC)</label>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="50000"
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] focus:border-[var(--accent-secondary)] outline-none"
                            />
                        </div>
                        <button
                            onClick={handleWithdraw}
                            disabled={isProcessing || !withdrawAmount}
                            className={`w-full btn-tech h-12 text-xs border-[var(--accent-secondary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-white ${isProcessing ? 'opacity-50' : ''}`}
                        >
                            {isProcessing ? 'PROCESSING...' : 'WITHDRAW_PREMIUMS()'}
                        </button>
                    </div>
                </section>

                {/* Transaction History */}
                <section className="tech-border p-0 bg-[var(--background)]">
                    <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)]">
                        <h3 className="text-xs font-bold tracking-widest">RECENT_TRANSACTIONS</h3>
                    </div>
                    <div className="divide-y divide-[var(--card-border)] max-h-[300px] overflow-y-auto">
                        {mockTransactions.map(tx => (
                            <div key={tx.id} className="p-4 hover:bg-[var(--card-hover)]">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold ${tx.type === 'deposit' ? 'text-[var(--accent-success)]' :
                                            tx.type === 'payout' ? 'text-[var(--accent-alert)]' : 'text-[var(--accent-secondary)]'
                                        }`}>
                                        {tx.amount}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-secondary)]">{tx.timestamp}</span>
                                </div>
                                <div className="text-[10px] text-[var(--text-secondary)] space-y-0.5">
                                    <p>TYPE: {tx.type.toUpperCase()}</p>
                                    <p>TO: {tx.wallet}</p>
                                    <p className="text-[var(--accent-primary)]">TX: {tx.txHash}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
