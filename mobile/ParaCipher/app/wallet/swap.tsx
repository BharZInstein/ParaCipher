import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SwapScreen() {
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock Exchange Rate: 1 ETH = 2850 USDC
    const EXCHANGE_RATE = 2850;

    const handleFromChange = (value: string) => {
        setFromAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const calculated = (parseFloat(value) * EXCHANGE_RATE).toFixed(2);
            setToAmount(calculated);
        } else {
            setToAmount('');
        }
    };

    const handleSwap = () => {
        if (!fromAmount) return;
        setLoading(true);

        // Mock Swap Delay
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Swap Initiated', 'This feature is currently in demo mode. No funds were deducted.');
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="SWAP TOKENS" subtitle='DEX AGGREGATOR' showBack />

            <View style={styles.content}>

                {/* From Card */}
                <View style={styles.swapCard}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>PAY</Text>
                        <Text style={styles.balanceText}>Balance: 0.00 ETH</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={Colors.gray600}
                            keyboardType="numeric"
                            value={fromAmount}
                            onChangeText={handleFromChange}
                        />
                        <View style={styles.tokenBadge}>
                            <View style={styles.tokenIcon} />
                            <Text style={styles.tokenText}>ETH</Text>
                            <MaterialIcons name="expand-more" size={16} color="white" />
                        </View>
                    </View>
                    <Text style={styles.usdValue}>~ ${(parseFloat(fromAmount || '0') * EXCHANGE_RATE).toFixed(2)}</Text>
                </View>

                {/* Divider Icon */}
                <View style={styles.dividerContainer}>
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="arrow-downward" size={20} color={Colors.primary} />
                    </View>
                </View>

                {/* To Card */}
                <View style={styles.swapCard}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>RECEIVE</Text>
                        <Text style={styles.balanceText}>Balance: 0.00 USDC</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={Colors.gray600}
                            value={toAmount}
                            editable={false}
                        />
                        <View style={styles.tokenBadge}>
                            <View style={[styles.tokenIcon, { backgroundColor: '#2775ca' }]} />
                            <Text style={styles.tokenText}>USDC</Text>
                            <MaterialIcons name="expand-more" size={16} color="white" />
                        </View>
                    </View>
                    <Text style={styles.usdValue}>1 ETH = {EXCHANGE_RATE} USDC</Text>
                </View>

                {/* Info */}
                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Slippage Tolerance</Text>
                        <Text style={styles.infoValue}>0.5%</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Network Fee</Text>
                        <Text style={styles.infoValue}>~$4.50</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabledBtn]}
                    onPress={handleSwap}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.submitText}>SWAP NOW</Text>
                    )}
                </TouchableOpacity>

            </View>
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
    swapCard: {
        backgroundColor: Colors.surfaceCard,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    label: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        letterSpacing: 1,
    },
    balanceText: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 28,
        fontFamily: Typography.fontFamily.displayBold,
        padding: 0,
    },
    tokenBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        gap: 6,
    },
    tokenIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#627eea',
    },
    tokenText: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
    },
    usdValue: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
    },
    dividerContainer: {
        alignItems: 'center',
        height: 24,
        justifyContent: 'center',
        zIndex: 10,
        marginVertical: -12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.surfaceCard,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    infoBox: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLabel: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
    },
    infoValue: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledBtn: {
        opacity: 0.5,
    },
    submitText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        letterSpacing: 1,
    },
});
