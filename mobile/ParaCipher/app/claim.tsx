import { Colors, Typography } from '@/constants/theme';
import { ClaimPayoutService } from '@/services/BlockchainService';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import TechBackground from '@/components/TechBackground';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';

export default function FileClaimScreen() {
    const router = useRouter();
    const { provider } = useWallet(); // Get provider from WalletContext
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert("Error", "Please describe the accident");
            return;
        }

        if (!provider) {
            Alert.alert("Error", "Wallet not connected");
            return;
        }

        setIsLoading(true);

        try {
            // Wrap WalletConnect provider in ethers Web3Provider (v5)
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const result = await ClaimPayoutService.fileClaim(signer, description);

            if (result.success) {
                Alert.alert(
                    "Claim Filed! 📋",
                    "Your claim has been submitted for review. You'll receive 150 SHM once approved.",
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else {
                Alert.alert("Failed", result.error || "Could not file claim. Make sure you have active coverage.");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to file claim");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TechBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FILE CLAIM</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
                    <Text style={styles.infoText}>
                        Describe what happened. Claims are reviewed and approved within 24 hours. You'll receive 150 SHM if approved.
                    </Text>
                </View>

                <Text style={styles.label}>ACCIDENT DESCRIPTION</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe the accident..."
                    placeholderTextColor={Colors.gray600}
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <>
                            <Text style={styles.submitBtnText}>SUBMIT CLAIM</Text>
                            <Text style={styles.submitBtnAmount}>150 SHM</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceBorder,
    },
    headerTitle: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        color: 'white',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(39, 228, 114, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(39, 228, 114, 0.2)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.gray400,
        lineHeight: 18,
    },
    label: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.gray400,
        letterSpacing: 1,
        marginBottom: 12,
    },
    input: {
        backgroundColor: Colors.surfaceCard,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        borderRadius: 12,
        padding: 16,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: 'white',
        height: 150,
        marginBottom: 24,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    submitBtnDisabled: {
        opacity: 0.5,
    },
    submitBtnText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        color: 'black',
        letterSpacing: 1,
    },
    submitBtnAmount: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: 'black',
        fontWeight: '700',
    },
});
