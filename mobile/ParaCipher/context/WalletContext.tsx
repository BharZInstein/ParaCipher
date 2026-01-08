import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

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
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState('0.00');

    // Load persisted state
    useEffect(() => {
        loadWalletState();
    }, []);

    const loadWalletState = async () => {
        try {
            const storedAddress = await AsyncStorage.getItem('wallet_address');
            if (storedAddress) {
                setAddress(storedAddress);
                setIsConnected(true);
                setBalance('1,240.50'); // Mock balance
            }
        } catch (e) {
            console.error("Failed to load wallet state", e);
        }
    };

    const connectWallet = async () => {
        // Simulate connection delay
        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const mockAddress = "0x71C...9A23";
                setAddress(mockAddress);
                setIsConnected(true);
                setBalance('1,240.50');
                await AsyncStorage.setItem('wallet_address', mockAddress);
                Alert.alert("Wallet Connected", "Successfully connected to ParaCipher Wallet");
                resolve();
            }, 1000);
        });
    };

    const disconnectWallet = async () => {
        setAddress(null);
        setIsConnected(false);
        setBalance('0.00');
        await AsyncStorage.removeItem('wallet_address');
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, balance, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
