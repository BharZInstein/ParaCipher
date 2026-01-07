import TechBackground from '@/components/TechBackground';
import { Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
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

export default function WalletScreen() {
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
                    </View>

                    {/* Balance Section */}
                    <View style={styles.balanceSection}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <View style={styles.balanceRow}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <Text style={styles.balanceValue}>1,240.50</Text>
                        </View>

                        <View style={styles.balanceMetaRow}>
                            <View style={styles.trendPill}>
                                <MaterialIcons name="trending-up" size={16} color={WalletTheme.primary} />
                                <Text style={styles.trendText}>+$12.45</Text>
                            </View>
                            <View style={styles.yieldBadge}>
                                <Text style={styles.yieldText}>+3.5% YIELD</Text>
                            </View>
                        </View>
                    </View>

                    {/* Top Up Button */}
                    <TouchableOpacity style={styles.topUpBtn}>
                        <Text style={styles.topUpText}>Top-Up Wallet</Text>
                        <View style={styles.arrowCircle}>
                            <MaterialIcons name="arrow-outward" size={20} color="white" />
                        </View>
                        <View style={styles.btnLine} />
                    </TouchableOpacity>

                    {/* Activity Log */}
                    <View style={styles.activitySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>ACTIVITY LOG</Text>
                            <TouchableOpacity style={styles.viewAllBtn}>
                                <Text style={styles.viewAllText}>VIEW ALL</Text>
                                <MaterialIcons name="chevron-right" size={16} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.activityList}>

                            {/* Item 1 */}
                            <View style={styles.activityItem}>
                                {/* Tech Corners Items */}
                                <View style={[styles.cornerItem, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1, borderColor: WalletTheme.primary }]} />
                                <View style={[styles.cornerItem, { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1, borderColor: WalletTheme.primary }]} />

                                <View style={styles.itemLeft}>
                                    <View style={styles.iconBox}>
                                        <MaterialIcons name="shield" size={20} color="#9ca3af" />
                                    </View>
                                    <View>
                                        <Text style={styles.itemTitle}>Uber Eats Gig</Text>
                                        <Text style={styles.itemSub}>09:41 AM <Text style={{ color: '#333' }}>|</Text> COVERED</Text>
                                    </View>
                                </View>
                                <Text style={styles.amountNegative}>-$2.50</Text>
                            </View>

                            {/* Item 2 */}
                            <View style={styles.activityItem}>
                                <View style={[styles.cornerItem, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1, borderColor: WalletTheme.primary, opacity: 0.5 }]} />
                                <View style={styles.itemLeft}>
                                    <View style={[styles.iconBox, { borderColor: WalletTheme.primary }]}>
                                        <MaterialIcons name="trending-up" size={20} color={WalletTheme.primary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.itemTitle, { color: 'white' }]}>Yield Earned</Text>
                                        <Text style={styles.itemSub}>YESTERDAY <Text style={{ color: '#333' }}>|</Text> AUTO</Text>
                                    </View>
                                </View>
                                <Text style={styles.amountPositive}>+$0.85</Text>
                            </View>

                            {/* Item 3 */}
                            <View style={[styles.activityItem, { opacity: 0.8 }]}>
                                <View style={styles.itemLeft}>
                                    <View style={styles.iconBox}>
                                        <MaterialIcons name="account-balance" size={20} color="#6b7280" />
                                    </View>
                                    <View>
                                        <Text style={styles.itemTitle}>Bank Transfer</Text>
                                        <Text style={styles.itemSub}>OCT 24 <Text style={{ color: '#333' }}>|</Text> COMPLETED</Text>
                                    </View>
                                </View>
                                <Text style={[styles.amountPositive, { color: 'white' }]}>+$200.00</Text>
                            </View>

                        </View>
                    </View>

                </ScrollView>
            </Animated.View>
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
        top: -150, left: -50,
        width: 300, height: 300,
        backgroundColor: 'rgba(204, 255, 0, 0.05)',
        borderRadius: 150,
        zIndex: 0,
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
});
