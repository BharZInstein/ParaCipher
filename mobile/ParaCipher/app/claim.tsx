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
    ActivityIndicator,
    ScrollView
} from 'react-native';
import TechBackground from '@/components/TechBackground';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';

// Demo evidence that will be submitted (same as BlockchainService)
const DEMO_EVIDENCE = {
    photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    gpsLatitude: "13.0827",
    gpsLongitude: "80.2707",
    accidentTimestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    policeReportId: `CHN-ACC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    description: ""
};

const VALIDATION_CHECKS = [
    { id: 1, label: "Valid Coverage Active", icon: "verified-user" },
    { id: 2, label: "No Duplicate Claims", icon: "block" },
    { id: 3, label: "Photo Evidence Required", icon: "photo-camera" },
    { id: 4, label: "GPS Coordinates Required", icon: "location-on" },
    { id: 5, label: "Timestamp Within 24 Hours", icon: "schedule" },
    { id: 6, label: "Accident During Coverage", icon: "date-range" },
    { id: 7, label: "Description Min 10 Chars", icon: "description" },
    { id: 8, label: "Sufficient Pool Funds", icon: "account-balance" },
];

export default function FileClaimScreen() {
    const router = useRouter();
    const { provider } = useWallet();
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEvidence, setShowEvidence] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [showFraudPrevention, setShowFraudPrevention] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert("Error", "Please describe the accident");
            return;
        }

        if (description.trim().length < 10) {
            Alert.alert("Validation Failed", "Description must be at least 10 characters for fraud prevention.");
            return;
        }

        if (!provider) {
            Alert.alert("Error", "Wallet not connected");
            return;
        }

        setIsLoading(true);

        try {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const result = await ClaimPayoutService.fileClaim(signer, description);

            if (result.success) {
                Alert.alert(
                    "Claim Submitted! ✅",
                    `Your accident claim has been filed successfully.\n\nPayout: 150 SHM\n\nTx: ${result.txHash?.slice(0, 10)}...`,
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else {
                Alert.alert("Validation Failed", result.error || "One or more validation checks failed. Make sure you have active coverage.");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to file claim");
        } finally {
            setIsLoading(false);
        }
    };

    const evidenceTimestamp = new Date(DEMO_EVIDENCE.accidentTimestamp * 1000);

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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Evidence Preview Collapsible */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => setShowEvidence(!showEvidence)}
                    activeOpacity={0.7}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <MaterialIcons name="attachment" size={20} color={Colors.primary} />
                        <Text style={styles.sectionHeaderText}>EVIDENCE BEING SUBMITTED</Text>
                    </View>
                    <MaterialIcons
                        name={showEvidence ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={Colors.gray400}
                    />
                </TouchableOpacity>

                {showEvidence && (
                    <View style={styles.evidenceContainer}>
                        <View style={styles.evidenceItem}>
                            <MaterialIcons name="photo-camera" size={16} color={Colors.primary} />
                            <View style={styles.evidenceContent}>
                                <Text style={styles.evidenceLabel}>Accident Photo (IPFS)</Text>
                                <Text style={styles.evidenceValue} numberOfLines={1}>
                                    {DEMO_EVIDENCE.photoIpfsHash}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.evidenceItem}>
                            <MaterialIcons name="location-on" size={16} color={Colors.primary} />
                            <View style={styles.evidenceContent}>
                                <Text style={styles.evidenceLabel}>GPS Coordinates</Text>
                                <Text style={styles.evidenceValue}>
                                    {DEMO_EVIDENCE.gpsLatitude}, {DEMO_EVIDENCE.gpsLongitude}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.evidenceItem}>
                            <MaterialIcons name="schedule" size={16} color={Colors.primary} />
                            <View style={styles.evidenceContent}>
                                <Text style={styles.evidenceLabel}>Accident Time</Text>
                                <Text style={styles.evidenceValue}>
                                    {evidenceTimestamp.toLocaleString()} ({Math.floor((Date.now() - evidenceTimestamp.getTime()) / 3600000)}h ago)
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.evidenceItem, { borderBottomWidth: 0 }]}>
                            <MaterialIcons name="local-police" size={16} color={Colors.primary} />
                            <View style={styles.evidenceContent}>
                                <Text style={styles.evidenceLabel}>Police Report ID</Text>
                                <Text style={styles.evidenceValue}>{DEMO_EVIDENCE.policeReportId}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Validation Checks Collapsible */}
                <TouchableOpacity
                    style={[styles.sectionHeader, { marginTop: 8 }]}
                    onPress={() => setShowValidation(!showValidation)}
                    activeOpacity={0.7}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <MaterialIcons name="verified-user" size={20} color={Colors.primary} />
                        <Text style={styles.sectionHeaderText}>8 AUTOMATED CHECKS</Text>
                    </View>
                    <MaterialIcons
                        name={showValidation ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={Colors.gray400}
                    />
                </TouchableOpacity>

                {showValidation && (
                    <View style={styles.validationContainer}>
                        {VALIDATION_CHECKS.map((check) => (
                            <View key={check.id} style={styles.validationItem}>
                                <MaterialIcons name={check.icon as any} size={18} color={Colors.gray500} />
                                <Text style={styles.validationText}>{check.label}</Text>
                            </View>
                        ))}
                        <View style={styles.validationNote}>
                            <Text style={styles.validationNoteText}>
                                ✓ All checks run automatically on-chain{'\n'}
                                ✓ Cannot be bypassed or manipulated
                            </Text>
                        </View>
                    </View>
                )}

                {/* Fraud Prevention Collapsible */}
                <TouchableOpacity
                    style={[styles.sectionHeader, { marginTop: 8 }]}
                    onPress={() => setShowFraudPrevention(!showFraudPrevention)}
                    activeOpacity={0.7}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <MaterialIcons name="security" size={20} color="#ef4444" />
                        <Text style={[styles.sectionHeaderText, { color: '#ef4444' }]}>HOW WE PREVENT FRAUD</Text>
                    </View>
                    <MaterialIcons
                        name={showFraudPrevention ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={Colors.gray400}
                    />
                </TouchableOpacity>

                {showFraudPrevention && (
                    <View style={styles.fraudContainer}>
                        <View style={styles.fraudItem}>
                            <Text style={styles.fraudIcon}>❌</Text>
                            <View style={styles.fraudContent}>
                                <Text style={styles.fraudTitle}>Can't Backdate Claims</Text>
                                <Text style={styles.fraudDesc}>
                                    Smart contract checks block.timestamp - claims older than 24h are rejected
                                </Text>
                            </View>
                        </View>

                        <View style={styles.fraudItem}>
                            <Text style={styles.fraudIcon}>❌</Text>
                            <View style={styles.fraudContent}>
                                <Text style={styles.fraudTitle}>Can't Claim Before Coverage</Text>
                                <Text style={styles.fraudDesc}>
                                    Accident timestamp must be AFTER policy start time (verified on-chain)
                                </Text>
                            </View>
                        </View>

                        <View style={styles.fraudItem}>
                            <Text style={styles.fraudIcon}>❌</Text>
                            <View style={styles.fraudContent}>
                                <Text style={styles.fraudTitle}>Can't Skip Evidence</Text>
                                <Text style={styles.fraudDesc}>
                                    Photo hash, GPS coords, and description are mandatory - empty values = transaction reverts
                                </Text>
                            </View>
                        </View>

                        <View style={styles.fraudItem}>
                            <Text style={styles.fraudIcon}>❌</Text>
                            <View style={styles.fraudContent}>
                                <Text style={styles.fraudTitle}>Can't Claim Twice</Text>
                                <Text style={styles.fraudDesc}>
                                    Policy is marked as "claimed" on-chain - duplicate claims are rejected
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.fraudItem, { borderBottomWidth: 0 }]}>
                            <Text style={styles.fraudIcon}>🔒</Text>
                            <View style={styles.fraudContent}>
                                <Text style={styles.fraudTitle}>Immutable Smart Contract</Text>
                                <Text style={styles.fraudDesc}>
                                    All validation logic is on-chain and cannot be modified - even by us
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Description Input */}
                <Text style={styles.label}>ACCIDENT DESCRIPTION</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe the accident... (minimum 10 characters)"
                    placeholderTextColor={Colors.gray600}
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                    {description.length}/10 characters {description.length >= 10 ? '✓' : ''}
                </Text>

                {/* Submit Button */}
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

                <View style={{ height: 24 }} />
            </ScrollView>
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
        marginBottom: 16,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.gray400,
        lineHeight: 18,
    },
    demoNotice: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 165, 0, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 165, 0, 0.3)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    demoNoticeText: {
        flex: 1,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: '#FFA500',
        lineHeight: 16,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surfaceCard,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        borderRadius: 12,
        padding: 16,
        marginBottom: 0,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionHeaderText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: Colors.gray400,
        letterSpacing: 1,
        fontWeight: '700',
    },
    evidenceContainer: {
        backgroundColor: Colors.surfaceCard,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 16,
        marginBottom: 8,
        gap: 12,
    },
    evidenceItem: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceBorder,
    },
    evidenceContent: {
        flex: 1,
    },
    evidenceLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray500,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    evidenceValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: Colors.gray400,
    },
    evidenceSource: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: Colors.primary,
        marginTop: 4,
        opacity: 0.8,
    },
    dataAcquisitionBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: 'rgba(39, 228, 114, 0.08)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(39, 228, 114, 0.2)',
    },
    dataAcquisitionTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    dataAcquisitionText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray400,
        lineHeight: 16,
    },
    validationContainer: {
        backgroundColor: Colors.surfaceCard,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    validationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    validationText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: Colors.gray400,
    },
    validationNote: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.surfaceBorder,
    },
    validationNoteText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.primary,
        lineHeight: 16,
    },
    fraudContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    fraudItem: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(239, 68, 68, 0.1)',
    },
    fraudIcon: {
        fontSize: 18,
    },
    fraudContent: {
        flex: 1,
    },
    fraudTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#ef4444',
        fontWeight: '700',
        marginBottom: 4,
    },
    fraudDesc: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray500,
        lineHeight: 14,
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
        height: 120,
        marginBottom: 8,
    },
    charCount: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray500,
        textAlign: 'right',
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
