"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

interface Worker {
  id: string;
  name: string;
  activity: string;
  activityIcon: string;
  riskScore: number;
  status: "ACTIVE" | "PENDING" | "IDLE";
  lastHeartbeat: string;
}

export default function MissionControl() {
  const [selectedPolicy, setSelectedPolicy] = useState("WK-8821 (Active)");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const workers: Worker[] = [
    {
      id: "WK-8821",
      name: "JM WK-8821",
      activity: "Driving",
      activityIcon: "🚗",
      riskScore: 12,
      status: "ACTIVE",
      lastHeartbeat: "2s ago",
    },
    {
      id: "WK-9942",
      name: "JS WK-9942",
      activity: "Idle",
      activityIcon: "🚚",
      riskScore: 45,
      status: "PENDING",
      lastHeartbeat: "5m ago",
    },
    {
      id: "WK-1023",
      name: "AL WK-1023",
      activity: "Delivering",
      activityIcon: "🏍️",
      riskScore: 88,
      status: "ACTIVE",
      lastHeartbeat: "Just now",
    },
  ];

  const blockchainFeeds = [
    {
      type: "PAYOUT EXECUTED",
      borderColor: "var(--accent)",
      time: "10s ago",
      description: "Policy #0x88...2A triggered by Oracle.",
      txHash: "0x4a...9f",
      value: "0.5 ETH",
    },
    {
      type: "NEW POLICY",
      borderColor: "#a855f7",
      time: "2m ago",
      description: "Worker WK-8821 coverage started.",
      txHash: "0x1b...3c",
      value: "-",
    },
    {
      type: "RISK ADJ.",
      borderColor: "var(--warning)",
      time: "5m ago",
      description: "Zone B multiplier increased.",
      source: "Weather Oracle",
      value: "+15% Premium",
    },
  ];

  const handleSimulate = async () => {
    setIsSimulating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSimulating(false);
    alert("Simulation triggered successfully!");
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "var(--accent-secondary)";
    if (score < 70) return "var(--warning)";
    return "var(--danger)";
  };

  const getStatusColor = (status: Worker["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20";
      case "PENDING":
        return "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20";
      default:
        return "bg-[var(--muted)]/10 text-[var(--muted)] border-[var(--muted)]/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--background)] relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="max-w-[1800px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mission Control</h1>
                <p className="text-[var(--muted)]">Comprehensive overview for judges and active worker management</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  <span className="text-sm text-[var(--success)] font-medium">SYSTEM OPERATIONAL</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">18 Gwei</p>
                  <p className="text-xs text-[var(--muted)]">Gas Price</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-[#a855f7]">#1829402</p>
                  <p className="text-xs text-[var(--muted)]">Block</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-8">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Active Policies</p>
                  <p className="text-2xl font-bold">1,240</p>
                </div>
              </div>
              <span className="text-sm text-[var(--success)] font-medium">+12% ↗</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Total Value Locked</p>
                  <p className="text-2xl font-bold">$4.2M</p>
                </div>
              </div>
              <span className="text-sm text-[var(--success)] font-medium">+5% ↗</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">24H Claims Paid</p>
                  <p className="text-2xl font-bold">$12,500</p>
                </div>
              </div>
              <span className="text-sm text-[var(--danger)] font-medium">-2% ↘</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Network Load</p>
                  <p className="text-2xl font-bold">42%</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] font-medium">
                Stable
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Live Tracking Map */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" />
                  <h2 className="text-lg font-bold">LIVE TRACKING</h2>
                </div>
              </div>
              <div className="aspect-square bg-[var(--background)] rounded-xl border border-[var(--border)] relative overflow-hidden">
                {/* Simple map visualization */}
                <svg viewBox="0 0 400 400" className="w-full h-full opacity-30">
                  {/* Grid */}
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="currentColor" strokeWidth="1" />
                  ))}
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((y) => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" strokeWidth="1" />
                  ))}
                  {/* Radial roads */}
                  <line x1="200" y1="200" x2="0" y2="0" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  <line x1="200" y1="200" x2="400" y2="0" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  <line x1="200" y1="200" x2="400" y2="400" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  <line x1="200" y1="200" x2="0" y2="400" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                </svg>
                {/* Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Main marker */}
                    <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-[var(--accent)] opacity-80 animate-ping" />
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[var(--accent)] border-2 border-[var(--background)]" />
                    {/* Secondary markers */}
                    <div className="absolute top-12 right-16 w-6 h-6 rounded-full bg-[#a855f7] opacity-70" />
                    <div className="absolute bottom-16 left-12 w-6 h-6 rounded-full bg-[var(--warning)] opacity-70" />
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Console */}
            <div className="bg-[var(--card)] rounded-2xl border-2 border-[var(--danger)]/30 p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-lg bg-[var(--danger)]/10 text-[var(--danger)] text-xs font-medium border border-[var(--danger)]/20">
                  TESTNET
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--danger)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold">SIMULATION CONSOLE</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-2 uppercase tracking-wider">TARGET POLICY</label>
                  <select
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-all"
                  >
                    <option>WK-8821 (Active)</option>
                    <option>WK-9942 (Pending)</option>
                    <option>WK-1023 (Active)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-3 uppercase tracking-wider">EVENT TYPE</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: "💥", label: "CRASH", value: "crash" },
                      { icon: "🔒", label: "THEFT", value: "theft" },
                      { icon: "⛈️", label: "WEATHER", value: "weather" },
                    ].map((event) => (
                      <button
                        key={event.value}
                        onClick={() => setSelectedEvent(event.value)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          selectedEvent === event.value
                            ? "border-[var(--danger)] bg-[var(--danger)]/10"
                            : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--danger)]/50"
                        }`}
                      >
                        <span className="text-2xl">{event.icon}</span>
                        <span className="text-xs font-medium">{event.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating || !selectedEvent}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[var(--danger)] text-white font-bold hover:bg-[var(--danger)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                >
                  {isSimulating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      EXECUTE TRIGGER
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Worker Fleet */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">ACTIVE WORKER FLEET</h2>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search ID.."
                      className="w-48 bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 pl-9 text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
                    />
                    <svg className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
                      <th className="pb-3 font-medium">WORKER ID</th>
                      <th className="pb-3 font-medium">CURRENT ACTIVITY</th>
                      <th className="pb-3 font-medium">RISK SCORE</th>
                      <th className="pb-3 font-medium">STATUS</th>
                      <th className="pb-3 font-medium">LAST HEARTBEAT</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {workers.map((worker) => (
                      <tr key={worker.id} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors">
                        <td className="py-4 font-mono text-[var(--accent)]">{worker.id}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{worker.activityIcon}</span>
                            <span>{worker.activity}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${worker.riskScore}%`,
                                  backgroundColor: getRiskColor(worker.riskScore),
                                }}
                              />
                            </div>
                            <span className="text-xs font-mono">{worker.riskScore}/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(worker.status)}`}>
                            {worker.status}
                          </span>
                        </td>
                        <td className="py-4 text-[var(--muted)] font-mono text-xs">{worker.lastHeartbeat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Blockchain Feed */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 overflow-hidden flex flex-col" style={{ minHeight: "500px" }}>
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  <h2 className="text-lg font-bold">LIVE BLOCKCHAIN FEED</h2>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                  wss://mainnet...
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs">
                {blockchainFeeds.map((feed, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-l-4 bg-[var(--background)] border-[var(--border)] log-entry"
                    style={{ borderLeftColor: feed.borderColor }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="uppercase font-bold" style={{ color: feed.borderColor }}>
                        {feed.type}
                      </span>
                      <span className="text-[var(--muted)]">{feed.time}</span>
                    </div>
                    <p className="text-[var(--foreground)] mb-2">{feed.description}</p>
                    <div className="flex items-center justify-between text-[var(--muted)]">
                      {feed.txHash && <span className="text-[var(--accent)]">{feed.txHash}</span>}
                      {feed.source && <span>{feed.source}</span>}
                      <span className="font-medium">{feed.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

