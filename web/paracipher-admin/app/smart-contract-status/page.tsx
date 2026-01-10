"use client";

export default function SmartContractStatus() {
  const executionLogs = [
    { status: "SUCCESS", event: "Payout Executed (Accident Verified)", policyId: "CLM-8821", value: "50,000 MATIC", time: "2m ago" },
    { status: "SUCCESS", event: "Policy Purchased (Daily Coverage)", policyId: "POL-9942", value: "25 MATIC", time: "15m ago" },
    { status: "SUCCESS", event: "Oracle Update (Chainlink Keeper)", policyId: "SYS-ORC", value: "-", time: "1h ago" },
    { status: "PENDING", event: "Claim Analysis (Awaiting Police API)", policyId: "CLM-8819", value: "50,000 MATIC", time: "2h ago" },
    { status: "SUCCESS", event: "Reputation Updated (+5 Safe Day)", policyId: "REP-4402", value: "+5 PTS", time: "5h ago" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
      {/* Tech Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">SMART_CONTRACTS</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">PARACIPHER PROTOCOL V2</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-tech py-2 px-4 text-xs bg-[var(--accent-alert)]/10 text-[var(--accent-alert)] border-[var(--accent-alert)] hover:bg-[var(--accent-alert)] hover:text-white">
            EMERGENCY PAUSE (MULTISIG)
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Top Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">SYSTEM_STATUS</span>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
              <span className="text-xl font-bold text-[var(--foreground)]">OPERATIONAL</span>
            </div>
          </div>

          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">NETWORK</span>
            <div className="mt-2 flex justify-between items-end">
              <span className="text-xl font-bold text-[var(--accent-primary)]">POLYGON PoS</span>
              <span className="text-xs text-[var(--text-secondary)]">Heimdall: OK</span>
            </div>
          </div>

          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">GAS_BALANCE (RELAYER)</span>
            <div className="mt-2">
              <span className="text-xl font-bold text-[var(--foreground)]">450 MATIC</span>
              <p className="text-[10px] text-[var(--accent-success)] mt-1">FEES: LOW</p>
            </div>
          </div>

          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">ORACLE_FEEDS</span>
            <div className="mt-2">
              <span className="text-xl font-bold text-[var(--accent-success)]">CONNECTED</span>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">CHAINLINK: VERIFIED</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contract Details */}
          <div className="tech-border p-6 bg-[var(--background-secondary)]">
            <h3 className="text-xs font-bold tracking-widest mb-6 border-b border-[var(--card-border)] pb-4">CORE_CONTRACTS</h3>
            <div className="space-y-4 text-xs font-mono">

              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[var(--text-secondary)] font-bold">INSURANCE_POLICY.SOL</label>
                  <span className="text-[var(--accent-success)] text-[10px]">ACTIVE</span>
                </div>
                <div className="p-2 border border-[var(--card-border)] bg-[var(--background)] text-[var(--accent-primary)] truncate flex justify-between">
                  <span>0x71C...6A21</span>
                  <span className="text-[var(--text-secondary)]">[Coverage Sales]</span>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[var(--text-secondary)] font-bold">CLAIM_PAYOUT.SOL</label>
                  <span className="text-[var(--accent-success)] text-[10px]">ACTIVE</span>
                </div>
                <div className="p-2 border border-[var(--card-border)] bg-[var(--background)] text-[var(--accent-primary)] truncate flex justify-between">
                  <span>0x88A...9B33</span>
                  <span className="text-[var(--text-secondary)]">[Payout Logic]</span>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[var(--text-secondary)] font-bold">REPUTATION_SCORE.SOL</label>
                  <span className="text-[var(--accent-success)] text-[10px]">ACTIVE</span>
                </div>
                <div className="p-2 border border-[var(--card-border)] bg-[var(--background)] text-[var(--accent-primary)] truncate flex justify-between">
                  <span>0x22F...1C99</span>
                  <span className="text-[var(--text-secondary)]">[SBT Logic]</span>
                </div>
              </div>

            </div>
          </div>

          {/* Execution Log */}
          <div className="tech-border p-0 bg-[var(--background)] flex flex-col">
            <div className="p-4 border-b border-[var(--card-border)] bg-[var(--background-secondary)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-widest">EXECUTION_LOG</h3>
              <button className="text-[10px] text-[var(--accent-primary)] hover:underline">VIEW_POLYGONSCAN</button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[var(--text-secondary)] border-b border-[var(--card-border)]">
                  <tr>
                    <th className="p-3 font-normal">STATUS</th>
                    <th className="p-3 font-normal">EVENT</th>
                    <th className="p-3 font-normal">ID</th>
                    <th className="p-3 font-normal">VAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {executionLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-[var(--card-hover)]">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] ${log.status === 'SUCCESS' ? 'text-[var(--accent-success)] bg-[var(--accent-success)]/10' : 'text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--foreground)]">{log.event}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{log.policyId}</td>
                      <td className="p-3 font-mono">{log.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
