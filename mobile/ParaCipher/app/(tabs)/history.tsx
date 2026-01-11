import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Typography } from '@/constants/theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// Local Theme Overrides
const HistoryTheme = {
    primary: "#00FF94", // Neon Green
    background: "#030303",
    surface: "#080808",
    border: "rgba(255, 255, 255, 0.1)",
    textMuted: "#737373",
    textLight: "#e5e5e5",
};

const DATA = [
    {
        title: "OCTOBER",
        data: [
            {
                id: '1',
                type: 'payout',
                title: 'Rain Delay Payout',
                date: '10/12 • 14:00',
                hash: '0x82a...1b4f',
                amount: '+$25.00',
                status: 'PAID',
                icon: 'weather-pouring',
                color: HistoryTheme.primary,
            },
            {
                id: '2',
                type: 'premium',
                title: 'Doordash Shift',
                date: '10/11 • 18:00',
                hash: '0x3a9...9c22',
                amount: '-$1.50',
                status: 'SECURED',
                icon: 'moped',
                color: '#737373',
            },
            {
                id: '3',
                type: 'pending',
                title: 'Uber Coverage',
                date: 'Validating...',
                hash: '',
                amount: '-$1.50',
                status: 'PENDING',
                icon: 'swap-horizontal',
                color: '#eab308', // Yellow
                highlight: true,
            },
            {
                id: '4',
                type: 'payout',
                title: 'Accident Payout',
                date: '10/09 • 08:45',
                hash: '0x5c8...12ff',
                amount: '+$125.00',
                status: 'PAID',
                icon: 'medical-bag',
                color: HistoryTheme.primary,
            },
        ]
    },
    {
        title: "SEPTEMBER",
        data: [
            {
                id: '5',
                type: 'premium',
                title: 'Instacart Batch',
                date: '09/28 • 11:30',
                hash: '0x9b4...ee12',
                amount: '-$2.00',
                status: 'SECURED',
                icon: 'shopping',
                color: '#737373',
            },
        ]
    }
];

