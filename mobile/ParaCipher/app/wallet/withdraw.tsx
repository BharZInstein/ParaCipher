import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { useWallet } from '@/context/WalletContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WithdrawScreen() {
    const router = useRouter();
    const { provider } = useWalletConnectModal(); // Get raw WC provider
    const { balance, address } = useWallet();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!recipient || !amount) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!provider) {
            Alert.alert('Error', 'Wallet not connected');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Ethers Provider
            const web3Provider = new ethers.providers.Web3Provider(provider);
            const signer = web3Provider.getSigner();

            // 2. Parse Amount
            const amountWei = ethers.utils.parseEther(amount);

            // 3. Send Transaction
            const tx = await signer.sendTransaction({
                to: recipient,
                value: amountWei
            });

            console.log('Transaction sent:', tx.hash);
            Alert.alert('Success', `Transaction Sent!\nHash: ${tx.hash.substring(0, 10)}...`);
            router.back();

        } catch (error: any) {
            console.error('Send Error:', error);
            Alert.alert('Transaction Failed', error.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="WITHDRAW ASSETS" subtitle='SEND ETH' showBack />

            <View style={styles.content}>
                <View style={styles.card}>

                    {/* Amount Input */}
                    <Text style={styles.label}>AMOUNT (ETH)</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.currencySymbol}>ETH</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={Colors.gray600}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <Text style={styles.balanceText}>Available: {balance} ETH</Text>

                    {/* Recipient Input */}
                    <Text style={[styles.label, { marginTop: 24 }]}>RECIPIENT ADDRESS</Text>
                    <View style={styles.addressInputBox}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder="0x..."
                            placeholderTextColor={Colors.gray600}
                            value={recipient}
                            onChangeText={setRecipient}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => { /* TODO: Paste */ }}>
                            <MaterialIcons name="content-paste" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabledBtn]}
                    onPress={handleSend}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <>
                            <Text style={styles.submitText}>CONFIRM WITHDRAWAL</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="black" />
                        </>
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
    card: {
        backgroundColor: Colors.surfaceCard,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    label: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 12,
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
    balanceText: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        marginTop: 8,
        textAlign: 'right',
    },
    addressInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    addressInput: {
        flex: 1,
        color: 'white',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        gap: 8,
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
