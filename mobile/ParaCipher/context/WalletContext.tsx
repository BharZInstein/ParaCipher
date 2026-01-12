import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NetworkService } from '../services/BlockchainService';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: string;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    provider: any; // Expose provider for blockchain transactions
}

const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    balance: '0.00',
    connectWallet: async () => { },
    disconnectWallet: async () => { },
    provider: null,
});

// WalletConnect Project ID - you need to get this from https://cloud.walletconnect.com/
const projectId = 'YOUR_PROJECT_ID_HERE'; // Replace with actual project ID

const providerMetadata = {
    name: 'ParaCipher',
    description: 'Decentralized Micro-Insurance for Gig Workers',
    url: 'https://paracipher.app',
    icons: ['https://paracipher.app/logo.png'],
    redirect: {
        native: 'paracipher://',
    }
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const { open, isConnected: isWCConnected, address: wcAddress, provider: wcProvider } = useWalletConnectModal();
    const [balance, setBalance] = useState('0.00');
    const [formattedAddress, setFormattedAddress] = useState<string | null>(null);

    // Format address when it changes
    useEffect(() => {
        if (wcAddress) {
            const formatted = `${wcAddress.slice(0, 6)}...${wcAddress.slice(-4)}`;
            setFormattedAddress(formatted);
            loadBalance(wcAddress);

            // Try to switch to Shardeum network
            if (wcProvider) {
                switchToShardeumNetwork();
            }
        } else {
            setFormattedAddress(null);
            setBalance('0.00');
        }
    }, [wcAddress, wcProvider]);

    const switchToShardeumNetwork = async () => {
        if (!wcProvider) return;

        try {
            console.log('[WalletContext] Switching to Shardeum network...');
            const result = await NetworkService.switchToShardeum(wcProvider);
            if (result.success) {
                console.log('[WalletContext] Successfully switched to Shardeum');
            } else {
                console.warn('[WalletContext] Could not switch network:', result.error);
                Alert.alert(
                    "Network Switch",
                    "Please manually switch to Shardeum network in your wallet app.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.warn('[WalletContext] Network switch error:', error);
        }
    };

    const loadBalance = async (addr: string) => {
        try {
            if (!wcProvider) {
                console.log('[WalletContext] No provider available for balance check');
                setBalance('0.00');
                return;
            }

            console.log('[WalletContext] Fetching balance for:', addr);

            // Create ethers provider from WalletConnect provider
            const ethersProvider = new ethers.BrowserProvider(wcProvider);
            const balance = await ethersProvider.getBalance(addr);
            const formattedBalance = ethers.formatEther(balance);
            const numericBalance = parseFloat(formattedBalance);
            const displayBalance = numericBalance.toFixed(2);
            setBalance(displayBalance);
            console.log('[WalletContext] Balance loaded:', displayBalance, 'SHM');
        } catch (error) {
            console.error('[WalletContext] Error loading balance:', error);
            setBalance('0.00');
        }
    };

    const connectWallet = async () => {
        try {
            console.log('[WalletContext] Opening WalletConnect modal...');
            await open();
        } catch (error: any) {
            console.error('[WalletContext] Connection error:', error);
            Alert.alert(
                "Connection Failed",
                error?.message || "Failed to connect wallet. Please try again."
            );
        }
    };

    const disconnectWallet = async () => {
        try {
            console.log('[WalletContext] Disconnecting wallet...');
            // WalletConnect disconnect is handled by the modal
            // Just reset local state
            setFormattedAddress(null);
            setBalance('0.00');
            await SecureStore.deleteItemAsync('wallet_address').catch(() => { });
            console.log('[WalletContext] Wallet disconnected');
        } catch (error) {
            console.error('[WalletContext] Disconnect error:', error);
        }
    };

    return (
        <WalletContext.Provider value={{
            isConnected: isWCConnected,
            address: formattedAddress,
            balance,
            connectWallet,
            disconnectWallet,
            provider: wcProvider, // Expose provider for transactions
        }}>
            {children}
            <WalletConnectModal
                projectId={projectId}
                providerMetadata={providerMetadata}
            />
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
