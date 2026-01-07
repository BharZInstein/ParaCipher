import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Typography } from '@/constants/Theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Local Theme Overrides
const SettingsTheme = {
    primary: "#19e65e", // Neon Green
    background: "#050505",
    surface: "#0A0A0A",
    border: "rgba(255, 255, 255, 0.1)",
    textGray: "#9ca3af",
    danger: "#ef4444",
};

const CustomToggle = ({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) => (
    <TouchableOpacity onPress={() => onValueChange(!value)} activeOpacity={0.8}>
        <View style={[
            styles.toggleContainer,
            value ? { backgroundColor: SettingsTheme.primary, borderColor: SettingsTheme.primary }
                : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }
        ]}>
            <View style={[
                styles.toggleHandle,
                value ? { transform: [{ translateX: 14 }], backgroundColor: 'black', borderColor: 'black' }
                    : { transform: [{ translateX: 0 }], backgroundColor: '#9ca3af', borderColor: '#6b7280' }
            ]} />
        </View>
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [faceId, setFaceId] = useState(false);
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <TechBackground />

            {/* Header */}
            <UnifiedHeader
                title="SETTINGS"
                subtitle="SYS.CONFIG"
                showBack
                onBack={() => router.back()}
            />

            <Animated.View entering={FadeIn.duration(800)} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        {/* Tech Corners */}
                        <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 }]} />
                        <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 }]} />
                        <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 }]} />
                        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 }]} />

                        <View style={styles.profileContent}>
                            <View style={styles.avatarBox}>
                                <View style={styles.avatarPlaceholder}>
                                    <MaterialIcons name="person" size={32} color="#555" />
                                </View>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>VERIFIED</Text>
                                </View>
                            </View>
                            <View style={styles.profileDetails}>
                                <Text style={styles.profileName}>Mithil Girish</Text>
                                <View style={styles.idRow}>
                                    <Text style={styles.idText}>ID: 0x71C...9A23</Text>
                                    <MaterialIcons name="content-copy" size={12} color="#52525b" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Preferences Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>// PREFERENCES</Text>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>01</Text>
                            <MaterialIcons name="notifications-none" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>NOTIFICATIONS</Text>
                        </View>
                        <CustomToggle value={notifications} onValueChange={setNotifications} />
                        <View style={styles.bottomBorder} />
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>02</Text>
                            <MaterialCommunityIcons name="face-recognition" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>FACE ID LOGIN</Text>
                        </View>
                        <CustomToggle value={faceId} onValueChange={setFaceId} />
                        <View style={styles.bottomBorder} />
                    </View>

                    {/* Currency Selection */}
                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>03</Text>
                            <MaterialIcons name="currency-exchange" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>CURRENCY</Text>
                        </View>
                        <View style={styles.currencySelector}>
                            <TouchableOpacity
                                style={[styles.currencyBtn, currency === 'USD' && styles.currencyBtnActive]}
                                onPress={() => setCurrency('USD')}
                            >
                                <Text style={[styles.currencyBtnText, currency === 'USD' && styles.currencyBtnTextActive]}>USD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.currencyBtn, currency === 'INR' && styles.currencyBtnActive]}
                                onPress={() => setCurrency('INR')}
                            >
                                <Text style={[styles.currencyBtnText, currency === 'INR' && styles.currencyBtnTextActive]}>INR</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBorder} />
                    </View>

                    {/* Start A Claim - Special Item */}
                    <TouchableOpacity style={styles.claimItem} activeOpacity={0.7}>
                        <View style={styles.claimLeftLine} />
                        <View style={styles.listItemLeft}>
                            <Text style={[styles.itemIndex, { color: SettingsTheme.primary }]}>04</Text>
                            <View style={styles.claimIconBox}>
                                <MaterialIcons name="shield" size={18} color={SettingsTheme.primary} />
                                <View style={styles.claimIconGlow} />
                            </View>
                            <View>
                                <Text style={styles.claimTitle}>START A CLAIM</Text>
                                <Text style={styles.claimSub}>INITIATE PARAMETRIC COVERAGE</Text>
                            </View>
                        </View>
                        <MaterialIcons name="arrow-forward" size={16} color={SettingsTheme.primary} />
                    </TouchableOpacity>

                    {/* Support Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>// SUPPORT & RESOURCES</Text>
                    </View>

                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>05</Text>
                            <MaterialIcons name="chat-bubble-outline" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>LIVE SUPPORT</Text>
                        </View>
                        <MaterialIcons name="arrow-forward-ios" size={12} color="#52525b" />
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>06</Text>
                            <MaterialIcons name="help-outline" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>KNOWLEDGE BASE</Text>
                        </View>
                        <MaterialIcons name="arrow-forward-ios" size={12} color="#52525b" />
                    </TouchableOpacity>

                    {/* Audit & Legal Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>// AUDIT & LEGAL</Text>
                    </View>

                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>07</Text>
                            <MaterialIcons name="verified-user" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>AUDIT REPORT</Text>
                        </View>
                        <View style={styles.listItemRight}>
                            <View style={styles.passedBadge}>
                                <Text style={styles.passedText}>PASSED</Text>
                            </View>
                            <MaterialIcons name="open-in-new" size={14} color="#52525b" />
                        </View>
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>08</Text>
                            <MaterialIcons name="gavel" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>TERMS OF SERVICE</Text>
                        </View>
                        <MaterialIcons name="arrow-forward-ios" size={12} color="#52525b" />
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.itemIndex}>09</Text>
                            <MaterialIcons name="lock-outline" size={18} color="#9ca3af" />
                            <Text style={styles.itemLabel}>PRIVACY POLICY</Text>
                        </View>
                        <MaterialIcons name="arrow-forward-ios" size={12} color="#52525b" />
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.disconnectBtn}>
                            <View style={styles.disconnectOverlay} />
                            <MaterialIcons name="power-settings-new" size={18} color={SettingsTheme.danger} />
                            <Text style={styles.disconnectText}>DISCONNECT WALLET</Text>
                        </TouchableOpacity>

                        <View style={styles.networkStatus}>
                            <View style={styles.networkDot} />
                            <Text style={styles.networkText}>ETHEREUM MAINNET</Text>
                        </View>

                        <Text style={styles.versionText}>PARACIPHER V1.0.2 // BUILD 8942</Text>
                    </View>

                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SettingsTheme.background,
    },
    gridContainer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    gridLineVertical: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    gridLineHorizontal: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    profileCard: {
        backgroundColor: SettingsTheme.surface,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        position: 'relative',
        borderWidth: 1,
        borderColor: SettingsTheme.border,
    },
    corner: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderColor: SettingsTheme.primary,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarBox: {
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: SettingsTheme.border,
    },
    verifiedBadge: {
        marginTop: 8,
        backgroundColor: 'rgba(25, 230, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    verifiedText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 8,
        color: SettingsTheme.primary,
        letterSpacing: 1,
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 18,
        color: 'white',
        marginBottom: 4,
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    idText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: '#52525b',
        letterSpacing: 0.5,
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
        letterSpacing: 2,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        position: 'relative',
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemIndex: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#374151',
        width: 20,
    },
    itemLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#d1d5db',
        letterSpacing: 1,
    },
    valueText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: '#9ca3af',
        letterSpacing: 0.5,
    },
    bottomBorder: {
        position: 'absolute',
        left: 32,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: SettingsTheme.border,
    },
    claimItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(25, 230, 94, 0.03)',
        marginTop: 8,
        marginBottom: 24,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(25, 230, 94, 0.15)',
    },
    claimLeftLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: SettingsTheme.primary,
    },
    claimIconBox: {
        position: 'relative',
        marginRight: 4,
    },
    claimIconGlow: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(25, 230, 94, 0.2)',
        top: -3,
        left: -3,
    },
    claimText: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 13,
        color: SettingsTheme.primary,
        letterSpacing: 1,
    },
    dangerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        position: 'relative',
    },
    dangerLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#ef4444',
        letterSpacing: 1,
    },
    footerSection: {
        marginTop: 32,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 16,
    },
    networkStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    networkDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: SettingsTheme.primary,
    },
    networkText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: '#9ca3af',
        letterSpacing: 1,
    },
    versionText: {
        marginTop: 12,
        textAlign: 'center',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: '#374151',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    currencySelector: {
        flexDirection: 'row',
        gap: 8,
    },
    currencyBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    currencyBtnActive: {
        borderColor: SettingsTheme.primary,
        backgroundColor: 'rgba(25, 230, 94, 0.1)',
    },
    currencyBtnText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: '#9ca3af',
        letterSpacing: 1,
    },
    currencyBtnTextActive: {
        color: SettingsTheme.primary,
    },
    toggleContainer: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleHandle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    claimTitle: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 13,
        color: SettingsTheme.primary,
        letterSpacing: 0.5,
    },
    claimSub: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: '#9ca3af',
        letterSpacing: 1,
        marginTop: 2,
    },
    passedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(25, 230, 94, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    passedText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: SettingsTheme.primary,
        letterSpacing: 1,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingVertical: 24,
    },
    disconnectBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        overflow: 'hidden',
    },
    disconnectOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    disconnectText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: '#ef4444',
        letterSpacing: 1,
    },
});
