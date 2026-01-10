"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        adminId: "ADMIN_001",
        accessKey: "",
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate auth delay
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] font-mono flex flex-col items-center justify-center relative overflow-hidden">
            {/* Scanline Background */}
            <div className="scanline-effect fixed inset-0 z-0 opacity-20 pointer-events-none" />

            {/* Hexagon Grid Background */}
            <div className="fixed inset-0 z-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, var(--accent-secondary) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            <div className="z-10 w-full max-w-md p-8 relative">
                {/* Tech Box Container */}
                <div className="tech-border bg-[var(--background-secondary)]/80 backdrop-blur-sm p-8 relative">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-[0.2em] text-[var(--foreground)] mb-2">SECURE_LOGIN</h1>
                        <p className="text-[10px] text-[var(--accent-primary)] tracking-widest uppercase">
                            ParaCipher Admin Protocol v2.4
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Input Group: Admin ID */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-[var(--text-secondary)] tracking-widest block">ADMIN_IDENTIFIER</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-primary)] opacity-50 group-focus-within:opacity-100 transition-opacity">#</span>
                                <input
                                    type="text"
                                    value={formData.adminId}
                                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 pl-8 text-xs text-[var(--foreground)] focus:border-[var(--accent-primary)] outline-none transition-colors font-bold tracking-wider"
                                />
                            </div>
                        </div>

                        {/* Input Group: Key */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-[var(--text-secondary)] tracking-widest block">ACCESS_KEY (256-BIT)</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-alert)] opacity-50 group-focus-within:opacity-100 transition-opacity">*</span>
                                <input
                                    type="password"
                                    value={formData.accessKey}
                                    onChange={(e) => setFormData({ ...formData, accessKey: e.target.value })}
                                    placeholder="••••••••••••••••"
                                    className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 pl-8 text-xs text-[var(--foreground)] focus:border-[var(--accent-alert)] outline-none transition-colors tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[var(--accent-success)] rounded-full animate-pulse" />
                                <span className="text-[9px] text-[var(--text-secondary)]">UPLINK_ESTABLISHED</span>
                            </div>
                            <span className="text-[9px] text-[var(--text-secondary)]">LATENCY: 4ms</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-tech h-12 text-sm font-bold tracking-widest flex items-center justify-center gap-3 group relative overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="relative z-10">{loading ? 'AUTHENTICATING...' : 'INITIATE_HANDSHAKE'}</span>
                            {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform">&gt;&gt;</span>}
                            <div className={`absolute inset-0 bg-[var(--accent-primary)]/10 translate-y-full group-hover:translate-y-0 transition-transform ${loading ? 'translate-y-0 animate-pulse' : ''}`} />
                        </button>

                    </form>

                    {/* Footer Decoration */}
                    <div className="mt-8 pt-4 border-t border-[var(--card-border)] flex justify-between text-[9px] text-[var(--text-secondary)] font-mono">
                        <span>SECURE CHANNEL ENCRYPTED</span>
                        <span>ID: 0x992...81A</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