export default function HistoryScreen() {
    const [filter, setFilter] = useState('ALL');

    const renderItem = ({ item }: { item: any }) => {
        const isPending = item.status === 'PENDING';
        const isPayout = item.type === 'payout';

        return (
            <View style={[styles.itemContainer, item.highlight && styles.itemHighlight]}>
                {item.highlight && <View style={styles.highlightBar} />}
                {item.highlight && (
                    <LinearGradient
                        colors={['rgba(234, 179, 8, 0.05)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <View style={styles.itemLeft}>
                    <View style={styles.iconBox}>
                        <MaterialCommunityIcons
                            name={item.icon as any}
                            size={20}
                            color={item.color}
                        />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <View style={styles.itemMeta}>
                            <Text style={[styles.metaText, isPending && { color: '#eab308' }]}>
                                {item.date}
                            </Text>
                            {!isPending && (
                                <>
                                    <View style={styles.dot} />
                                    <Text style={styles.metaHash}>{item.hash}</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.itemRight}>
                    <Text style={[
                        styles.amount,
                        isPayout ? { color: HistoryTheme.primary } : { color: '#a3a3a3' },
                        isPending && { color: '#a3a3a3' }
                    ]}>
                        {item.amount}
                    </Text>

                    {isPending ? (
                        <View style={styles.badgePending}>
                            <MaterialIcons name="refresh" size={10} color="#eab308" />
                            <Text style={styles.badgeTextPending}>PENDING</Text>
                        </View>
                    ) : (
                        <View style={[
                            styles.badge,
                            isPayout ? { backgroundColor: 'rgba(0, 255, 148, 0.1)', borderColor: 'rgba(0, 255, 148, 0.3)' }
                                : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }
                        ]}>
                            <Text style={[
                                styles.badgeText,
                                isPayout ? { color: HistoryTheme.primary } : { color: '#737373' }
                            ]}>
                                {item.status}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <TechBackground />

            <UnifiedHeader
                title="HISTORY"
                subtitle="TRANSACTIONS"
                rightIcon="notifications-none"
                showNotification
            />

            {/* Soft background glows */}
            <View style={styles.glowTopRight} pointerEvents="none" />
            <View style={styles.glowBottomLeft} pointerEvents="none" />

            <Animated.View entering={FadeIn.duration(800)} style={styles.content}>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    <TouchableOpacity
                        style={[styles.tabItem, filter === 'ALL' && styles.tabActive]}
                        onPress={() => setFilter('ALL')}
                    >
                        <Text style={[styles.tabText, filter === 'ALL' && styles.tabTextActive]}>[ ALL ]</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabItem, filter === 'PREMIUMS' && styles.tabActive]}
                        onPress={() => setFilter('PREMIUMS')}
                    >
                        <Text style={[styles.tabText, filter === 'PREMIUMS' && styles.tabTextActive]}>PREMIUMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabItem, filter === 'CLAIMS' && styles.tabActive]}
                        onPress={() => setFilter('CLAIMS')}
                    >
                        <Text style={[styles.tabText, filter === 'CLAIMS' && styles.tabTextActive]}>CLAIMS</Text>
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <View style={styles.cardDot} />
                        <Text style={styles.cardLabel}>PROTECTED SHIFTS</Text>
                        <View style={styles.cardValueRow}>
                            <Text style={styles.cardValue}>42</Text>
                            <Text style={styles.cardUnit}>UNITS</Text>
                        </View>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.cardDot} />
                        <Text style={styles.cardLabel}>TOTAL PAYOUTS</Text>
                        <View style={styles.cardValueRow}>
                            <Text style={[styles.cardValue, { color: HistoryTheme.primary }]}>$150</Text>
                            <Text style={[styles.cardUnit, { color: 'rgba(0, 255, 148, 0.5)' }]}>.00</Text>
                        </View>
                    </View>
                </View>

                {/* List */}
                <SectionList
                    sections={DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionLine} />
                            <Text style={styles.sectionTitle}>{title}</Text>
                            <View style={styles.sectionLine} />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />

            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HistoryTheme.background,
    },
    glowTopRight: {
        position: 'absolute',
        top: -100, right: -100,
        width: 300, height: 300,
        backgroundColor: 'rgba(0, 255, 148, 0.05)',
        borderRadius: 150,
        zIndex: 0,
    },
    glowBottomLeft: {
        position: 'absolute',
        bottom: -50, left: -50,
        width: 200, height: 200,
        backgroundColor: 'rgba(180, 142, 173, 0.05)',
        borderRadius: 100,
        zIndex: 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    filterTabs: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    tabItem: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tabActive: {
        backgroundColor: 'rgba(0, 255, 148, 0.1)',
        borderColor: HistoryTheme.primary,
    },
    tabText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: HistoryTheme.textMuted,
        letterSpacing: 1,
    },
    tabTextActive: {
        color: HistoryTheme.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: HistoryTheme.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: HistoryTheme.border,
    },
    cardDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: HistoryTheme.primary,
        marginBottom: 8,
    },
    cardLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: HistoryTheme.textMuted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    cardValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    cardValue: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 28,
        color: 'white',
    },
    cardUnit: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: HistoryTheme.textMuted,
        marginLeft: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: HistoryTheme.border,
        position: 'relative',
    },
    itemHighlight: {
        backgroundColor: 'rgba(234, 179, 8, 0.03)',
        marginHorizontal: -20,
        paddingHorizontal: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    highlightBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: '#eab308',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    itemTitle: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 15,
        color: 'white',
    },
    itemStatus: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        letterSpacing: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    itemDate: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: HistoryTheme.textMuted,
    },
    itemAmount: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: HistoryTheme.border,
    },
    sectionTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: HistoryTheme.textMuted,
        letterSpacing: 2,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemMeta: {
        flex: 1,
    },
    metaText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: 'white',
        marginBottom: 4,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: HistoryTheme.textMuted,
        marginHorizontal: 8,
    },
    metaHash: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: HistoryTheme.textMuted,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 255, 148, 0.1)',
    },
    badgeText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 9,
        color: HistoryTheme.primary,
        letterSpacing: 1,
    },
    badgePending: {
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    badgeTextPending: {
        color: '#eab308',
    },
});

