import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Typography } from '@/constants/theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Local Theme Overrides
const ProfileTheme = {
    primary: "#00ff9d", // Neon Green
    primaryDim: "rgba(0, 255, 157, 0.1)",
    accentOrange: "#ff5e00",
    accentCyan: "#00f0ff",
    accentPurple: "#bd00ff",
    background: "#030303",
    surface: "#080808",
    surfaceCard: "#0c0c0c",
    border: "rgba(255, 255, 255, 0.1)",
};

export default function ProfileScreen() {

    // Gauge Props
    const size = 100;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = 0.85; // 850/1000
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <TechBackground />

            {/* Header Nav */}
            <UnifiedHeader
                title="SAFETY PASSPORT"
                subtitle="VERIFIED"
                rightIcon="settings"
                onRightPress={() => {
                    HapticFeedback.light();
                    router.push('/(tabs)/settings');
                }}
            />

            <Animated.View entering={FadeIn.duration(800)} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                {/* Placeholder Image or Icon */}
                                <View style={styles.avatarPlaceholder}>
                                    <MaterialIcons name="person" size={32} color="white" />
                                </View>
                                <View style={styles.onlineDot} />
                            </View>
                            <View>
                                <Text style={styles.userName}>Mithil Girish</Text>
                                <View style={styles.addressRow}>
                                    <View style={styles.walletDot} />
                                    <Text style={styles.addressText}>0x4a...8f9</Text>
                                    <MaterialIcons name="content-copy" size={12} color="#737373" />
                                </View>
                            </View>
                        </View>
                        <View style={styles.proBadge}>
                            <Text style={styles.proText}>PRO MEMBER</Text>
                        </View>
                    </View>

                    {/* Reputation Card */}
                    <View style={styles.reputationCard}>
                        {/* Tech Corners */}
                        <View style={[styles.corner, styles.tl]} />
                        <View style={[styles.corner, styles.tr]} />
                        <View style={[styles.corner, styles.bl]} />
                        <View style={[styles.corner, styles.br]} />

                        <View style={styles.reputationContent}>
                            <View>
                                <Text style={styles.repLabel}>REPUTATION SCORE</Text>
                                <Text style={styles.repValue}>850</Text>
                                <View style={styles.repBadges}>
                                    <View style={styles.excellentBadge}>
                                        <Text style={styles.excellentText}>EXCELLENT</Text>
                                    </View>
                                    <Text style={styles.percentileText}>Top 1%</Text>
                                </View>
                            </View>

                            {/* Gauge */}
                            <View style={styles.gaugeContainer}>
                                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                                    <Circle
                                        cx={size / 2} cy={size / 2} r={radius}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth={2}
                                        fill="none"
                                    />
                                    <Circle
                                        cx={size / 2} cy={size / 2} r={radius}
                                        stroke={ProfileTheme.primary}
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <View style={styles.gaugeIcon}>
                                    <MaterialIcons name="verified-user" size={32} color={ProfileTheme.primary} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsRow}>
                        <View style={styles.statsCard}>
                            <Text style={styles.statsValue}>98%</Text>
                            <Text style={styles.statsLabel}>Efficiency</Text>
                        </View>
                        <View style={styles.statsCard}>
                            <Text style={styles.statsValue}>4.9</Text>
                            <Text style={styles.statsLabel}>Rating</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                                HapticFeedback.light();
                                router.push('/profile/edit');
                            }}
                        >
                            <MaterialIcons name="edit" size={20} color="black" />
                            <Text style={styles.editBtnText}>Edit Details</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>

                        {/* Streak Card */}
                        <View style={styles.statCard}>
                            <View style={styles.statLineOrange} />
                            <View style={styles.statHeader}>
                                <Text style={styles.statLabel}>STREAK</Text>
                                <MaterialCommunityIcons name="fire" size={16} color={ProfileTheme.accentOrange} />
                            </View>
                            <View style={styles.statMain}>
                                <Text style={styles.statValue}>42</Text>
                                <Text style={styles.statUnit}>DAYS</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: '85%', backgroundColor: ProfileTheme.accentOrange }]} />
                            </View>
                        </View>

                        {/* Tier Card */}
                        <View style={styles.statCard}>
                            <View style={styles.statLineCyan} />
                            <View style={styles.statHeader}>
                                <Text style={styles.statLabel}>TIER 1</Text>
                                <MaterialIcons name="workspace-premium" size={16} color={ProfileTheme.accentCyan} />
                            </View>
                            <View style={styles.statMain}>
                                <Text style={[styles.statDesc, { color: 'white' }]}>5% Fee{'\n'}Reduction</Text>
                            </View>
                            <View style={styles.tierFooter}>
                                <Text style={styles.tierTime}>8 DAYS LEFT</Text>
                                <MaterialIcons name="arrow-forward" size={12} color={ProfileTheme.accentCyan} />
                            </View>
                        </View>
                    </View>

                    {/* Credentials Section */}
                    <View style={styles.credentialsSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={styles.titleBar} />
                                <Text style={styles.sectionTitle}>CREDENTIALS</Text>
                            </View>
                            <Text style={styles.verifiedCount}>6 VERIFIED</Text>
                        </View>

                        <View style={styles.credGrid}>
                            {/* KYC */}
                            <View style={styles.credCard}>
                                <View style={styles.credIconCircle}>
                                    <MaterialIcons name="shield" size={20} color="rgba(255,255,255,0.8)" />
                                </View>
                                <Text style={styles.credTitle}>KYC</Text>
                                <Text style={[styles.credStatus, { color: ProfileTheme.primary }]}>VERIFIED</Text>
                            </View>

                            {/* Safe Driver - Highlighted */}
                            <View style={[styles.credCard, styles.credCardHighlight]}>
                                <View style={styles.cornerSmallTL} />
                                <View style={styles.cornerSmallBR} />
                                <View style={[styles.credIconCircle, { backgroundColor: 'rgba(0, 255, 157, 0.1)' }]}>
                                    <MaterialIcons name="stars" size={20} color={ProfileTheme.primary} />
                                </View>
                                <Text style={styles.credTitle}>SAFE DRIVER</Text>
                                <Text style={[styles.credStatus, { color: ProfileTheme.primary }]}>ELITE</Text>
                            </View>

                            {/* Top Earner */}
                            <View style={styles.credCard}>
                                <View style={styles.credIconCircle}>
                                    <MaterialIcons name="payments" size={20} color="rgba(255,255,255,0.8)" />
                                </View>
                                <Text style={styles.credTitle}>TOP EARNER</Text>
                                <Text style={[styles.credStatus, { color: '#a3a3a3' }]}>TOP 5%</Text>
                            </View>

                            {/* 1 Year */}
                            <View style={styles.credCard}>
                                <View style={styles.credIconCircle}>
                                    <MaterialIcons name="workspace-premium" size={20} color="rgba(255,255,255,0.8)" />
                                </View>
                                <Text style={styles.credTitle}>1 YEAR</Text>
                                <Text style={[styles.credStatus, { color: '#a3a3a3' }]}>VETERAN</Text>
                            </View>

                            {/* Eco Rider */}
                            <View style={styles.credCard}>
                                <View style={styles.credIconCircle}>
                                    <MaterialIcons name="electric-scooter" size={20} color="rgba(255,255,255,0.8)" />
                                </View>
                                <Text style={styles.credTitle}>ECO RIDER</Text>
                                <Text style={[styles.credStatus, { color: '#a3a3a3' }]}>GREEN</Text>
                            </View>

                            {/* Super Host (Locked) */}
                            <View style={[styles.credCard, { opacity: 0.5, backgroundColor: 'rgba(255,255,255,0.02)' }]}>
                                <View style={styles.credIconCircle}>
                                    <MaterialIcons name="lock" size={20} color="#737373" />
                                </View>
                                <Text style={[styles.credTitle, { color: '#737373' }]}>SUPER HOST</Text>
                                <Text style={[styles.credStatus, { color: '#52525b' }]}>LOCKED</Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer Action */}
                    <TouchableOpacity
                        style={styles.footerBtn}
                        onPress={() => {
                            HapticFeedback.light();
                            router.push('/proof' as any);
                        }}
                    >
                        <View style={styles.footerSkew} />
                        <View style={styles.footerContent}>
                            <MaterialIcons name="dataset" size={20} color={ProfileTheme.primary} />
                            <Text style={styles.footerText}>VIEW ON-CHAIN PROOF</Text>
                            <MaterialIcons name="arrow-forward" size={16} color={ProfileTheme.primary} />
                        </View>
                        <View style={styles.cornerSmallTR} />
                        <View style={styles.cornerSmallBL} />
                    </TouchableOpacity>

                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ProfileTheme.background,
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
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(3, 3, 3, 0.8)',
    },
    navIconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 2,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 120, // Space for footer/nav
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#262626',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    onlineDot: {
        position: 'absolute',
        bottom: -4, right: -4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: ProfileTheme.primary,
        borderWidth: 2,
        borderColor: ProfileTheme.background,
    },
    userName: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 18,
        color: 'white',
        letterSpacing: -0.5,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    walletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0, 255, 157, 0.5)',
    },
    addressText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#737373',
    },
    proBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    proText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: ProfileTheme.primary,
        textTransform: 'uppercase',
    },
    reputationCard: {
        position: 'relative',
        backgroundColor: ProfileTheme.surfaceCard,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        marginBottom: 32,
    },
    corner: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderColor: ProfileTheme.primary,
    },
    tl: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
    tr: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
    bl: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
    br: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
    reputationContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    repLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#737373',
        letterSpacing: 2,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    repValue: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 56,
        color: 'white',
        letterSpacing: -2,
        lineHeight: 56,
        textShadowColor: 'rgba(0, 255, 157, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    repBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    excellentBadge: {
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 157, 0.2)',
    },
    excellentText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        fontWeight: '700',
        color: ProfileTheme.primary,
        textTransform: 'uppercase',
    },
    percentileText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#737373',
    },
    gaugeContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gaugeIcon: {
        position: 'absolute',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    statCard: {
        flex: 1,
        backgroundColor: ProfileTheme.surfaceCard,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        height: 128,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    statLineOrange: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 2,
        backgroundColor: ProfileTheme.accentOrange,
        opacity: 0.5,
    },
    statLineCyan: {
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: 2,
        backgroundColor: ProfileTheme.accentCyan,
        opacity: 0.5,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#737373',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    statMain: {
        justifyContent: 'center',
    },
    statValue: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 32,
        color: 'white',
    },
    statUnit: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#737373',
    },
    progressBarBg: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '100%',
        marginTop: 8,
    },
    progressBarFill: {
        height: 2,
        shadowColor: ProfileTheme.accentOrange,
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    statDesc: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 14,
        lineHeight: 18,
    },
    tierFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tierTime: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: ProfileTheme.accentCyan,
        fontWeight: '700',
    },
    credentialsSection: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleBar: {
        width: 4,
        height: 16,
        backgroundColor: ProfileTheme.primary,
    },
    sectionTitle: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: 'white',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    verifiedCount: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
    },
    credGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    credCard: {
        // 3 cols: width = (containerWidth - 2*gap) / 3
        // containerWidth = screenWidth - 48 (24px padding each side)
        // 2 gaps between 3 items = 2 * 8 = 16
        width: Math.floor((width - 48 - 16) / 3),
        aspectRatio: 0.9,
        backgroundColor: ProfileTheme.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    credCardHighlight: {
        borderColor: ProfileTheme.primary,
        backgroundColor: ProfileTheme.surfaceCard,
        position: 'relative',
        shadowColor: ProfileTheme.primary,
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    credIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    credTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    credStatus: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 8,
        textAlign: 'center',
    },
    cornerSmallTL: {
        position: 'absolute', top: -1, left: -1, width: 6, height: 6, borderTopWidth: 1, borderLeftWidth: 1, borderColor: ProfileTheme.primary,
    },
    cornerSmallBR: {
        position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, borderBottomWidth: 1, borderRightWidth: 1, borderColor: ProfileTheme.primary,
    },
    cornerSmallTR: {
        position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderTopWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
    },
    cornerSmallBL: {
        position: 'absolute', bottom: 0, left: 0, width: 6, height: 6, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
    },
    footerBtn: {
        position: 'relative',
        height: 56,
        marginTop: 12,
        overflow: 'hidden',
    },
    footerSkew: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 157, 0.5)',
        transform: [{ skewX: '-10deg' }],
        marginHorizontal: 10,
    },
    footerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    footerText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8, // Reduced gap between cards to give more space
        marginBottom: 20,
    },
    editBtn: {
        flex: 1.2, // Give button more space than stats cards
        height: 70,
        backgroundColor: '#00ff9d',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4, // Reduce gap between icon and text
        paddingHorizontal: 4,
    },
    editBtnText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 11, // Slightly smaller
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: 0.5, // Reduced letter spacing
    },
    statsCard: {
        flex: 1,
        height: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsValue: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        color: 'white',
        marginBottom: 4,
    },
    statsLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#737373',
        textTransform: 'uppercase',
    },
});
