"use client";

import { useSDK } from "@metamask/sdk-react";
import { useState, useEffect } from "react";

export const ConnectWallet = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const [account, setAccount] = useState<string>();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };

    const disconnect = () => {
        if (sdk) {
            sdk.terminate();
            setAccount(undefined);
        }
    }

    // Effect to update account if already connected
    useEffect(() => {
        if (connected && provider) {
            // @ts-ignore provider is any
            const accounts = provider.getSelectedAddress();
            // Or request accounts if needed, but getSelectedAddress is sync usually if populated
            if (accounts) {
                setAccount(accounts);
            } else {
                // Try to get via request
                // @ts-ignore
                provider.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                    if (accounts && accounts[0]) setAccount(accounts[0]);
                })
            }
        } else {
            setAccount(undefined);
        }
    }, [connected, provider]);


    if (account) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                    onClick={disconnect}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            disabled={connecting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {connecting ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                        alt="MetaMask"
                        className="w-5 h-5"
                    />
                    Connect Wallet
                </>
            )}
        </button>
    );
};
