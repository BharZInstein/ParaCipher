"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";

// Types
interface Driver {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  location: string;
  lastPing: string;
  safetyScore: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "oracle" | "event" | "system" | "contract";
  message: string;
  data?: Record<string, unknown>;
}

// Mock Data - Indian Gig Workers
const mockDrivers: Driver[] = [
  { id: "DRV-8821", name: "Rajesh Kumar", status: "active", location: "Mumbai (Andheri East)", lastPing: "2s ago", safetyScore: 98 },
  { id: "DRV-8822", name: "Amit Singh", status: "active", location: "Delhi (Connaught Place)", lastPing: "5s ago", safetyScore: 95 },
  { id: "DRV-8823", name: "Vikram Malhotra", status: "idle", location: "Bangalore (Indiranagar)", lastPing: "1m ago", safetyScore: 92 },
  { id: "DRV-8824", name: "Suresh P.", status: "active", location: "Chennai (T. Nagar)", lastPing: "3s ago", safetyScore: 97 },
  { id: "DRV-8825", name: "Abdul Rahim", status: "offline", location: "Hyderabad (Banjara Hills)", lastPing: "5m ago", safetyScore: 88 },
];

const generateLogEntry = (id: number): LogEntry => {
  const messages = [
    { type: "oracle", msg: "Oracle: Accident verified on MG Road via Police API" },
    { type: "oracle", msg: "Chainlink Keepers: Validated 24h coverage expiry" },
    { type: "event", msg: "New 24h Shift Coverage purchased (25 MATIC)" },
    { type: "event", msg: "Claim Filed: Bike Skid, Sector 14, Gurgaon" },
    { type: "system", msg: "ReputationScore.sol: Updated safety scores (+5)" },
    { type: "contract", msg: "ClaimPayout.sol: 50,000 MATIC instant transfer" },
    { type: "contract", msg: "InsurancePolicy.sol: Premium pool rebalanced" },
  ];
  const selected = messages[Math.floor(Math.random() * messages.length)];
  return {
    id: `LOG-${id}`,
    timestamp: new Date().toLocaleTimeString(),
    type: selected.type as LogEntry["type"],
    message: selected.msg,
    data: selected.type === "contract" ? { gasUsed: 120000 + id, block: 45000000 + id } : undefined,
  };
};

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading, walletAddress } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Authentication guard - redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin-login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setLogs(Array.from({ length: 8 }, (_, i) => generateLogEntry(i + 1)));
    const interval = setInterval(() => {
      setLogs((prev) => [generateLogEntry(Date.now()), ...prev.slice(0, 7)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-[var(--accent-primary)]">
          <span className="w-4 h-4 border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] rounded-full animate-spin" />
          <span className="text-sm tracking-widest">AUTHENTICATING...</span>
        </div>
      </div>
    );
  }

  // Don't render dashboard content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-mono text-xs relative overflow-hidden">
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />

      {/* Scanline Effect */}
      <div className="scanline-effect fixed inset-0 z-50 pointer-events-none opacity-[0.03]" />

      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)]/90 backdrop-blur-md z-40 sticky top-0">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-40 h-10">
              <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">DASHBOARD</h1>

            </div>
            <span className="text-lg font-bold tracking-widest text-[var(--foreground)] hidden">
              PARACIPHER <span className="text-[var(--text-secondary)]">//</span> PROTOCOL
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right flex flex-col items-end">
              <p className="text-[var(--foreground)] tracking-wider font-bold">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-[10px] text-[var(--accent-secondary)] uppercase tracking-widest">
                {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" }).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-[var(--accent-success)]/30 bg-[var(--accent-success)]/5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--accent-success)] tracking-widest">SHARDEUM Testnet</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1920px] mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">

        {/* Row 1: Key Metrics */}
        <section className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "ACTIVE DAILY SHIFTS", value: "14,205", change: "+12%", color: "text-[var(--foreground)]" },
            { label: "TOTAL VALUE LOCKED", value: "5.8M MATIC", sub: "AAVE YIELD ON", color: "text-[var(--accent-primary)]" },
            { label: "CLAIMS PROCESSED (24H)", value: "12", sub: "AVG: 50k MATIC", color: "text-[var(--accent-alert)]" },
            { label: "AVG SAFETY SCORE", value: "94/100", sub: "TOP TIER", color: "text-[var(--accent-secondary)]" }
          ].map((metric, i) => (
            <div key={i} className="tech-border p-5 group relative bg-[var(--background-secondary)]/50 backdrop-blur-sm overflow-hidden hover:bg-[var(--card-hover)] transition-all duration-300">
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />

              <div className="flex justify-between items-start mb-2">
                <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] font-bold">{metric.label}</p>
                <div className="w-1 h-1 bg-[var(--card-border)] group-hover:bg-[var(--accent-primary)] transition-colors" />
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className={`text-4xl font-black tracking-tight ${metric.color}`}>{metric.value}</span>
                {(metric.change || metric.sub) && (
                  <span className={`text-[10px] tracking-widest px-2 py-0.5 border border-[var(--card-border)] bg-[var(--background)] ${metric.change ? 'text-[var(--accent-success)] border-[var(--accent-success)]/30' : 'text-[var(--text-secondary)]'}`}>
                    {metric.change || metric.sub}
                  </span>
                )}
              </div>
              {/* Decorative dashes */}
              <div className="absolute bottom-0 left-0 w-full flex gap-1 p-1 opacity-20">
                {[...Array(10)].map((_, j) => <div key={j} className="h-0.5 w-full bg-[var(--foreground)]" />)}
              </div>
            </div>
          ))}
        </section>

        {/* Row 2: Main Control + Logs */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Workers Table */}
          <section className="tech-border p-0 bg-[var(--background-secondary)] relative">
            {/* Header with decorative elements */}
            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--background)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-primary)]" />
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border border-[var(--card-border)] flex items-center justify-center">
                  <span className="animate-pulse text-[var(--accent-primary)]">⦿</span>
                </div>
                <h3 className="text-xs font-bold tracking-[0.15em] text-[var(--foreground)]">ACTIVE GIG DRIVERS</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  <span className="w-2 h-2 bg-[var(--accent-success)] rounded-full" /> LIVE FEED
                </div>
                <button className="btn-tech py-1.5 px-4 text-[10px] hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                  DEPLOY NEW REGION +
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--card-border)] text-[var(--text-secondary)] bg-[var(--background)]/50">
                    <th className="p-4 font-normal tracking-widest text-[9px]">ID_REFERENCE</th>
                    <th className="p-4 font-normal tracking-widest text-[9px]">CURRENT_STATUS</th>
                    <th className="p-4 font-normal tracking-widest text-[9px]">GEOLOCATION</th>
                    <th className="p-4 font-normal tracking-widest text-[9px]">LAST_PING</th>
                    <th className="p-4 font-normal tracking-widest text-[9px]">SAFETY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {mockDrivers.map((d) => (
                    <tr key={d.id} className="hover:bg-[var(--card-hover)] transition-colors group">
                      <td className="p-4 font-bold text-[var(--accent-primary)] font-mono">{d.id}</td>
                      
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase border ${d.status === 'active' ? 'border-[var(--accent-success)]/30 bg-[var(--accent-success)]/5 text-[var(--accent-success)]' :
                          d.status === 'idle' ? 'border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/5 text-[var(--accent-secondary)]' :
                            'border-[var(--accent-alert)]/30 bg-[var(--accent-alert)]/5 text-[var(--accent-alert)]'
                          }`}>
                          <span className={`w-1 h-1 rounded-full ${d.status === 'active' ? 'bg-[var(--accent-success)] animate-pulse' : d.status === 'idle' ? 'bg-[var(--accent-secondary)]' : 'bg-[var(--accent-alert)]'}`} />
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-secondary)] font-mono text-[10px]">{d.location}</td>
                      <td className="p-4 text-[var(--text-secondary)] font-mono text-[10px]">{d.lastPing}</td>
                      <td className="p-4">
                        <div className="w-24 h-1.5 bg-[var(--card-border)] relative overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-[var(--foreground)]"
                            style={{ width: `${d.safetyScore}%` }}
                          />
                        </div>
                        <span className="text-[9px] mt-1 block text-right">{d.safetyScore}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Column 3: Event Logs */}
        <div className="md:col-span-1 space-y-6 flex flex-col">
          <section className="tech-border flex-1 flex flex-col bg-[var(--background)] min-h-[400px] relative overflow-hidden">
            {/* Decorative Scanline */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-20 animate-pulse" />

            <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-widest">PROTOCOL_EVENTS</h3>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-[var(--accent-alert)] rounded-full animate-ping" />
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono custom-scrollbar">
              {logs.map((log, i) => (
                <div key={log.id} className="relative pl-4 border-l border-[var(--card-border)] hover:border-[var(--foreground)] transition-colors group">
                  <div className="absolute left-[-1px] top-0 w-[1px] h-0 group-hover:h-full bg-[var(--accent-primary)] transition-all duration-300" />

                  <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mb-1 tracking-wider uppercase">
                    <span>{log.timestamp}</span>
                    <span className={`font-bold ${log.type === 'contract' ? 'text-[var(--accent-primary)]' :
                      log.type === 'oracle' ? 'text-[var(--accent-secondary)]' :
                        log.type === 'event' ? 'text-[var(--accent-success)]' : 'text-[var(--foreground)]'
                      }`}>[{log.type}]</span>
                  </div>
                  <p className="text-[10px] text-[var(--foreground)] leading-relaxed group-hover:text-white transition-colors">{log.message}</p>

                  {log.data && (
                    <div className="mt-1 p-2 bg-[var(--background-secondary)] border border-[var(--card-border)] text-[9px] text-[var(--text-secondary)] font-mono">
                      {Object.entries(log.data).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span>{k}:</span>
                          <span className="text-[var(--accent-primary)]">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 text-[var(--accent-success)] text-[10px] animate-pulse">
                <span>_AWAITING_NEW_BLOCKS</span>
                <span className="w-2 h-4 bg-[var(--accent-success)]" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
