"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function SmartContractStatus() {
  const executionLogs = [
    {
      status: "SUCCESS",
      event: "Payout Executed (Flight Delay Verified)",
      policyId: "POL-8821",
      value: "0.5 ETH",
      time: "2m ago",
    },
    {
      status: "SUCCESS",
      event: "Policy Created (New user registration)",
      policyId: "POL-8822",
      value: "-",
      time: "15m ago",
    },
    {
      status: "SUCCESS",
      event: "Oracle Update (Data feed refresh)",
      policyId: "SYS-ORC",
      value: "0.01 ETH",
      time: "1h ago",
    },
    {
      status: "PENDING",
      event: "Claim Analysis (Awaiting oracle data)",
      policyId: "POL-8819",
      value: "1.2 ETH",
      time: "2h ago",
    },
    {
      status: "SUCCESS",
      event: "Payout Executed (Rainfall threshold met)",
      policyId: "POL-8805",
      value: "0.3 ETH",
      time: "5h ago",
    },
  ];

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
                  <h1 className="text-3xl font-bold">Smart Contract Status</h1>
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] status-pulse" />
                    <span className="text-sm text-[var(--success)] font-medium">• Live</span>
                  </span>
                </div>
                <p className="text-[var(--muted)]">Real-time monitoring for parametric insurance protocol v1.2</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--danger)] text-white font-medium hover:bg-[var(--danger)]/90 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  EMERGENCY PAUSE
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[var(--background)] font-medium hover:bg-gray-100 transition-colors">
                  <span>ETHERSCAN</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-8">
          {/* Top Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* System Status */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-16.5 0a3 3 0 00-3 3v2.25a3 3 0 003 3h13.5a3 3 0 003-3v-2.25a3 3 0 00-3-3m-13.5 0V18.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">System Status</p>
                  <p className="text-2xl font-bold">Operational</p>
                </div>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--success)] rounded-full" style={{ width: "100%" }} />
              </div>
              <p className="text-xs text-[var(--muted)] mt-2 text-right">100%</p>
            </div>

            {/* Network */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Network</p>
                  <p className="text-2xl font-bold">Polygon</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">POS ID: 137</span>
                <span className="px-2 py-0.5 rounded text-xs bg-[var(--accent)]/10 text-[var(--accent)] font-medium">POS</span>
              </div>
            </div>

            {/* Gas Balance */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Gas Balance</p>
                  <p className="text-2xl font-bold">4.5 MATIC</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--success)] font-medium">Low Fees (&lt;30 Gwei)</span>
                <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Oracle Feeds */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Oracle Feeds</p>
                  <p className="text-2xl font-bold">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm text-[var(--success)] font-medium">Chainlink Verified</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Details */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[var(--accent)] rounded-full" />
                <h2 className="text-lg font-bold uppercase tracking-wider">Contract Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-2">Contract Address</label>
                  <div className="flex items-center gap-2 p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                    <span className="font-mono text-sm flex-1">0x71C7656EC7ab88b098defB751B7401B5f6d8976A21</span>
                    <button className="p-2 hover:bg-[var(--card)] rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted)]">Owner</span>
                  <span className="font-mono text-sm">• 0x88A7656EC7ab88b098defB751B7401B5f6d8976A44</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted)]">Created</span>
                  <span className="text-sm">Oct 12, 2023</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted)]">Total Payouts</span>
                  <span className="text-sm font-medium">145.2 ETH</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-[var(--muted)]">Version</span>
                  <span className="px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">v1.2.4</span>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[var(--accent)] rounded-full" />
                <h2 className="text-lg font-bold uppercase tracking-wider">Health Metrics</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--muted)]">API Latency</span>
                    <span className="text-sm font-medium text-[var(--accent-secondary)]">24ms</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent-secondary)] rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--muted)]">Success Rate</span>
                    <span className="text-sm font-medium text-[var(--success)]">99.9%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--success)] rounded-full" style={{ width: "99.9%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--muted)]">Buffer Usage</span>
                    <span className="text-sm font-medium text-[#a855f7]">42%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#a855f7] rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Log */}
            <div className="lg:col-span-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-[var(--warning)] rounded-full" />
                  <h2 className="text-lg font-bold uppercase tracking-wider">Execution Log</h2>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Log Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
                      <th className="pb-3 font-medium">STATUS</th>
                      <th className="pb-3 font-medium">EVENT / TRIGGER</th>
                      <th className="pb-3 font-medium">POLICY ID</th>
                      <th className="pb-3 font-medium">VALUE</th>
                      <th className="pb-3 font-medium">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {executionLogs.map((log, index) => (
                      <tr key={index} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors">
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            log.status === "SUCCESS"
                              ? "bg-[var(--success)]/10 text-[var(--success)]"
                              : "bg-[var(--warning)]/10 text-[var(--warning)]"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-4">{log.event}</td>
                        <td className="py-4 font-mono text-[var(--accent)]">{log.policyId}</td>
                        <td className="py-4 font-mono">{log.value}</td>
                        <td className="py-4 text-[var(--muted)]">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button className="text-sm text-[var(--accent)] hover:text-[var(--accent-secondary)] transition-colors">
                  View all transactions →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

