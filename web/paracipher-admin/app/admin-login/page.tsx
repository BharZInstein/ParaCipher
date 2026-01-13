"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function AdminLogin() {
    const router = useRouter();
    const { isAuthenticated, walletAddress, isLoading, login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleConnect = async () => {
        setError(null);
        setConnecting(true);
        try {
            await login();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err?.message || "Failed to connect wallet");
        } finally {
            setConnecting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] font-mono flex items-center justify-center">
                <div className="flex items-center gap-3 text-[var(--accent-primary)]">
                    <span className="w-4 h-4 border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] rounded-full animate-spin" />
                    <span className="text-sm tracking-widest">INITIALIZING...</span>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold tracking-[0.2em] text-[var(--foreground)] mb-2">ADMIN_ACCESS</h1>
                        <p className="text-[10px] text-[var(--accent-primary)] tracking-widest uppercase">
                            ParaCipher Admin Protocol v2.4
                        </p>
                    </div>

                    {/* MetaMask Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 border border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                                alt="MetaMask"
                                className="w-12 h-12"
                            />
                        </div>
                    </div>

                    {/* Connection Info */}
                    <div className="space-y-4 mb-8">
                        <div className="text-center">
                            <p className="text-xs text-[var(--text-secondary)] mb-2">
                                Connect your MetaMask wallet to access the admin dashboard
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 border border-[var(--accent-alert)]/30 bg-[var(--accent-alert)]/5 text-[var(--accent-alert)] text-xs text-center">
                            {error}
                        </div>
                    )}

                    {/* Status Indicators */}
                    <div className="flex justify-between items-center py-2 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[var(--accent-success)] rounded-full animate-pulse" />
                            <span className="text-[9px] text-[var(--text-secondary)]">NETWORK_READY</span>
                        </div>
                        <span className="text-[9px] text-[var(--text-secondary)]">CHAIN: POLYGON</span>
                    </div>

                    {/* Connect Button */}
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className={`w-full btn-tech h-14 text-sm font-bold tracking-widest flex items-center justify-center gap-3 group relative overflow-hidden ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {connecting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[var(--foreground)]/30 border-t-[var(--foreground)] rounded-full animate-spin" />
                                <span className="relative z-10">CONNECTING...</span>
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                                    alt="MetaMask"
                                    className="w-5 h-5 relative z-10"
                                />
                                <span className="relative z-10">CONNECT_METAMASK</span>
                                <span className="relative z-10 group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
                            </>
                        )}
                        <div className={`absolute inset-0 bg-[var(--accent-primary)]/10 translate-y-full group-hover:translate-y-0 transition-transform ${connecting ? 'translate-y-0 animate-pulse' : ''}`} />
                    </button>

                    {/* Footer Decoration */}
                    <div className="mt-8 pt-4 border-t border-[var(--card-border)] flex justify-between text-[9px] text-[var(--text-secondary)] font-mono">
                        <span>WALLET AUTHENTICATION</span>
                        <span>SECURE CHANNEL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
