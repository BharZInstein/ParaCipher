import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function TransactionDetailScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Transaction Details" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.card}>
                    <View style={styles.statusIcon}>
                        <MaterialIcons name="verified" size={64} color={Colors.primary} />
                    </View>

                    <Text style={styles.amount}>+ ₹12,450.00</Text>
                    <Text style={styles.status}>Completed</Text>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Transaction ID</Text>
                        <Text style={styles.value}>TXN-{id || '883920'}-X9</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>Jan 8, 2026, 11:45 AM</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Type</Text>
                        <Text style={styles.value}>Performance Payout</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Network</Text>
                        <Text style={styles.value}>Solana (Mainnet)</Text>
                    </View>

                    <View style={[styles.row, styles.hashRow]}>
                        <Text style={styles.label}>Hash</Text>
                        <Text style={styles.hash}>0x7a...9f2b</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.surfaceCard,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        alignItems: 'center',
    },
    statusIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 255, 102, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    amount: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 32,
        color: 'white',
        marginTop: 8,
    },
    status: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: Colors.primary,
        backgroundColor: 'rgba(0, 255, 102, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.surfaceBorder,
        width: '100%',
        marginVertical: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    hashRow: {
        marginBottom: 0,
    },
    label: {
        fontFamily: Typography.fontFamily.display,
        fontSize: 14,
        color: Colors.gray500,
    },
    value: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 14,
        color: 'white',
    },
    hash: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.accentBlue,
    },
});
