import AsyncStorage from '@react-native-async-storage/async-storage';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { ethers } from 'ethers';

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

// Inner component that uses the SDK
const WalletProviderInner = ({ children }: { children: React.ReactNode }) => {
    const { sdk, connected, connecting, account, provider } = useSDK();
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState('0.00');

    // Sync SDK state with local state
    useEffect(() => {
        console.log('[WalletContext] SDK state changed:', { connected, account, connecting });
        
        if (connected && account) {
            const formattedAddress = formatAddress(account);
            setAddress(formattedAddress);
            setIsConnected(true);
            // Load balance asynchronously to avoid blocking render
            setTimeout(() => {
                loadBalance(account);
            }, 0);
            saveWalletState(account); // Save full address, not formatted
        } else if (!connecting) {
            // Only reset if not currently connecting
            setIsConnected(false);
            setAddress(null);
            setBalance('0.00');
        }
    }, [connected, account, connecting]);

    // Load persisted state on mount (only after SDK is ready)
    useEffect(() => {
        // Delay to ensure SDK is fully initialized
        const timer = setTimeout(() => {
            if (connected && account) {
                loadWalletState();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [connected, account]);

    const formatAddress = (addr: string): string => {
        if (!addr) return '';
        if (addr.length < 10) return addr;
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    const loadWalletState = async () => {
        try {
            const storedAddress = await AsyncStorage.getItem('wallet_address');
            if (storedAddress) {
                console.log('[WalletContext] Found stored wallet address:', storedAddress);
                // Don't auto-connect, just log that we found it
                // User needs to manually connect via button
            }
        } catch (e) {
            console.error('[WalletContext] Failed to load wallet state', e);
        }
    };

    const saveWalletState = async (addr: string) => {
        try {
            await AsyncStorage.setItem('wallet_address', addr);
            console.log('[WalletContext] Saved wallet address:', addr);
        } catch (e) {
            console.error('[WalletContext] Failed to save wallet state', e);
        }
    };

    const loadBalance = async (addr: string) => {
        try {
            if (!provider) {
                console.log('[WalletContext] No provider available for balance check');
                setBalance('0.00');
                return;
            }

            console.log('[WalletContext] Fetching balance for:', addr);
            
            // Use provider to get balance
            const balance = await provider.getBalance(addr);
            const formattedBalance = ethers.formatEther(balance);
            const numericBalance = parseFloat(formattedBalance);
            const displayBalance = numericBalance.toFixed(2);
            setBalance(displayBalance);
            console.log('[WalletContext] Balance loaded:', displayBalance, 'MATIC');
        } catch (error) {
            console.error('[WalletContext] Error loading balance:', error);
            // Set a default or try again later
            setBalance('0.00');
        }
    };

    const connectWallet = async () => {
        try {
            console.log('[WalletContext] Connect wallet initiated');
            
            if (!sdk) {
                console.error('[WalletContext] SDK not initialized');
                Alert.alert("Error", "Wallet service is not ready. Please try again.");
                return;
            }
            
            if (connecting) {
                console.log('[WalletContext] Connection already in progress');
                return;
            }

            if (connected && account) {
                console.log('[WalletContext] Already connected:', account);
                return;
            }

            console.log('[WalletContext] Requesting connection from MetaMask...');
            
            // Request connection - this will open MetaMask app via deep link
            const accounts = await sdk.connect();
            
            console.log('[WalletContext] Connection response:', accounts);
            
            if (accounts && accounts.length > 0) {
                const formattedAddress = formatAddress(accounts[0]);
                setAddress(formattedAddress);
                setIsConnected(true);
                await saveWalletState(accounts[0]);
                await loadBalance(accounts[0]);
                
                console.log('[WalletContext] Wallet connected successfully:', formattedAddress);
                Alert.alert(
                    "Wallet Connected",
                    `Successfully connected to MetaMask\n\nAddress: ${formattedAddress}`,
                    [{ text: "OK" }]
                );
            } else {
                console.log('[WalletContext] No accounts returned from connection');
                throw new Error('No accounts returned');
            }
        } catch (error: any) {
            console.error('[WalletContext] Connection error:', error);
            
            // Check if user cancelled
            if (error?.message?.includes('User rejected') || error?.message?.includes('cancelled')) {
                Alert.alert("Connection Cancelled", "You cancelled the MetaMask connection request.");
            } else if (error?.message?.includes('MetaMask not installed')) {
                Alert.alert(
                    "MetaMask Not Found",
                    "Please install MetaMask mobile app to connect your wallet.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Install",
                            onPress: () => {
                                const url = Platform.OS === 'ios'
                                    ? 'https://apps.apple.com/app/metamask/id1438144202'
                                    : 'https://play.google.com/store/apps/details?id=io.metamask';
                                Linking.openURL(url);
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Connection Failed",
                    error?.message || "Failed to connect to MetaMask. Please try again."
                );
            }
        }
    };

    const disconnectWallet = async () => {
        try {
            console.log('[WalletContext] Disconnecting wallet...');
            
            if (sdk) {
                await sdk.terminate();
            }
            
            setAddress(null);
            setIsConnected(false);
            setBalance('0.00');
            await AsyncStorage.removeItem('wallet_address');
            
            console.log('[WalletContext] Wallet disconnected');
        } catch (error) {
            console.error('[WalletContext] Disconnect error:', error);
        }
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, balance, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

// Outer provider that wraps with MetaMask SDK
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MetaMaskProvider
            options={{
                dappMetadata: {
                    name: "ParaCipher",
                    url: "https://paracipher.app",
                },
                infuraAPIKey: undefined, // Optional: Add your Infura key if needed
                // Use deep linking for mobile
                communicationServerUrl: undefined, // Let SDK use default
                enableAnalytics: false,
                // Deep linking configuration
                shouldShimWeb3: false,
                // Prevent auto-connection attempts
                checkInstallationImmediately: false,
            }}
        >
            <WalletProviderInner>{children}</WalletProviderInner>
        </MetaMaskProvider>
    );
};

export const useWallet = () => useContext(WalletContext);
