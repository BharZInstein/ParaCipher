"use client";

import { useState } from "react";
import Image from "next/image";

export default function TechSystemOverview() {
  const [activeTab, setActiveTab] = useState("topology");

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-mono text-xs">
      {/* Header Panel */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background-secondary)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">
              SYSTEM_OVERVIEW <span className="text-[var(--accent-secondary)]">V.2.4</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 tracking-wide">
              INFRASTRUCTURE TOPOLOGY & NETWORK HEALTH
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("topology")}
              className={`btn-tech ${activeTab === "topology" ? "border-[var(--accent-primary)] bg-[var(--card-hover)]" : ""}`}
            >
              [TOPOLOGY_MAP]
            </button>
            <button
              onClick={() => setActiveTab("allocations")}
              className={`btn-tech ${activeTab === "allocations" ? "border-[var(--accent-primary)] bg-[var(--card-hover)]" : ""}`}
            >
              [RESOURCE_ALLOCATION]
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Network Topology Visual */}
        <section className="lg:col-span-2 tech-border p-0 relative overflow-hidden bg-[var(--background)] min-h-[500px] flex items-center justify-center">
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-success)] animate-pulse" />
              <span className="tracking-widest text-[var(--foreground)]">LIVE MAP</span>
            </div>
            <div className="mt-2 text-[var(--text-secondary)]">
              NODES: 156<br />
              CONNECTIONS: 4,829
            </div>
          </div>

          {/* Abstract Network Graph */}
          <div className="relative w-full h-full">
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 border-2 border-[var(--accent-primary)] rounded-full flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md">
                <span className="font-bold text-[var(--foreground)]">CORE</span>
              </div>
              <div className="absolute inset-0 border border-[var(--dashed)] rounded-full animate-ping opacity-20" />
            </div>

            {/* Satellite Nodes */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-12 h-12 border border-[var(--card-border)] bg-[var(--background-secondary)] flex items-center justify-center"
                style={{
                  top: `${50 + 30 * Math.sin(i * Math.PI / 3)}%`,
                  left: `${50 + 30 * Math.cos(i * Math.PI / 3)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="text-[10px] text-[var(--text-secondary)]">N-0{i + 1}</span>
                {/* Connector Line */}
                <div
                  className="absolute bg-[var(--card-border)] h-[1px]"
                  style={{
                    width: '100px',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'left center',
                    transform: `rotate(${180 + i * 60}deg)`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Grid Overlay */}
          <div className="grid-overlay absolute inset-0 opacity-30 pointer-events-none" />
        </section>

        {/* Right: Metrics & Details */}
        <aside className="space-y-6">
          {/* Node Health */}
          <div className="tech-border p-4 corner-accent bg-[var(--background-secondary)]">
            <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2">
              NODE_HEALTH_METRICS
            </h3>
            <div className="space-y-4">
              {[
                { label: "LATENCY", value: "12ms", status: "good" },
                { label: "THROUGHPUT", value: "4.2 GB/s", status: "good" },
                { label: "ERROR RATE", value: "0.001%", status: "good" },
                { label: "SYNC STATUS", value: "99.9%", status: "warning" },
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-${metric.status === "good" ? "[var(--accent-success)]" : "[var(--accent-secondary)]"} font-bold`}>
                      {metric.value}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-sm bg-${metric.status === "good" ? "[var(--accent-success)]" : "[var(--accent-secondary)]"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="tech-border p-4 corner-accent bg-[var(--background)]">
            <h3 className="text-xs font-bold tracking-widest mb-4 border-b border-[var(--card-border)] pb-2">
              GEO_DISTRIBUTION
            </h3>
            <div className="space-y-2">
              {[
                { region: "ASIA-PACIFIC", count: 45, width: "60%" },
                { region: "NORTH AMERICA", count: 32, width: "45%" },
                { region: "EUROPE", count: 28, width: "38%" },
                { region: "SOUTH AMERICA", count: 12, width: "20%" },
              ].map((geo) => (
                <div key={geo.region}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>{geo.region}</span>
                    <span>{geo.count} NODES</span>
                  </div>
                  <div className="w-full bg-[var(--card-border)] h-1.5">
                    <div
                      className="h-full bg-[var(--accent-primary)]"
                      style={{ width: geo.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Bottom: Alert Stream */}
        <section className="lg:col-span-3 tech-border p-0 bg-[var(--background)] h-48 flex flex-col">
          <div className="p-3 border-b border-[var(--card-border)] bg-[var(--card)]">
            <h3 className="text-xs font-bold tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span>
              SYSTEM_ALERTS
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
            {[
              { time: "20:04:12", level: "INFO", msg: "Load balancing protocol initiated on shard #4" },
              { time: "20:03:55", level: "WARN", msg: "High latency detected in us-east-1 relay" },
              { time: "20:02:10", level: "INFO", msg: "New validator connected: val-0x8f...2e" },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 border-b border-[var(--card-border)]/50 pb-1 last:border-0">
                <span className="text-[var(--text-secondary)]">{alert.time}</span>
                <span className={`${alert.level === "WARN" ? "text-[var(--accent-alert)]" : "text-[var(--accent-success)]"}`}>
                  [{alert.level}]
                </span>
                <span className="text-[var(--foreground)]">{alert.msg}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
