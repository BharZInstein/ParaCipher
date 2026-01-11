import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="PRIVACY POLICY" subtitle="DATA PROTECTION" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>
                    1. Data Collection{'\n'}
                    We do not collect personal data. All transactions are on-chain.{'\n\n'}
                    2. Local Storage{'\n'}
                    Your preferences are stored locally on your device.{'\n\n'}
                    3. Wallet Connection{'\n'}
                    We only read your public address and balance via WalletConnect.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundDark },
    content: { padding: 20 },
    text: { color: Colors.gray400, fontFamily: Typography.fontFamily.mono, lineHeight: 24 }
});
