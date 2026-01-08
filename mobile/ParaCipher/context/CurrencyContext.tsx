import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CurrencyType = 'USD' | 'INR';

interface CurrencyContextType {
    currency: CurrencyType;
    toggleCurrency: () => void;
    setCurrencyPreference: (currency: CurrencyType) => void;
    formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CURRENCY_STORAGE_KEY = 'settings_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<CurrencyType>('USD');

    useEffect(() => {
        loadCurrency();
    }, []);

    const loadCurrency = async () => {
        try {
            const saved = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
            if (saved === 'USD' || saved === 'INR') {
                setCurrency(saved);
            }
        } catch (error) {
            console.warn('Failed to load currency preference', error);
        }
    };

    const setCurrencyPreference = async (newCurrency: CurrencyType) => {
        setCurrency(newCurrency);
        try {
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
        } catch (error) {
            console.warn('Failed to save currency preference', error);
        }
    };

    const toggleCurrency = async () => {
        const newCurrency = currency === 'USD' ? 'INR' : 'USD';
        await setCurrencyPreference(newCurrency);
    };

    const formatAmount = (amount: number): string => {
        if (currency === 'INR') {
            // 1 USD approx 83 INR (static conversion for demo/hackathon)
            const inrAmount = amount * 83;
            return `₹${inrAmount.toLocaleString('en-IN')}`;
        }
        return `$${amount.toLocaleString('en-US')}`;
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            toggleCurrency,
            setCurrencyPreference,
            formatAmount
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
