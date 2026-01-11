import { Stack } from 'expo-router';
import React from 'react';

export default function WalletLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="deposit" />
            <Stack.Screen name="withdraw" />
            <Stack.Screen name="swap" />
            <Stack.Screen name="activity" />
        </Stack>
    );
}
