"use client";

import { useState } from "react";

export default function LiquidityPool() {
  const [timeframe, setTimeframe] = useState<"30D" | "90D" | "1Y">("30D");

  // Mock chart data (simple bar graph for tech aesthetic)
  const growthData = [45, 50, 48, 52, 58, 55, 60, 62, 59, 65, 70, 68, 72, 75, 78, 80, 78, 82, 85, 88, 86, 90, 92, 95, 94, 98, 96, 100, 98, 99];

  return (
    <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
      {/* Tech Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">LIQUIDITY_POOL</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">PREMIUM YIELD & ASSET MANAGEMENT</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--foreground)] bg-[var(--accent-primary)] px-2 py-0.5 font-bold">AAVE V3 STRATEGY</span>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Key Metrics Row */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-border p-4 corner-accent hover:bg-[var(--card-hover)] transition-colors">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">TOTAL VALUE LOCKED (TVL)</span>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold text-[var(--foreground)]">4.2M MATIC</p>
              <span className="text-xs text-[var(--accent-success)]">+5.4%</span>
            </div>
            <div className="mt-2 w-full h-1 bg-[var(--card-border)]">
              <div className="h-full bg-[var(--accent-primary)] w-[85%]" />
            </div>
          </div>

          <div className="tech-border p-4 corner-accent hover:bg-[var(--card-hover)] transition-colors">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">YIELD GENERATED (APY)</span>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold text-[var(--accent-success)]">12.5%</p>
              <span className="text-[10px] text-[var(--text-secondary)]">AAVE LENDING</span>
            </div>
            <div className="mt-2 flex gap-[2px] h-2 items-end">
              {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-[var(--accent-success)] opacity-50" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="tech-border p-4 corner-accent hover:bg-[var(--card-hover)] transition-colors">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">ACTIVE COVERAGE (RISK)</span>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold text-[var(--accent-alert)]">1.2M MATIC</p>
              <span className="text-xs text-[var(--accent-alert)]">+12%</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[1, 1, 1, 1, 1, 0, 0, 0].map((active, i) => (
                <div key={i} className={`h-1 w-2 ${active ? 'bg-[var(--accent-alert)]' : 'bg-[var(--card-border)]'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Chart Section */}
        <section className="lg:col-span-3 tech-border p-6 bg-[var(--background)]">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--card-border)] pb-4">
            <h3 className="text-xs font-bold tracking-widest">POOL_PERFORMANCE (MATIC)</h3>
            <div className="flex gap-2">
              {(["30D", "90D", "1Y"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`text-[10px] px-3 py-1 border ${timeframe === tf ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--background)]' : 'border-[var(--card-border)] text-[var(--text-secondary)]'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Digital Bar Chart */}
          <div className="h-64 flex items-end gap-[4px] relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
              <div className="border-t border-[var(--card-border)] pt-1 text-[10px] text-[var(--text-secondary)]">5M MATIC</div>
              <div className="border-t border-[var(--card-border)] pt-1 text-[10px] text-[var(--text-secondary)]">3M MATIC</div>
              <div className="border-t border-[var(--card-border)] pt-1 text-[10px] text-[var(--text-secondary)]">1M MATIC</div>
            </div>

            {growthData.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--card-border)] hover:bg-[var(--accent-primary)] transition-colors relative z-10 group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[10px] text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 bg-[var(--background)] border border-[var(--card-border)] px-1 whitespace-nowrap">
                  {(h * 42000).toLocaleString()} MATIC
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pool Composition */}
        <div className="lg:col-span-1 tech-border p-6 bg-[var(--background-secondary)]">
          <h3 className="text-xs font-bold tracking-widest mb-6 border-b border-[var(--card-border)] pb-4">ASSET_ALLOCATION</h3>

          {/* Tech Histogram for Donut alt */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">AAVE_LENDING_POOL</span>
                <span>85%</span>
              </div>
              <div className="h-4 bg-[var(--card-border)] flex">
                {[...Array(17)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-[var(--background)] bg-[var(--accent-primary)] opacity-80" />
                ))}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-[var(--background)] bg-[var(--card-border)]" />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">PAYOUT_LIQUIDITY</span>
                <span>15%</span>
              </div>
              <div className="h-4 bg-[var(--card-border)] flex">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-[var(--background)] bg-[var(--accent-secondary)] opacity-80" />
                ))}
                {[...Array(17)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-[var(--background)] bg-[var(--card-border)]" />
                ))}
              </div>
            </div>

            <div className="pt-8 text-[10px] text-[var(--text-secondary)] space-y-2">
              <p className="flex justify-between"><span>STRATEGY:</span> <span className="text-[var(--foreground)]">YIELD_MAXIMIZATION</span></p>
              <p className="flex justify-between"><span>UTILIZATION:</span> <span className="text-[var(--accent-success)]">84.2%</span></p>
              <p className="flex justify-between"><span>REBALANCING:</span> <span className="text-[var(--accent-secondary)]">AUTOMATED (Keepers)</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
