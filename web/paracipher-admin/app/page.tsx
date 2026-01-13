"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BinaryRain from "./components/BinaryRain";
import { ConnectWallet } from "../components/ConnectWallet";

export default function LandingPage() {
  const [activeWorkers, setActiveWorkers] = useState(14205);
  const [claimsPaid, setClaimsPaid] = useState(892);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setActiveWorkers(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] relative flex flex-col font-sans overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--background)]">

      {/* Interactive Binary Background */}
      <BinaryRain />

      {/* Scanline Effect Overlay */}
      <div className="scanline-effect fixed inset-0 z-50 pointer-events-none opacity-[0.03]" />

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[var(--background-secondary)]/90 backdrop-blur-md border-b border-[var(--card-border)]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-40 h-10">
              <Image
                src="/ParaCipher.png"
                alt="ParaCipher Logo"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
          <nav className="hidden md:flex gap-10 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--foreground)] transition-colors relative group">
              FEATURES
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#stats" className="hover:text-[var(--foreground)] transition-colors relative group">
              LIVE_DATA
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#how-it-works" className="hover:text-[var(--foreground)] transition-colors relative group">
              PROTOCOL
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <ConnectWallet />
            <Link href="/login">
              <button className="btn-tech px-8 py-3 text-[10px] font-bold tracking-[0.15em] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all">
                LAUNCH APP_
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center relative">

          {/* Decorative Lines */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[var(--card-border)]" />



          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-[var(--foreground)] mb-8 leading-[0.9]">
            INSTANT INSURANCE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-secondary)] to-[var(--foreground)] opacity-50">FOR GIG WORKERS</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            Algorithmic protection. Zero human bias.
            <br />
            <span className="text-[var(--foreground)] font-bold">₹25/day coverage</span> → <span className="text-[var(--accent-success)] font-bold">₹50,000 instant payouts</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/login">
              <button className="group relative btn-tech h-16 px-12 text-xs font-bold tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] hover:bg-transparent hover:text-[var(--foreground)] border border-[var(--foreground)] overflow-hidden">
                <span className="relative z-10 group-hover:translate-x-1 transition-transform inline-block">DEPLOY POLICY</span>
                <span className="ml-2 relative z-10 group-hover:translate-x-2 transition-transform inline-block">→</span>
                <div className="absolute inset-0 bg-[var(--background)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              </button>
            </Link>
            <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer">
              <button className="btn-tech h-16 px-12 text-xs font-bold tracking-[0.2em] text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]">
                VIEW CONTRACTS
              </button>
            </a>
          </div>

          {/* Live Stats */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--card-border)]/50 backdrop-blur-sm border border-[var(--card-border)] max-w-5xl mx-auto">
            <div className="bg-[var(--background)]/80 p-8 text-center hover:bg-[var(--background-secondary)] transition-colors group">
              <p className="text-3xl md:text-4xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-success)] transition-colors">{activeWorkers.toLocaleString()}</p>
              <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] mt-2 uppercase">Active Nodes</p>
            </div>
            <div className="bg-[var(--background)]/80 p-8 text-center hover:bg-[var(--background-secondary)] transition-colors group">
              <p className="text-3xl md:text-4xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">{claimsPaid}</p>
              <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] mt-2 uppercase">Claims Settled</p>
            </div>
            <div className="bg-[var(--background)]/80 p-8 text-center hover:bg-[var(--background-secondary)] transition-colors group">
              <p className="text-3xl md:text-4xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-secondary)] transition-colors">1.2s</p>
              <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] mt-2 uppercase">Finality</p>
            </div>
            <div className="bg-[var(--background)]/80 p-8 text-center hover:bg-[var(--background-secondary)] transition-colors group">
              <p className="text-3xl md:text-4xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-alert)] transition-colors">12.5%</p>
              <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] mt-2 uppercase">Yield APY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-[var(--card-border)] bg-[var(--background-secondary)] py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-4xl font-bold tracking-tighter text-[var(--foreground)]">PROTOCOL<br />FEATURES</h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-md text-right mt-4 md:mt-0">
              Trustless infrastructure powered by Chainlink Oracles<br />and Polygon PoS security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="tech-border p-8 group hover:bg-[var(--card-hover)] transition-all duration-500 cursor-default bg-[var(--background-secondary)]/80 backdrop-blur-sm">
              <div className="w-12 h-12 border border-[var(--accent-success)]/30 bg-[var(--accent-success)]/5 flex items-center justify-center mb-6 group-hover:border-[var(--accent-success)] transition-colors">
                <span className="text-[var(--accent-success)] text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold tracking-widest text-[var(--foreground)] mb-4">INSTANT SETTLEMENT</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
                Smart contracts execute payouts immediately upon Oracle verification. Eliminates claims adjusters and administrative lag.
              </p>
              <div className="mt-8 h-[1px] w-full bg-[var(--card-border)] relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-full bg-[var(--accent-success)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="tech-border p-8 group hover:bg-[var(--card-hover)] transition-all duration-500 cursor-default bg-[var(--background-secondary)]/80 backdrop-blur-sm">
              <div className="w-12 h-12 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 flex items-center justify-center mb-6 group-hover:border-[var(--accent-primary)] transition-colors">
                <span className="text-[var(--accent-primary)] text-xl">🛡️</span>
              </div>
              <h3 className="text-lg font-bold tracking-widest text-[var(--foreground)] mb-4">SHIFT-BASED COVERAGE</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
                24-hour micro-policies. Workers pay only when they drive. Auto-expiry creates capital efficiency and flexibility.
              </p>
              <div className="mt-8 h-[1px] w-full bg-[var(--card-border)] relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-full bg-[var(--accent-primary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-100" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="tech-border p-8 group hover:bg-[var(--card-hover)] transition-all duration-500 cursor-default bg-[var(--background-secondary)]/80 backdrop-blur-sm">
              <div className="w-12 h-12 border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/5 flex items-center justify-center mb-6 group-hover:border-[var(--accent-secondary)] transition-colors">
                <span className="text-[var(--accent-secondary)] text-xl">📈</span>
              </div>
              <h3 className="text-lg font-bold tracking-widest text-[var(--foreground)] mb-4">ON-CHAIN REPUTATION</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
                SBTs (Soulbound Tokens) track safety history. Proven safe drivers unlock premium pools and up to 20% discounts.
              </p>
              <div className="mt-8 h-[1px] w-full bg-[var(--card-border)] relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-full bg-[var(--accent-secondary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-[var(--card-border)] py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tighter text-center text-[var(--foreground)] mb-20">EXECUTION FLOW</h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-[var(--card-border)] md:left-1/2 md:-translate-x-1/2" />

            {/* Steps Container */}
            <div className="space-y-16">

              {/* Step 1 */}
              <div className="relative grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-12 items-center">
                <div className="order-2 md:order-1 md:text-right">
                  <h3 className="text-sm font-bold text-[var(--foreground)] mb-2 tracking-widest uppercase">Coverage Init</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Driver initiates <span className="font-mono text-[var(--accent-primary)]">`buyDailyCoverage()`</span> via app.<br />25 MATIC locked in pool.</p>
                </div>
                <div className="order-1 md:order-2 flex justify-center z-10">
                  <div className="w-12 h-12 border bg-[var(--background)] border-[var(--card-border)] flex items-center justify-center shrink-0 text-[var(--foreground)] font-bold text-sm">01</div>
                </div>
                <div className="hidden md:block order-3" />
              </div>

              {/* Step 2 */}
              <div className="relative grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-12 items-center">
                <div className="hidden md:block order-1" />
                <div className="order-1 md:order-2 flex justify-center z-10">
                  <div className="w-12 h-12 border bg-[var(--background)] border-[var(--accent-secondary)] flex items-center justify-center shrink-0 text-[var(--accent-secondary)] font-bold text-sm">02</div>
                </div>
                <div className="order-2 md:order-3 text-left">
                  <h3 className="text-sm font-bold text-[var(--foreground)] mb-2 tracking-widest uppercase">Event Detection</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Off-chain Oracle verifies accident parameters via<br />GPS, Gyroscope & Police APIs.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-12 items-center">
                <div className="order-2 md:order-1 md:text-right">
                  <h3 className="text-sm font-bold text-[var(--foreground)] mb-2 tracking-widest uppercase">Value Transfer</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Contract releases <span className="font-mono text-[var(--accent-success)]">`50,000 MATIC`</span> to worker.<br />Average finality: 1.2 seconds.</p>
                </div>
                <div className="order-1 md:order-2 flex justify-center z-10">
                  <div className="w-12 h-12 border bg-[var(--background)] border-[var(--accent-success)] flex items-center justify-center shrink-0 text-[var(--accent-success)] font-bold text-sm animate-pulse">03</div>
                </div>
                <div className="hidden md:block order-3" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] bg-[var(--background-secondary)] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="relative w-5 h-5">
                {/* Mini Logo for Footer */}
                <Image src="/ParaCipher.png" alt="ParaCipher" fill className="object-contain" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--text-secondary)]">PARACIPHER</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] ml-8">© 2026 DECENTRALIZED PROTOCOL</p>
          </div>

          <div className="flex gap-8 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Audit Report</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Github</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
