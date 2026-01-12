import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694'; // Free Demo ID for testing

const providerMetadata = {
    name: 'ParaCipher',
    description: 'Decentralized Parametric Insurance',
    url: 'https://paracipher.app',
    icons: ['https://your-project-logo.com/logo.png'],
    redirect: {
        native: Linking.createURL(''),
        universal: 'paracipher.app'
    }
};

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: string;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    balance: '0.00',
    connectWallet: async () => { },
    disconnectWallet: async () => { },
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const { open, isConnected: isWCConnected, address: wcAddress, provider: wcProvider } = useWalletConnectModal();
    const [balance, setBalance] = useState('0.00'); // Default to 0.00 instead of mock value

    // Sync WalletConnect state with local state if needed, or just use WC state directly
    // logic: if WC is connected, we are connected.

    useEffect(() => {
        const fetchBalance = async () => {
            if (isWCConnected && wcAddress && wcProvider) {
                try {
                    // Save address to secure storage
                    await SecureStore.setItemAsync('wallet_address', wcAddress);

                    // Create Ethers Provider from WalletConnect Provider
                    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);

                    // Fetch Balance
                    console.log("Fetching balance for:", wcAddress);
                    const rawBalance = await ethersProvider.getBalance(wcAddress);
                    console.log("Raw Balance:", rawBalance.toString());
                    const formattedBalance = ethers.utils.formatEther(rawBalance);

                    // Format to display (e.g. 0.0050)
                    const displayBalance = parseFloat(formattedBalance).toFixed(4);
                    console.log("Display Balance:", displayBalance);
                    setBalance(displayBalance);
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                    setBalance('0.00'); // Fallback to 0
                }
            }
        };

        fetchBalance();
    }, [isWCConnected, wcAddress, wcProvider]);

    const connectWallet = async () => {
        if (isWCConnected) return;
        await open();
    };

    const disconnectWallet = async () => {
        if (wcProvider) {
            await wcProvider.disconnect();
        }
        await SecureStore.deleteItemAsync('wallet_address');
        setBalance('0.00');
    };

    return (
        <WalletContext.Provider value={{
            isConnected: isWCConnected,
            address: wcAddress || null,
            balance,
            connectWallet,
            disconnectWallet
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
