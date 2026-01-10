"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function LiquidityPool() {
  const [timeframe, setTimeframe] = useState<"30D" | "90D" | "1Y">("30D");

  // Mock chart data
  const growthData = [3.0, 3.2, 3.15, 3.3, 3.28, 3.42, 3.38, 3.52, 3.48, 3.58, 3.65, 3.62, 3.68, 3.72, 3.75, 3.68, 3.72, 3.76, 3.74, 3.78, 3.72, 3.75, 3.70, 3.73, 3.68, 3.74, 3.77, 3.80, 3.76, 4.25];
  const composition = { usdc: 65, usdt: 35 };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--background)] relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="max-w-[1800px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">Liquidity Pool Overview</h1>
                </div>
                <p className="text-[var(--muted)]">Real-time protocol health & parametric underwriting performance</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  <span className="text-sm text-[var(--success)] font-medium">SYSTEM ONLINE</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm text-[var(--accent)] font-medium">POWERED BY DEFI</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* TVL Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">TOTAL VALUE LOCKED</p>
                  <p className="text-3xl font-bold">$4,250,000</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted)]">Progress (30d)</span>
                  <span className="text-sm text-[var(--success)] font-medium">+5.4% ↗</span>
                </div>
                <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)] rounded-full" style={{ width: "85%" }} />
                </div>
                <p className="text-xs text-[var(--muted)] mt-2 text-right">Target: $5M</p>
              </div>
            </div>

            {/* APY Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">CURRENT YIELD (APY)</p>
                  <p className="text-3xl font-bold">12.5%</p>
                  <p className="text-sm text-[var(--muted)] mt-1">stable</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#a855f7] font-medium">+0.8% ↗</span>
                <div className="flex gap-1 h-8">
                  {[3, 4, 5, 4, 6].map((height, i) => (
                    <div
                      key={i}
                      className={`w-6 rounded-t chart-bar ${
                        i === 4 ? "bg-[#a855f7]" : "bg-[#a855f7]/30"
                      }`}
                      style={{ 
                        height: `${(height / 6) * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Policies Card */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h69.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H77.25m0 0h-4.5m4.5 0v-3.75c0-.621-.504-1.125-1.125-1.125h-4.5c-.621 0-1.125.504-1.125 1.125v3.75m6-3v6m-3-3h3m-3 3v6m-3-3h3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">ACTIVE POLICIES</p>
                  <p className="text-3xl font-bold">1,240</p>
                  <p className="text-sm text-[var(--muted)] mt-1">covered</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--warning)] font-medium">+12% ↗</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liquidity Growth Chart */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Liquidity Growth</h2>
                <div className="flex gap-2">
                  {(["30D", "90D", "1Y"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
                    points={growthData.map((value, i) => {
                      const x = (i / (growthData.length - 1)) * 800;
                      const y = 200 - ((value - 3.0) / 1.5) * 200;
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="url(#liquidityGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="liquidityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="1" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fill */}
                  <polygon
                    points={`0,200 ${growthData.map((value, i) => {
                      const x = (i / (growthData.length - 1)) * 800;
                      const y = 200 - ((value - 3.0) / 1.5) * 200;
                      return `${x},${y}`;
                    }).join(" ")} 800,200`}
                    fill="url(#liquidityGradient)"
                    opacity="0.2"
                  />
                  
                  {/* Current Value Indicator */}
                  <circle
                    cx={800}
                    cy={200 - ((growthData[growthData.length - 1] - 3.0) / 1.5) * 200}
                    r="8"
                    fill="#a855f7"
                  />
                </svg>
                
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[var(--muted)] px-2">
                  <span>$5M</span>
                  <span>$4M</span>
                  <span>$3M</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute right-4 top-8 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs">
                  <p className="text-[var(--muted)]">Nov 14, 2023</p>
                  <p className="font-bold">$4,250,000</p>
                </div>
              </div>
            </div>

            {/* Pool Composition Donut Chart */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <h2 className="text-xl font-bold mb-2">Pool Composition</h2>
              <p className="text-sm text-[var(--muted)] mb-6">Asset breakdown by stablecoin</p>
              
              <div className="flex items-center justify-center h-64 relative">
                {/* Donut Chart SVG */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="40"
                  />
                  {/* USDC segment */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="var(--accent-secondary)"
                    strokeWidth="40"
                    strokeDasharray={`${(composition.usdc / 100) * 439.82} 439.82`}
                    strokeLinecap="round"
                  />
                  {/* USDT segment */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="40"
                    strokeDasharray={`${(composition.usdt / 100) * 439.82} 439.82`}
                    strokeDashoffset={`-${(composition.usdc / 100) * 439.82}`}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">DOMINANCE</p>
                  <p className="text-4xl font-bold">{composition.usdc}%</p>
                  <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20">
                    <span className="text-xs font-medium text-[var(--accent-secondary)]">USDC</span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="w-4 h-4 rounded-full bg-[var(--accent-secondary)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">USDC</p>
                    <p className="text-xs text-[var(--muted)]">{composition.usdc}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="w-4 h-4 rounded-full bg-[#a855f7]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">USDT</p>
                    <p className="text-xs text-[var(--muted)]">{composition.usdt}%</p>
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

