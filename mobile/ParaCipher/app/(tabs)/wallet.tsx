import TechBackground from '@/components/TechBackground';
import { Typography } from '@/constants/theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import UnifiedHeader from '@/components/UnifiedHeader';

const { width } = Dimensions.get('window');

// Local Theme Overrides
const WalletTheme = {
    primary: "#ccff00", // Neon Lime
    background: "#030303",
    surfaceCard: "#0a0a0a",
    border: "rgba(255, 255, 255, 0.1)",
    textGray: "#9ca3af",
};

import { useWallet } from '@/context/WalletContext';

export default function WalletScreen() {
    const { isConnected, connectWallet, balance, address } = useWallet();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <TechBackground />

            <UnifiedHeader
                title="WALLET"
                subtitle="SMART CONTRACT"
                rightIcon="notifications-none"
                showNotification
            />

            {/* Top Glow */}
            <View style={styles.topGlow} pointerEvents="none" />

            {!isConnected ? (
                <View style={styles.connectContainer}>
                    <View style={styles.connectIconBg}>
                        <MaterialIcons name="account-balance-wallet" size={48} color={WalletTheme.primary} />
                    </View>
                    <Text style={styles.connectTitle}>Connect Wallet</Text>
                    <Text style={styles.connectDesc}>Link your MetaMask wallet to access insurance coverage and claims.</Text>

                    <TouchableOpacity
                        style={styles.connectBtn}
                        onPress={async () => {
                            HapticFeedback.light();
                            console.log('[WalletScreen] Connect button pressed');
                            await connectWallet();
                        }}
                    >
                        <Text style={styles.connectBtnText}>CONNECT WALLET</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            ) : (
                <Animated.View entering={FadeIn.duration(800)} style={styles.content}>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                        {/* Status Pill */}
                        <View style={styles.statusPillContainer}>
                            <View style={styles.statusPill}>
                                <View style={styles.pingContainer}>
                                    <View style={styles.pingDot} />
                                    <View style={styles.pingRing} />
                                </View>
                                <Text style={styles.statusText}>PROTECTION ACTIVE</Text>
                            </View>
                            {address && (
                                <View style={[styles.statusPill, { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderLeftColor: '#6b7280' }]}>
                                    <MaterialIcons name="account-balance-wallet" size={14} color="#9ca3af" />
                                    <Text style={[styles.statusText, { color: '#9ca3af', letterSpacing: 1 }]}>
                                        {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                                    </Text>
                                </View>
                            )}
                        </View>

                        

                        {/* Balance Section */}
                        <View style={styles.balanceSection}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <Text style={styles.balanceValue}>{balance}</Text>
                            <Text style={[styles.currencySymbol, { marginLeft: 8, fontSize: 20, alignSelf: 'flex-end', marginBottom: 6 }]}>ETH</Text>

                            <View style={styles.balanceMetaRow}>
                                <View style={styles.trendPill}>
                                    <MaterialIcons name="trending-up" size={16} color={WalletTheme.primary} />
                                    <Text style={styles.trendText}>+0.00%</Text>
                                </View>
                                <View style={styles.yieldBadge}>
                                    <Text style={styles.yieldText}>+3.5% YIELD</Text>
                                </View>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.primaryBtn]}
                                    onPress={() => {
                                        HapticFeedback.light();
                                        router.push('/wallet/deposit');
                                    }}
                                >
                                    <MaterialIcons name="add" size={24} color="black" />
                                    <Text style={styles.primaryBtnText}>Top Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => {
                                        HapticFeedback.light();
                                        router.push('/wallet/withdraw');
                                    }}
                                >
                                    <MaterialIcons name="arrow-outward" size={24} color="white" />
                                    <Text style={styles.actionBtnText}>Withdraw</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => {
                                        HapticFeedback.light();
                                        router.push('/wallet/swap');
                                    }}
                                >
                                    <MaterialIcons name="swap-horiz" size={24} color="white" />
                                    <Text style={styles.actionBtnText}>Swap</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Activity Log */}
                        <View style={styles.activitySection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>ACTIVITY LOG</Text>
                                <TouchableOpacity
                                    style={styles.viewAllBtn}
                                    onPress={() => {
                                        HapticFeedback.light();
                                        router.push('/wallet/activity');
                                    }}
                                >
                                    <Text style={styles.viewAllText}>VIEW ALL</Text>
                                    <MaterialIcons name="chevron-right" size={16} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.activityList}>

                                {/* Item 1 */}
                                <View style={styles.activityItem}>
                                    <View style={[styles.cornerItem, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1, borderColor: WalletTheme.primary }]} />
                                    <View style={[styles.cornerItem, { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1, borderColor: WalletTheme.primary }]} />

                                    <View style={styles.itemLeft}>
                                        <View style={styles.iconBox}>
                                            <MaterialIcons name="arrow-downward" size={20} color="#9ca3af" />
                                        </View>
                                        <View>
                                            <Text style={styles.itemTitle}>Received ETH</Text>
                                            <Text style={styles.itemSub}>Today, 10:23 AM <Text style={{ color: '#4ade80' }}>| Confirmed</Text></Text>
                                        </View>
                                    </View>
                                    <Text style={styles.amountPositive}>+0.45 ETH</Text>
                                </View>

                                {/* Item 2 */}
                                <View style={styles.activityItem}>
                                    <View style={[styles.cornerItem, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1, borderColor: WalletTheme.primary, opacity: 0.5 }]} />
                                    <View style={styles.itemLeft}>
                                        <View style={styles.iconBox}>
                                            <MaterialIcons name="arrow-upward" size={20} color="#9ca3af" />
                                        </View>
                                        <View>
                                            <Text style={styles.itemTitle}>Sent to 0x4d...2a</Text>
                                            <Text style={styles.itemSub}>Yesterday, 04:15 PM <Text style={{ color: '#4ade80' }}>| Confirmed</Text></Text>
                                        </View>
                                    </View>
                                    <Text style={styles.amountNegative}>-0.12 ETH</Text>
                                </View>

                                {/* Item 3 */}
                                <View style={[styles.activityItem, { opacity: 0.8 }]}>
                                    <View style={styles.itemLeft}>
                                        <View style={styles.iconBox}>
                                            <MaterialIcons name="swap-horiz" size={20} color="#9ca3af" />
                                        </View>
                                        <View>
                                            <Text style={styles.itemTitle}>Swap ETH for USDC</Text>
                                            <Text style={styles.itemSub}>Oct 24, 09:30 AM <Text style={{ color: '#4ade80' }}>| Confirmed</Text></Text>
                                        </View>
                                    </View>
                                    <Text style={styles.amountNegative}>-1.50 ETH</Text>
                                </View>

                            </View>
                        </View>

                    </ScrollView>
                </Animated.View>
            )}
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WalletTheme.background,
    },
    gridContainer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    gridLineVertical: {
        position: 'absolute',
        top: 0, bottom: 0,
        width: 1,
        backgroundColor: '#333',
    },
    gridLineHorizontal: {
        position: 'absolute',
        left: 0, right: 0,
        height: 1,
        backgroundColor: '#333',
    },
    topGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        backgroundColor: 'rgba(204, 255, 0, 0.05)',
        transform: [{ scaleY: 1.5 }],
    },
    connectContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    connectIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(204, 255, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(204, 255, 0, 0.2)',
    },
    connectTitle: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 24,
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    connectDesc: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    connectBtn: {
        backgroundColor: WalletTheme.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    connectBtnText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: 'black',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        position: 'absolute',
        bottom: -2, right: -2,
        width: 10,
        height: 10,
        backgroundColor: WalletTheme.primary,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: WalletTheme.background,
    },
    notificationBtn: {
        padding: 8,
        position: 'relative',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    notificationDot: {
        position: 'absolute',
        top: 8, right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: WalletTheme.primary,
    },
    statusPillContainer: {
        marginTop: 24,
        alignItems: 'flex-start',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(204, 255, 0, 0.05)',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(204, 255, 0, 0.4)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 8,
    },
    pingContainer: {
        width: 8,
        height: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pingDot: {
        width: 6,
        height: 6,
        backgroundColor: WalletTheme.primary,
        borderRadius: 3,
        zIndex: 2,
    },
    pingRing: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: WalletTheme.primary,
        opacity: 0.5,
        zIndex: 1,
    },
    statusText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 10,
        color: WalletTheme.primary,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    balanceSection: {
        marginTop: 32,
        marginBottom: 40,
    },
    balanceLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: '#9ca3af',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    currencySymbol: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 32,
        color: '#6b7280',
    },
    balanceValue: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 56,
        color: 'white',
        letterSpacing: -2,
        lineHeight: 60,
    },
    balanceMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 16,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        gap: 6,
    },
    trendText: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 14,
        color: 'white',
    },
    yieldBadge: {
        backgroundColor: 'rgba(204, 255, 0, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(204, 255, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    yieldText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        fontWeight: '700',
        color: WalletTheme.primary,
        textTransform: 'uppercase',
    },
    topUpBtn: {
        backgroundColor: 'white',
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 48,
    },
    topUpText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.5,
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLine: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    activitySection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    sectionTitle: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: '#e5e5e5',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    viewAllText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#6b7280',
        fontWeight: '700',
    },
    activityList: {
        gap: 16,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 10, 10, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        position: 'relative',
    },
    cornerItem: {
        position: 'absolute',
        width: 8,
        height: 8,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#030303',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 14,
        color: 'white',
        marginBottom: 2,
    },
    itemSub: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#6b7280',
    },
    amountNegative: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: '#d1d5db',
        fontWeight: '500',
    },
    amountPositive: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: WalletTheme.primary,
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    actionBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: WalletTheme.primary,
    },
    actionBtnText: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    primaryBtnText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    addressSection: {
        marginTop: 24,
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'rgba(204, 255, 0, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(204, 255, 0, 0.2)',
        borderRadius: 12,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: WalletTheme.primary,
    },
    addressLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#9ca3af',
        letterSpacing: 0.5,
    },
    addressValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: WalletTheme.primary,
        fontWeight: '700',
    },
});
