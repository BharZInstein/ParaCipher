"use client";

import { useState, useEffect } from "react";

// Types
interface Worker {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  coverage: string;
  lastPing: string;
  reputation: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "oracle" | "event" | "system" | "contract";
  message: string;
  data?: Record<string, unknown>;
}

// Mock Data
const mockWorkers: Worker[] = [
  { id: "W-001", name: "Oracle Node Alpha", status: "active", coverage: "Mumbai", lastPing: "2s ago", reputation: 98 },
  { id: "W-002", name: "Oracle Node Beta", status: "active", coverage: "Delhi", lastPing: "5s ago", reputation: 95 },
  { id: "W-003", name: "Oracle Node Gamma", status: "idle", coverage: "Bangalore", lastPing: "1m ago", reputation: 92 },
  { id: "W-004", name: "Oracle Node Delta", status: "active", coverage: "Chennai", lastPing: "3s ago", reputation: 97 },
  { id: "W-005", name: "Oracle Node Epsilon", status: "offline", coverage: "Kolkata", lastPing: "5m ago", reputation: 88 },
];

const generateLogEntry = (id: number): LogEntry => {
  const types: LogEntry["type"][] = ["oracle", "event", "system", "contract"];
  const messages = [
    { type: "oracle", msg: "Oracle price feed updated: ETH/USD = $3,456.78" },
    { type: "oracle", msg: "Chainlink aggregator response verified" },
    { type: "event", msg: "New policy registered: POL-2024-00${id}" },
    { type: "event", msg: "Claim submitted for policy POL-2024-00${id}" },
    { type: "system", msg: "Health check completed: All systems nominal" },
    { type: "system", msg: "Memory usage: 67% | CPU: 23%" },
    { type: "contract", msg: "ClaimPayout.sol executed: 0.5 ETH transferred" },
    { type: "contract", msg: "InsurancePolicy.sol: Premium received" },
  ];
  const selected = messages[Math.floor(Math.random() * messages.length)];
  return {
    id: `LOG-${id}`,
    timestamp: new Date().toISOString(),
    type: selected.type as LogEntry["type"],
    message: selected.msg.replace("${id}", String(id)),
    data: selected.type === "contract" ? { gasUsed: Math.floor(Math.random() * 100000) + 50000, block: 18900000 + id } : undefined,
  };
};

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 10 }, (_, i) => generateLogEntry(i + 1));
    setLogs(initialLogs);

    // Add new log every 3 seconds
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLogEntry(prev.length + 1);
        return [newLog, ...prev.slice(0, 19)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateAccident = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setSimulationResult("Accident simulation completed. Claim #CLM-2024-0847 processed successfully. Payout: 0.75 ETH");
    setIsSimulating(false);
    
    // Add simulation log
    setLogs((prev) => [{
      id: `LOG-SIM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "event",
      message: "🚨 SIMULATION: Accident detected and processed",
      data: { claimId: "CLM-2024-0847", payout: "0.75 ETH", status: "completed" },
    }, ...prev.slice(0, 19)]);
  };

  const getStatusColor = (status: Worker["status"]) => {
    switch (status) {
      case "active": return "bg-[var(--success)]";
      case "idle": return "bg-[var(--warning)]";
      case "offline": return "bg-[var(--danger)]";
    }
  };

  const getLogTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "oracle": return "text-[var(--accent-secondary)]";
      case "event": return "text-[var(--warning)]";
      case "system": return "text-[var(--muted)]";
      case "contract": return "text-[var(--accent)]";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)] rounded-full blur-[200px] opacity-5 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-[var(--accent)]">Para</span>Cipher
              </h1>
              <p className="text-xs text-[var(--muted)]">Mission Control</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-mono text-[var(--foreground)]">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
              <span className="text-sm text-[var(--success)]">All Systems Operational</span>
            </div>
            <button className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent)] transition-colors">
              <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6">
        {/* System Overview Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Policies */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift glow-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-3xl font-bold count-up">2,847</p>
              <p className="text-sm text-[var(--muted)] mt-1">Active Policies</p>
            </div>

            {/* Claims Processed */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift glow-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--warning)] bg-[var(--warning)]/10 px-2 py-1 rounded-full">+3%</span>
              </div>
              <p className="text-3xl font-bold count-up">156</p>
              <p className="text-sm text-[var(--muted)] mt-1">Claims Processed (30d)</p>
            </div>

            {/* Network Uptime */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift glow-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">Stable</span>
              </div>
              <p className="text-3xl font-bold count-up">99.98%</p>
              <p className="text-sm text-[var(--muted)] mt-1">Network Uptime</p>
            </div>

            {/* Oracle Latency */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 card-lift glow-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-full">Optimal</span>
              </div>
              <p className="text-3xl font-bold count-up">45ms</p>
              <p className="text-sm text-[var(--muted)] mt-1">Avg Oracle Latency</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Workers & Contract Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Control - Workers */}
            <section className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Active Workers</h2>
                    <p className="text-xs text-[var(--muted)]">Oracle nodes and coverage status</p>
                  </div>
                </div>
                <button
                  onClick={handleSimulateAccident}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--danger)] text-white font-medium text-sm btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSimulating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Simulate Accident
                    </>
                  )}
                </button>
              </div>
              
              {simulationResult && (
                <div className="px-6 py-4 bg-[var(--success)]/10 border-b border-[var(--success)]/20">
                  <div className="flex items-center gap-2 text-[var(--success)] text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {simulationResult}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-[var(--muted)] uppercase tracking-wider">
                        <th className="pb-4 font-medium">Worker ID</th>
                        <th className="pb-4 font-medium">Name</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Coverage</th>
                        <th className="pb-4 font-medium">Last Ping</th>
                        <th className="pb-4 font-medium">Reputation</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mockWorkers.map((worker) => (
                        <tr key={worker.id} className="border-t border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors">
                          <td className="py-4 font-mono text-[var(--accent)]">{worker.id}</td>
                          <td className="py-4">{worker.name}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              worker.status === "active" ? "bg-[var(--success)]/10 text-[var(--success)]" :
                              worker.status === "idle" ? "bg-[var(--warning)]/10 text-[var(--warning)]" :
                              "bg-[var(--danger)]/10 text-[var(--danger)]"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(worker.status)}`} />
                              {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 text-[var(--muted)]">{worker.coverage}</td>
                          <td className="py-4 font-mono text-xs text-[var(--muted)]">{worker.lastPing}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[var(--accent)] rounded-full" 
                                  style={{ width: `${worker.reputation}%` }} 
                                />
                              </div>
                              <span className="text-xs font-mono">{worker.reputation}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Smart Contract Status */}
            <section className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold">Smart Contract Status</h2>
                  <p className="text-xs text-[var(--muted)]">Protocol health and execution metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* InsurancePolicy.sol */}
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">InsurancePolicy.sol</span>
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Address</span>
                      <span className="font-mono text-[var(--accent)]">0x7a23...4f8e</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Network</span>
                      <span>Polygon Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Last Exec</span>
                      <span className="font-mono">2m ago</span>
                    </div>
                  </div>
                </div>

                {/* ClaimPayout.sol */}
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">ClaimPayout.sol</span>
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Address</span>
                      <span className="font-mono text-[var(--accent)]">0x3b91...2c7a</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Network</span>
                      <span>Polygon Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Last Exec</span>
                      <span className="font-mono">15m ago</span>
                    </div>
                  </div>
                </div>

                {/* ReputationScore.sol */}
                <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">ReputationScore.sol</span>
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Address</span>
                      <span className="font-mono text-[var(--accent)]">0x9f45...1d3b</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Network</span>
                      <span>Polygon Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Last Exec</span>
                      <span className="font-mono">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Liquidity Pool / TVL Overview */}
            <section className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Liquidity Pool Overview</h2>
                    <p className="text-xs text-[var(--muted)]">Total Value Locked and yield metrics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Powered by DeFi
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <p className="text-3xl font-bold text-[var(--accent)]">$4.2M</p>
                  <p className="text-sm text-[var(--muted)] mt-1">Total Value Locked</p>
                </div>
                <div className="text-center p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <p className="text-3xl font-bold text-[var(--success)]">12.4%</p>
                  <p className="text-sm text-[var(--muted)] mt-1">APY</p>
                </div>
                <div className="text-center p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <p className="text-3xl font-bold text-[var(--accent-secondary)]">847</p>
                  <p className="text-sm text-[var(--muted)] mt-1">LP Providers</p>
                </div>
              </div>

              {/* TVL Chart */}
              <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">TVL (30 Days)</span>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--background)]">30D</button>
                    <button className="text-xs px-3 py-1 rounded-full text-[var(--muted)] hover:bg-[var(--card)] transition-colors">90D</button>
                    <button className="text-xs px-3 py-1 rounded-full text-[var(--muted)] hover:bg-[var(--card)] transition-colors">1Y</button>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 gap-1">
                  {[35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 85, 82, 88, 92, 95, 88, 92, 96, 94, 98, 92, 95, 90, 93, 88, 94, 97, 100, 96, 98].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--accent-secondary)] rounded-t chart-bar opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 0.03}s`
                      }}
                      title={`Day ${i + 1}: $${(height * 42000).toLocaleString()}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
                  <span>Dec 11</span>
                  <span>Dec 21</span>
                  <span>Jan 10</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Oracle & Event Logs */}
          <div className="space-y-6">
            {/* Oracle & Event Logs */}
            <section className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden h-[calc(100vh-200px)] flex flex-col">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--terminal-green)]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--terminal-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">Event Logs</h2>
                    <p className="text-xs text-[var(--muted)]">Real-time system events</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--terminal-green)] animate-pulse" />
                  <span className="text-xs text-[var(--terminal-green)]">Live</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-[#0d0e12]">
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div 
                      key={log.id} 
                      className={`log-entry p-2 rounded-lg bg-[var(--card)]/50 border border-[var(--border)]/50 ${index === 0 ? 'border-[var(--accent)]/30' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`uppercase text-[10px] font-bold ${getLogTypeColor(log.type)}`}>
                          [{log.type}]
                        </span>
                        <span className="text-[var(--muted)]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[var(--foreground)] leading-relaxed">{log.message}</p>
                      {log.data && (
                        <pre className="mt-2 text-[10px] text-[var(--muted)] bg-[var(--background)] p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
                <div className="cursor-blink mt-2 text-[var(--terminal-green)]">
                  awaiting next event
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

