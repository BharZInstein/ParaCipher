import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DepositScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Deposit Funds" showBack />

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>Select Currency</Text>
                    <View style={styles.currencyRow}>
                        <TouchableOpacity style={[styles.currencyBtn, styles.activeBtn]}>
                            <Text style={styles.activeBtnText}>USDC</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.currencyBtn}>
                            <Text style={styles.btnText}>SOL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.currencyBtn}>
                            <Text style={styles.btnText}>INR</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { marginTop: 24 }]}>Amount</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={Colors.gray600}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity style={styles.scanBtn}>
                        <MaterialIcons name="qr-code-scanner" size={20} color={Colors.primary} />
                        <Text style={styles.scanText}>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>Proceed</Text>
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
    card: {
        backgroundColor: Colors.surfaceCard,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    label: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.displayMedium,
        marginBottom: 12,
    },
    currencyRow: {
        flexDirection: 'row',
        gap: 12,
    },
    currencyBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        backgroundColor: Colors.surfaceHighlight,
    },
    activeBtn: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    btnText: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.displayBold,
    },
    activeBtnText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceBorder,
        paddingBottom: 8,
    },
    currencySymbol: {
        color: Colors.primary,
        fontSize: 24,
        fontFamily: Typography.fontFamily.displayBold,
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 24,
        fontFamily: Typography.fontFamily.displayBold,
    },
    scanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        gap: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 255, 102, 0.1)',
    },
    scanText: {
        color: Colors.primary,
        fontFamily: Typography.fontFamily.displayMedium,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        letterSpacing: 1,
    },
});
