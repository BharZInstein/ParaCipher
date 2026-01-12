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
    chainId: number | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    provider: any; // Expose provider for blockchain transactions
    switchNetwork: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    balance: '0.00',
    chainId: null,
    connectWallet: async () => { },
    disconnectWallet: async () => { },
    provider: null,
    switchNetwork: async () => { },
});

// WalletConnect Project ID - from environment variable
const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

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
    const [chainId, setChainId] = useState<number | null>(null);

    const checkChainId = async () => {
        if (wcProvider) {
            try {
                const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
                const network = await ethersProvider.getNetwork();
                setChainId(network.chainId);
            } catch (error) {
                console.log("Error getting chain ID:", error);
            }
        }
    };

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

            // Create ethers provider from WalletConnect provider (v5)
            const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
            const balance = await ethersProvider.getBalance(addr);
            const formattedBalance = ethers.utils.formatEther(balance);
            const numericBalance = parseFloat(formattedBalance);
            const displayBalance = numericBalance.toFixed(2);
            setBalance(displayBalance);
            console.log('[WalletContext] Balance loaded:', displayBalance, 'SHM');
        } catch (error) {
            console.error('[WalletContext] Error loading balance:', error);
            setBalance('0.00');
        }
    };

    // Listen for chain changes from the wallet
    useEffect(() => {
        if (wcProvider) {
            wcProvider.on("chainChanged", (newChainId: any) => {
                // handle hex string or number
                const id = typeof newChainId === 'string' ? parseInt(newChainId, 16) : newChainId;
                setChainId(id);
            });
            // Cleanup? wcProvider might not change often but good practice if it does
            return () => {
                if (wcProvider.removeListener) {
                    wcProvider.removeListener("chainChanged", () => { }); // specific handler removal requires ref, simplified here
                }
            };
        }
    }, [wcProvider]);

    useEffect(() => {
        if (isWCConnected && wcAddress && wcProvider) {
            const fetchBalance = async () => {
                try {
                    // Save address to secure storage
                    await SecureStore.setItemAsync('wallet_address', wcAddress);

                    // Create Ethers Provider from WalletConnect Provider
                    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);

                    // Get Network & Balance
                    const network = await ethersProvider.getNetwork();
                    setChainId(network.chainId);

                    console.log("Fetching balance for:", wcAddress, "on chain:", network.chainId);

                    let balanceProvider: ethers.providers.Provider = ethersProvider;
                    // Use direct RPC for known chains to avoid WalletConnect potential timeouts/issues with some mobile wallets
                    if (network.chainId === 8119) {
                        balanceProvider = new ethers.providers.JsonRpcProvider('https://api-mezame.shardeum.org');
                    } else if (network.chainId === 1) {
                        balanceProvider = new ethers.providers.JsonRpcProvider('https://ethereum.publicnode.com');
                    }

                    const rawBalance = await balanceProvider.getBalance(wcAddress);
                    console.log("Raw Balance:", rawBalance.toString());
                    const formattedBalance = ethers.utils.formatEther(rawBalance);

                    // Format to display (e.g. 0.0050)
                    const displayBalance = parseFloat(formattedBalance).toFixed(4);
                    setBalance(displayBalance);
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                    setBalance('0.00');
                }
            };

            fetchBalance();
            // Set up an interval to poll for chain changes or balance updates if needed
            // Or rely on the provider events if supported by the modal wrapper
        }
    }, [isWCConnected, wcAddress, wcProvider, chainId]);

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
        await SecureStore.deleteItemAsync('wallet_address');
        setBalance('0.00');
        setChainId(null);
    };

    const switchNetwork = async (targetChainId: number) => {
        if (!wcProvider) return;
        try {
            const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
            await ethersProvider.send("wallet_switchEthereumChain", [{ chainId: ethers.utils.hexValue(targetChainId) }]);
            // After switch, we might want to re-fetch balance immediately or wait for the useEffect
            setTimeout(checkChainId, 1000);
        } catch (switchError: any) {
            // Error code 4902 or specific messages indicate the chain is not added/approved.
            const errorString = switchError.toString();
            if (
                switchError.code === 4902 ||
                errorString.includes("4902") ||
                switchError.message?.includes("Unrecognized chain ID") ||
                errorString.includes("chain is not approved") ||
                errorString.includes("wallet_switchEthereumChain") // Broad check effectively assuming if switch fails, we try to add
            ) {
                try {
                    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
                    if (targetChainId === 8119) { // Shardeum Mezame Testnet
                        await ethersProvider.send("wallet_addEthereumChain", [{
                            chainId: ethers.utils.hexValue(8119),
                            chainName: 'Shardeum Mezame',
                            rpcUrls: ['https://api-mezame.shardeum.org'],
                            nativeCurrency: {
                                name: 'Shardeum',
                                symbol: 'SHM',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://explorer-mezame.shardeum.org']
                        }]);
                        // Try switching again after adding
                        await ethersProvider.send("wallet_switchEthereumChain", [{ chainId: ethers.utils.hexValue(targetChainId) }]);
                        setTimeout(checkChainId, 1000);
                    }
                } catch (addError: any) {
                    console.error("Failed to add network:", addError);
                    if (addError?.code === -32601 || addError?.message?.includes("does not exist")) {
                        Alert.alert(
                            "Update Required",
                            "The 'Add Network' feature is not enabled in your current session.\n\nPlease DISCONNECT your wallet and CONNECT again to update permissions.",
                            [
                                { text: "OK" },
                                {
                                    text: "Disconnect Now",
                                    style: "destructive",
                                    onPress: disconnectWallet
                                }
                            ]
                        );
                    } else {
                        Alert.alert("Error", "Failed to add Shardeum network to your wallet. Please add it manually in MetaMask.");
                    }
                }
            } else {
                console.error("Failed to switch network:", switchError);
                Alert.alert("Error", `Failed to switch network: ${switchError.message || errorString}`);
            }
        }
    };

    return (
        <WalletContext.Provider value={{
            isConnected: isWCConnected,
            address: formattedAddress,
            balance,
            chainId,
            connectWallet,
            disconnectWallet,
            provider: wcProvider, // Expose provider for transactions
            switchNetwork
        }}>
            {children}
            <WalletConnectModal
                projectId={projectId}
                providerMetadata={providerMetadata}
                sessionParams={{
                    namespaces: {
                        eip155: {
                            methods: [
                                'eth_sendTransaction',
                                'eth_signTransaction',
                                'eth_sign',
                                'personal_sign',
                                'eth_signTypedData',
                                'wallet_switchEthereumChain',
                                'wallet_addEthereumChain'
                            ],
                            chains: ['eip155:1'],
                            events: ['chainChanged', 'accountsChanged'],
                            rpcMap: {
                                1: 'https://ethereum.publicnode.com',
                                8119: 'https://api-mezame.shardeum.org'
                            }
                        }
                    }
                }}
            />
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
