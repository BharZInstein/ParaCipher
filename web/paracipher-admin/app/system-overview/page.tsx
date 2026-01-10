"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function SystemOverview() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "All">("30d");

  // Mock chart data for 30 days
  const chartData = [3.2, 3.4, 3.35, 3.5, 3.48, 3.62, 3.58, 3.72, 3.68, 3.78, 3.85, 3.82, 3.88, 3.92, 3.95, 3.88, 3.92, 3.96, 3.94, 3.98, 3.92, 3.95, 3.90, 3.93, 3.88, 3.94, 3.97, 4.0, 3.96, 4.25];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--background)] relative">
        {/* Background Grid */}
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="max-w-[1800px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">System Overview</h1>
                <p className="text-[var(--muted)]">Real-time protocol metrics, oracle status, and liquidity health</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                <span className="text-sm font-medium text-[var(--success)]">SYSTEM OPERATIONAL</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* TVL Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--success)] font-medium">+5.4% ↗</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">TVL</p>
                <p className="text-xs text-[var(--muted)] mb-2">USDC POOL</p>
                <p className="text-3xl font-bold">$4.25M</p>
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">Total Value Locked</p>
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)] rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            {/* Policies Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h69.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H77.25m0 0h-4.5m4.5 0v-3.75c0-.621-.504-1.125-1.125-1.125h-4.5c-.621 0-1.125.504-1.125 1.125v3.75m6-3v6m-3-3h3m-3 3v6m-3-3h3" />
                  </svg>
                </div>
                <span className="text-sm text-[#a855f7] font-medium">+12.0% ↗</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">POLICIES</p>
                <p className="text-xs text-[var(--muted)] mb-2">ACTIVE</p>
                <p className="text-3xl font-bold">12,403</p>
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">Active Coverage Plans</p>
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[#a855f7] rounded-full" style={{ width: "78%" }} />
              </div>
            </div>

            {/* Payouts Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--warning)] font-medium">+2.1% ↗</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">PAYOUTS</p>
                <p className="text-xs text-[var(--muted)] mb-2">LAST 24H</p>
                <p className="text-3xl font-bold">$1,250</p>
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">Total Claims Paid</p>
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--warning)] rounded-full" style={{ width: "45%" }} />
              </div>
            </div>

            {/* Ratio Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--danger)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--danger)] font-medium">-0.5% ↘</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">RATIO</p>
                <p className="text-xs text-[var(--muted)] mb-2">GLOBAL</p>
                <p className="text-3xl font-bold">4.2%</p>
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">Claims to Premium Ratio</p>
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--danger)] rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liquidity Pool Stability Chart */}
            <div className="lg:col-span-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Liquidity Pool Stability</h2>
                  <p className="text-sm text-[var(--muted)]">USDC Collateral Pool (30D)</p>
                </div>
                <div className="flex gap-2">
                  {(["24h", "7d", "30d", "All"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeframe === tf
                          ? "bg-[var(--accent)] text-[var(--background)]"
                          : "bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Line Chart */}
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y * 2}
                      x2="800"
                      y2={y * 2}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  
                  {/* Chart Line */}
                  <polyline
                    points={chartData.map((value, i) => {
                      const x = (i / (chartData.length - 1)) * 800;
                      const y = 200 - ((value - 3.0) / 1.5) * 200;
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                      <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fill */}
                  <polygon
                    points={`0,200 ${chartData.map((value, i) => {
                      const x = (i / (chartData.length - 1)) * 800;
                      const y = 200 - ((value - 3.0) / 1.5) * 200;
                      return `${x},${y}`;
                    }).join(" ")} 800,200`}
                    fill="url(#gradient)"
                    opacity="0.2"
                  />
                </svg>
                
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[var(--muted)] px-2">
                  <span>$5M</span>
                  <span>$4M</span>
                  <span>$3M</span>
                </div>
              </div>
            </div>

            {/* Protocol Health & Oracle Network */}
            <div className="space-y-6">
              {/* Protocol Health */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Protocol Health</h2>
                  <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">98.9%</p>
                <p className="text-sm text-[var(--success)] font-medium mb-4">Optimal</p>
                <p className="text-sm text-[var(--muted)] mb-4">Solvency ratio is well above the minimum threshold.</p>
                <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[var(--success)] rounded-full" style={{ width: "98.9%" }} />
                </div>
                <p className="text-xs text-[var(--muted)] text-right">UPDATED: 2 MINS AGO</p>
              </div>

              {/* Oracle Network */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <h2 className="text-lg font-bold mb-4">Oracle Network</h2>
                <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Chainlink Weather</p>
                    <p className="text-sm text-[var(--muted)]">Jakarta, ID</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                    <span className="text-sm text-[var(--success)] font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

