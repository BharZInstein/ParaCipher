"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../components/LeafletMap"), { ssr: false });

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "ACTIVE_SHIFTS (24H)", value: "2,847", change: "+12%" },
    { label: "CLAIMS_FLAGGED", value: "3", period: "PENDING REVIEW" },
    { label: "PROTOCOL_UPTIME", value: "99.98%", status: "STABLE" },
    { label: "ORACLE_RESPONSE", value: "45ms", status: "OPTIMAL" },
  ];

  const workers = [
    { id: "DRV-001", name: "Rajesh Kumar", status: "Active", location: "Mumbai (Andheri)", lat: 19.1136, lng: 72.8697, ping: "2s ago", score: "98" },
    { id: "DRV-002", name: "Amit Singh", status: "Active", location: "Delhi (CP)", lat: 28.6274, lng: 77.2167, ping: "5s ago", score: "95" },
    { id: "DRV-003", name: "Vikram M.", status: "Idle", location: "Bangalore (HSR)", lat: 12.9141, lng: 77.6411, ping: "1m ago", score: "92" },
    { id: "DRV-004", name: "Suresh P.", status: "Active", location: "Chennai (OMR)", lat: 12.9184, lng: 80.2285, ping: "3s ago", score: "97" },
    { id: "DRV-005", name: "Abdul Rahim", status: "Offline", location: "Hyderabad", lat: 17.3850, lng: 78.4867, ping: "5m ago", score: "88" },
  ];

  const mapLocations = workers.map(w => ({
    id: w.id,
    lat: w.lat,
    lng: w.lng,
    name: `${w.name} (${w.status})`,
    type: "driver" as const
  }));

  const logs = [
    { id: 1, type: "EVENT", msg: "Coverage Purchased: 25 MATIC (Shift #9928)", time: "19:31:06" },
    { id: 2, type: "ORACLE", msg: "Price feed updated: MATIC/USD = $0.85", time: "19:31:03" },
    { id: 3, type: "ORACLE", msg: "Chainlink Keeper: Validated Shift Expiry", time: "19:31:03" },
    { id: 4, type: "SYSTEM", msg: "ReputationScore: +5 pts for Safe Day (Rajesh)", time: "19:31:03" },
    { id: 5, type: "CONTRACT", msg: "ClaimPayout.sol: 50,000 MATIC Payout Sent", time: "19:31:03" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
      {/* Tech Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">MISSION_CONTROL</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">CENTRAL COMMAND INTERFACE</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--accent-success)] border border-[var(--accent-success)] px-3 py-1 bg-[var(--accent-success)]/10">
            POLYGON NETWORK: LIVE
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Top Stats */}
        {stats.map((stat, i) => (
          <div key={i} className="tech-border p-4 corner-accent relative hover:bg-[var(--card-hover)] transition-colors group">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">{stat.label}</span>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</span>
              {stat.change && <span className="text-xs text-[var(--accent-success)]">{stat.change}</span>}
              {stat.status && <span className="text-[10px] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-1">{stat.status}</span>}
              {stat.period && <span className="text-[10px] text-[var(--text-secondary)]">{stat.period}</span>}
            </div>
            {/* Box grid decor */}
            <div className="absolute bottom-2 right-2 w-4 h-4 grid-overlay opacity-50" />
          </div>
        ))}

        {/* Main Map View */}
        <section className="lg:col-span-3 tech-border p-0 bg-[var(--background)] relative h-[500px] overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-[var(--background)]/90 backdrop-blur border border-[var(--card-border)] p-2 rounded">
            <h3 className="text-xs font-bold tracking-widest text-[var(--foreground)] flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-primary)] animate-pulse" />
              LIVE_DRIVER_TRACKING
            </h3>
          </div>
          <LeafletMap locations={mapLocations} zoom={5} />
        </section>

        {/* Right Log Stream / Active List */}
        <aside className="lg:col-span-1 tech-border p-0 bg-[var(--background)] flex flex-col h-[500px]">
          <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)]">
            <h3 className="text-xs font-bold tracking-widest text-[var(--foreground)]">ACTIVE_NODES</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {workers.map((w) => (
              <div key={w.id} className="p-3 border-b border-[var(--card-border)] hover:bg-[var(--card-hover)] cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[var(--foreground)]">{w.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 ${w.status === 'Active' ? 'bg-[var(--accent-success)] text-[var(--background)]' : 'bg-[var(--card-border)] text-[var(--text-secondary)]'
                    }`}>{w.status}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>{w.location}</span>
                  <span>Score: {w.score}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Smart Contract Quick View */}
        <section className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-border p-4 bg-[var(--background-secondary)]">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold">INSURANCE_POLICY.SOL</span>
              <span className="w-2 h-2 bg-[var(--accent-success)] rounded-full" />
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono space-y-1">
              <p>ADDR: 0x73...4a2b</p>
              <p>TX_COUNT: 1,204,592</p>
              <p className="text-[var(--accent-primary)]">DAILY_COVERAGE_SALES</p>
            </div>
          </div>
          <div className="tech-border p-4 bg-[var(--background-secondary)]">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold">CLAIM_PAYOUT.SOL</span>
              <span className="w-2 h-2 bg-[var(--accent-success)] rounded-full" />
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono space-y-1">
              <p>ADDR: 0x9f...1c8d</p>
              <p>TX_COUNT: 842,103</p>
              <p className="text-[var(--accent-primary)]">INSTANT_SETTLEMENTS</p>
            </div>
          </div>
          <div className="tech-border p-4 bg-[var(--background-secondary)]">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold">REPUTATION_SCORE.SOL</span>
              <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full" />
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono space-y-1">
              <p>ADDR: 0x2b...8e4f</p>
              <p>TX_COUNT: 302,401</p>
              <p className="text-[var(--accent-primary)]">SBT_TRACKING</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
