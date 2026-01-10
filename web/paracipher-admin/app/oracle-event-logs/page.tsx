"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../components/LeafletMap"), { ssr: false });

export default function OracleEventLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const initialLogs = [
      "14:02:11 SUCCESS Connection established to Chainlink Node #482 (Mumbai)",
      "14:02:45 INFO Heartbeat received from Worker Oracle Network (Delhi)",
      "14:03:12 EVENT Trip_Cancelled_High_Speed (ZOMATO_API)",
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const newLogs = [
        "14:03:15 QUERY Fetching weather data for Bangalore (Indiranagar) Coordinates...",
        "14:03:16 SUCCESS Oracle price feed updated: MATIC/USD = $0.85",
        "14:03:20 EVENT Accident Signal Detected (Gyroscope > 4G)",
        "14:03:25 INFO Reputation Score Updated for Driver #8821 (+5)",
        "14:03:28 QUERY Verification Request: UBER_TRIP_ID #99281",
        "14:03:32 SUCCESS Payout Triggered: 50,000 MATIC -> 0x77...2a",
      ];
      setLogs((prev) => {
        const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
        return [randomLog, ...prev.slice(0, 15)];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getLogColor = (log: string) => {
    if (log.includes("SUCCESS")) return "text-[var(--accent-success)]";
    if (log.includes("EVENT")) return "text-[var(--accent-primary)]";
    if (log.includes("QUERY")) return "text-[var(--accent-secondary)]";
    return "text-[var(--foreground)]";
  };

  const accidentLocation = {
    id: "ACC-88293",
    lat: 19.0760,
    lng: 72.8777,
    name: "CLAIM #88293 (Accident)",
    type: "accident" as const
  };

  return (
    <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col">
      {/* Tech Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">ORACLE_LOGS</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide">CHAINLINK & TELEMATICS STREAM</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--text-secondary)]">LAST_UPDATED: AUTO</span>
          <div className="w-2 h-2 bg-[var(--accent-success)] rounded-full animate-pulse" />
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Metrics Row */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">ACTIVE LISTENERS</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">124</h2>
              <span className="text-xs text-[var(--accent-success)]">+15 (Bangalore)</span>
            </div>
          </div>
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">EVENTS PROCESSED</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-[var(--accent-primary)]">8,492</h2>
              <span className="text-xs text-[var(--accent-primary)]">+15%</span>
            </div>
          </div>
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">TOTAL PAYOUTS (24H)</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-[var(--accent-success)]">350k MATIC</h2>
              <span className="text-xs text-[var(--accent-success)]">+8%</span>
            </div>
          </div>
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-secondary)] tracking-widest">AVG CONFIRMATION</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-[var(--accent-secondary)]">1.2s</h2>
              <span className="text-xs text-[var(--accent-success)]">POLYGON PoS</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]">&gt;</span>
            <input
              type="text"
              placeholder="FILTER_LOGS (e.g., 'Accident', '0x73...')"
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] p-2 pl-8 text-xs text-[var(--foreground)] focus:border-[var(--accent-primary)] outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'SUCCESS', 'WARN', 'ERROR'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] px-4 border ${filter === f ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--background)]' : 'bg-[var(--background)] border-[var(--card-border)] text-[var(--text-secondary)]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Terminal Stream */}
        <div className="lg:col-span-3 tech-border p-0 bg-[var(--background)] flex flex-col min-h-[500px]">
          <div className="p-3 border-b border-[var(--card-border)] bg-[var(--background-secondary)] flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-alert)]" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)]" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-success)]" />
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono ml-2">~/chainlink/event_stream.log</span>
            </div>
            <span className="text-[10px] text-[var(--accent-success)]">NET_LIVE</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-1 font-mono text-[11px] bg-[#050505]">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 hover:bg-[var(--card-hover)] px-2 py-0.5 ${getLogColor(log)} transition-colors`}>
                <span className="opacity-50 select-none">{(i + 1).toString().padStart(3, '0')}</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="text-[var(--accent-success)] mt-2 animate-pulse">_</div>
          </div>
        </div>

        {/* Side Verification Detail */}
        <div className="lg:col-span-1 space-y-6">
          <div className="tech-border p-4 bg-[var(--background-secondary)]">
            <div className="flex justify-between items-center mb-4 border-b border-[var(--card-border)] pb-2">
              <h3 className="text-xs font-bold tracking-widest">LATEST_VERIFICATION</h3>
              <span className="text-[10px] text-[var(--text-secondary)]">#CLM_88293</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 text-[10px]">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-[var(--accent-secondary)] rounded-full" />
                  <div className="w-[1px] h-full bg-[var(--card-border)] my-1" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">EVENT SIGNAL</p>
                  <p className="text-[var(--text-secondary)]">Driver triggered SOS.</p>
                </div>
              </div>

              <div className="flex gap-3 text-[10px]">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full" />
                  <div className="w-[1px] h-full bg-[var(--card-border)] my-1" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">DATA QUERY</p>
                  <p className="text-[var(--text-secondary)]">Checking Gyro & GPS...</p>
                  <div className="mt-1 p-2 border border-[var(--card-border)] bg-[var(--background)]">
                    MATCH: FORCE_IMPACT
                  </div>
                </div>
              </div>

              <div className="flex gap-3 text-[10px]">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-[var(--accent-success)] rounded-full" />
                </div>
                <div className="w-full">
                  <p className="font-bold text-[var(--foreground)]">CONTRACT EXEC</p>
                  <p className="text-[var(--text-secondary)] mb-1">ClaimApproved() Called...</p>
                  <div className="h-1 bg-[var(--card-border)] w-full">
                    <div className="h-full bg-[var(--accent-success)] w-[60%] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tech-border p-4 bg-[var(--background)]">
            <h3 className="text-xs font-bold tracking-widest mb-2">GEO_LOCATION</h3>
            <div className="aspect-square border border-[var(--card-border)] bg-[var(--background-secondary)] relative overflow-hidden flex items-center justify-center">
              <LeafletMap locations={[accidentLocation]} center={[accidentLocation.lat, accidentLocation.lng]} zoom={13} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
