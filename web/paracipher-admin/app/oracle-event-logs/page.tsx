"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function OracleEventLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [filter, setFilter] = useState<"All Events" | "Success" | "Warnings" | "Errors">("All Events");
  const [verificationData, setVerificationData] = useState({
    policyId: "pol_88293_xc9",
    status: "VERIFYING",
    progress: 60,
  });

  useEffect(() => {
    // Initial logs
    const initialLogs = [
      "14:02:11 SUCCESS Connection established to Chainlink Node #482",
      "14:02:45 INFO Heartbeat received from Worker Oracle Network",
      "14:03:12 EVENT DETECTED Ride_Cancelled_High_Wait",
    ];
    setLogs(initialLogs);

    // Add new logs periodically
    const interval = setInterval(() => {
      const newLogs = [
        "14:03:15 QUERY Fetching weather data for NYC Coordinates...",
        "14:03:16 SUCCESS Oracle price feed updated: ETH/USD = $3,456.78",
        "14:03:20 EVENT DETECTED Policy trigger activated",
        "14:03:25 INFO System health check completed",
      ];
      setLogs((prev) => {
        const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
        return [randomLog, ...prev.slice(0, 9)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate verification progress
    if (verificationData.status === "VERIFYING") {
      const interval = setInterval(() => {
        setVerificationData((prev) => {
          if (prev.progress >= 100) {
            return { ...prev, status: "COMPLETED", progress: 100 };
          }
          return { ...prev, progress: Math.min(prev.progress + 5, 100) };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [verificationData.status]);

  const getLogType = (log: string) => {
    if (log.includes("SUCCESS")) return "success";
    if (log.includes("ERROR") || log.includes("FAIL")) return "error";
    if (log.includes("WARNING") || log.includes("WARN")) return "warning";
    if (log.includes("EVENT")) return "event";
    if (log.includes("QUERY")) return "query";
    return "info";
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-[var(--success)]";
      case "error":
        return "text-[var(--danger)]";
      case "warning":
        return "text-[var(--warning)]";
      case "event":
        return "text-[#a855f7]";
      case "query":
        return "text-[var(--accent-secondary)]";
      default:
        return "text-[var(--muted)]";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--background)] relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="max-w-[1800px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Oracle & Event Logs</h1>
                  <span className="px-3 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--muted)]">
                    v2.4.0
                  </span>
                </div>
                <p className="text-[var(--muted)]">Real-time decentralized insurance verification stream.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--muted)]">Last updated: Just now</span>
                <button className="p-2 hover:bg-[var(--card)] rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Active Listeners</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
              <span className="text-sm text-[var(--success)] font-medium">+2% ↗</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#a855f7]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Events Processed</p>
                  <p className="text-2xl font-bold">8,492</p>
                </div>
              </div>
              <span className="text-sm text-[#a855f7] font-medium">+15% ↗</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Total Payouts</p>
                  <p className="text-2xl font-bold">$142.5k</p>
                </div>
              </div>
              <span className="text-sm text-[var(--success)] font-medium">+8% ↗</span>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Avg. Confirmation</p>
                  <p className="text-2xl font-bold">1.2s</p>
                </div>
              </div>
              <span className="text-sm text-[var(--success)] font-medium">-0.1s ↘</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter by Policy ID, TxHash..."
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 pl-10 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
              />
              <svg className="w-5 h-5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              {(["All Events", "Success", "Warnings", "Errors"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Oracle Event Stream Log */}
            <div className="lg:col-span-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col" style={{ minHeight: "600px" }}>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[var(--danger)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                    </svg>
                    <span className="text-sm font-mono text-[var(--muted)]">~/oracle/event_stream.log</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                  <span className="text-xs text-[var(--success)] font-medium">NET_LIVE</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-[#0d0e12]">
                {logs.map((log, index) => {
                  const type = getLogType(log);
                  const color = getLogColor(type);
                  return (
                    <div key={index} className="mb-3 log-entry">
                      <span className={`uppercase font-bold ${color}`}>
                        {log.split(" ")[1]}
                      </span>
                      {" "}
                      <span className="text-[var(--muted)]">{log.split(" ").slice(2).join(" ")}</span>
                    </div>
                  );
                })}
                
                {logs.some(log => log.includes("EVENT DETECTED")) && (
                  <div className="mt-4 p-4 bg-[var(--card)] rounded-lg border border-[#a855f7]/20">
                    <pre className="text-[10px] text-[var(--muted)] overflow-x-auto">
{`{
  "policy_id": "pol_88293_xc9",
  "trigger_event": "UBER_RIDE_CANCEL",
  "worker_wallet": "0x71C...9A2",
  "timestamp": 1679234912,
  "meta": {
    "wait_time": "48m",
    "weather_condition": "HEAVY_RAIN",
    "geo_lat": 40.7128,
    "geo_lon": -74.0060
  }
}`}
                    </pre>
                  </div>
                )}
                
                {verificationData.status === "VERIFYING" && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-[var(--accent-secondary)] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <span className="text-[var(--accent-secondary)]">STATUS: VERIFYING ON-CHAIN...</span>
                    </div>
                  </div>
                )}
                
                <div className="cursor-blink mt-4 text-[var(--terminal-green)]">
                  awaiting next event
                </div>
              </div>
            </div>

            {/* Verification Details */}
            <div className="space-y-6">
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-lg font-bold">Verification</h2>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                    #{verificationData.policyId}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Event Signal Received</p>
                      <p className="text-xs text-[var(--muted)] mt-1">Worker app triggered cancellation signal.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#a855f7] mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">External Data Query</p>
                        <span className="px-2 py-0.5 rounded text-xs bg-[#a855f7]/10 text-[#a855f7] font-medium">MATCH</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mb-2">Cross-referenced with OpenWeatherMap API.</p>
                      <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium">CONDITIONS</p>
                            <p className="text-xs text-[var(--muted)]">Heavy Rain (&gt;5mm/h)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ec4899] mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Smart Contract Execution</p>
                      <p className="text-xs text-[var(--muted)] mb-2">Verifying coverage terms...</p>
                      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#a855f7] rounded-full transition-all" style={{ width: `${verificationData.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--muted)] mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">USDC Payout Transfer</p>
                      <p className="text-xs text-[var(--muted)] mt-1">Pending contract approval.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border)] flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-medium hover:bg-[var(--accent)]/20 transition-colors">
                    <span className="text-sm">View on Etherscan</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button className="px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors">
                    <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Worker Location Map */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <h3 className="font-semibold">New York, US</h3>
                </div>
                <div className="aspect-square bg-[var(--background)] rounded-xl border border-[var(--border)] flex items-center justify-center relative overflow-hidden">
                  {/* Simple map representation */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Grid lines */}
                      {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((y) => (
                        <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="currentColor" strokeWidth="0.5" />
                      ))}
                      {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x) => (
                        <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="currentColor" strokeWidth="0.5" />
                      ))}
                      {/* Marker */}
                      <circle cx="100" cy="100" r="8" fill="var(--accent)" opacity="0.8">
                        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mx-auto mb-2">
                      <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-[var(--muted)] font-mono">Lat: 40.7128</p>
                    <p className="text-xs text-[var(--muted)] font-mono">Lon: -74.0060</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">WORKER LOCATION</p>
                  <p className="text-sm font-mono">Lat: 40.7128, Lon: -74.0060</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

