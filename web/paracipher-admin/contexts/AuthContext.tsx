"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSDK } from "@metamask/sdk-react";

interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { sdk, connected, connecting, provider } = useSDK();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (connected && provider) {
        try {
          // @ts-ignore
          const accounts = await provider.request({ method: "eth_accounts" });
          if (accounts && accounts[0]) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error("Failed to get accounts", err);
        }
      }
      setIsLoading(false);
    };

    checkConnection();
  }, [connected, provider]);

  // Listen for account changes
  useEffect(() => {
    if (provider) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
        } else {
          setWalletAddress(accounts[0]);
        }
      };

      // @ts-ignore
      provider.on("accountsChanged", handleAccountsChanged);

      return () => {
        // @ts-ignore
        provider.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [provider]);

  const login = async () => {
    try {
      const accounts = await sdk?.connect();
      if (accounts && accounts[0]) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Failed to connect", err);
      throw err;
    }
  };

  const logout = () => {
    if (sdk) {
      sdk.terminate();
      setWalletAddress(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!walletAddress,
        walletAddress,
        isLoading: isLoading || connecting,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
