import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { BLOCKCHAIN_CONFIG } from '@/constants/Blockchain';
import { Typography } from '@/constants/theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

// Screen Dimensions
const { width } = Dimensions.get('window');

// Local overrides for this specific design
const ScreenColors = {
    primary: "#10b981",
    primaryGlow: "#34d399",
    background: "#050505",
    surfaceDark: "#0f0f0f",
    surfaceBorder: "#1f1f1f",
    disabled: "#444444",
};

// 6 hours in seconds for demo
const COVERAGE_DURATION_SECONDS = BLOCKCHAIN_CONFIG.COVERAGE_DURATION * 60 * 60;

export default function ActiveShiftScreen() {
    const router = useRouter();
    // For demo: start with full 6 hours
    const [timeRemaining, setTimeRemaining] = useState(COVERAGE_DURATION_SECONDS);
    const [isActive, setIsActive] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);

    // Simulate purchase on mount (demo - deduct 5 SHM conceptually)
    useEffect(() => {
        setIsPurchasing(true);
        // Simulate a 2-second "transaction"
        const timer = setTimeout(() => {
            setIsPurchasing(false);
            setPurchaseComplete(true);
            console.log('[ActiveShift] Coverage purchased! 5 SHM deducted (demo)');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Countdown timer - only starts after purchase
    useEffect(() => {
        if (!purchaseComplete || timeRemaining <= 0) return;
        const interval = setInterval(() => {
            setTimeRemaining(t => {
                const newTime = t - 1;
                if (newTime <= 0) {
                    setIsActive(false);
                    return 0;
                }
                return newTime;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [purchaseComplete, timeRemaining]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return {
            h: hours.toString().padStart(2, '0'),
            m: mins.toString().padStart(2, '0'),
            s: secs.toString().padStart(2, '0')
        };
    };

    const time = formatTime(timeRemaining);

    const handleEndShift = () => {
        HapticFeedback.heavy();
        Alert.alert("End Shift", "Confirm ending shift?", [
            {
                text: "Cancel", style: "cancel", onPress: () => {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            },
            { text: "End", style: "destructive", onPress: () => router.back() }
        ]);
    };

    // Slider Logic
    const SLIDER_CONTAINER_PADDING = 6;
    const SLIDER_HEIGHT = 72;
    // Calculate slider width based on screen width with padding
    const SLIDER_WIDTH = width - 48 - (SLIDER_CONTAINER_PADDING * 2);
    const BUTTON_WIDTH = SLIDER_HEIGHT - (SLIDER_CONTAINER_PADDING * 2); // Square knob
    const MAX_SLIDE = width - 48 - 12 - BUTTON_WIDTH; // Total width - margins - padding - button

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                HapticFeedback.light();
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: 0
                });
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0 && gestureState.dx <= MAX_SLIDE) {
                    pan.x.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                pan.flattenOffset();
                if (gestureState.dx > MAX_SLIDE * 0.8) {
                    // Snap to end and trigger action
                    Animated.spring(pan, {
                        toValue: { x: MAX_SLIDE, y: 0 },
                        useNativeDriver: false
                    }).start(() => handleEndShift());
                } else {
                    // Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            }
        })
    ).current;

    return (
        <View style={styles.container}>
            <TechBackground />

            {/* Top Glow - Modified for this screen */}
            <View style={styles.glowTopRight} pointerEvents="none" />

            <View style={styles.content}>
                <UnifiedHeader
                    title="PARACIPHER"
                    subtitle="ACTIVE SHIFT"
                    showBack
                    onBack={() => router.back()}
                />

                {/* Main Display */}
                <View style={styles.mainSection}>
                    {/* Status Pill */}
                    <View style={[styles.statusPill, !isActive && styles.statusPillExpired]}>
                        <View style={styles.pingContainer}>
                            {isPurchasing ? (
                                <ActivityIndicator size="small" color={ScreenColors.primary} />
                            ) : (
                                <>
                                    <View style={[styles.pingDot, !isActive && styles.pingDotExpired]} />
                                    <View style={[styles.pingRing, !isActive && styles.pingRingExpired]} />
                                </>
                            )}
                        </View>
                        <Text style={[styles.statusText, !isActive && styles.statusTextExpired]}>
                            {isPurchasing ? 'PURCHASING...' : isActive ? 'COVERAGE ACTIVE' : 'COVERAGE EXPIRED'}
                        </Text>
                        {!isPurchasing && isActive && (
                            <>
                                <View style={styles.pillDivider} />
                                <View style={styles.secureBadge}>
                                    <MaterialIcons name="verified-user" size={14} color={ScreenColors.primary} />
                                    <Text style={[styles.statusText, { color: ScreenColors.primary }]}>SECURE</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Timer */}
                    <View style={styles.timerWrapper}>
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}>{time.h}</Text>

                            {/* Vertical Dots Separator */}
                            <View style={styles.separatorContainer}>
                                <View style={styles.separatorDot} />
                                <View style={styles.separatorDot} />
                            </View>

                            <Text style={styles.timerText}>{time.m}</Text>
                        </View>

                        {/* Elapsed Seconds */}
                        <View style={styles.elapsedContainer}>
                            <Text style={styles.elapsedLabel}>ELAPSED TIME</Text>
                            <View style={styles.secondsRow}>
                                <Text style={styles.secondsValue}>{time.s}</Text>
                                <Text style={styles.secondsLabel}>s</Text>
                            </View>
                        </View>
                    </View>

                    {/* Coverage Info */}
                    <View style={styles.metricsContainer}>
                        <View style={styles.metricsHeader}>
                            <Text style={styles.metricsTitle}>COVERAGE DETAILS</Text>
                            <MaterialIcons name="verified-user" size={16} color={ScreenColors.primary} />
                        </View>

                        <View style={styles.metricCard}>
                            <View style={styles.metricLeft}>
                                <View style={styles.metricIconBox}>
                                    <MaterialCommunityIcons name="shield-check" size={18} color={ScreenColors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.metricLabel}>PREMIUM PAID</Text>
                                    <Text style={styles.metricSub}>Coverage Cost</Text>
                                </View>
                            </View>
                            <Text style={styles.metricValue}>{BLOCKCHAIN_CONFIG.PREMIUM_AMOUNT} SHM</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <View style={styles.metricLeft}>
                                <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                    <MaterialCommunityIcons name="cash-multiple" size={18} color={ScreenColors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.metricLabel}>MAX PAYOUT</Text>
                                    <Text style={styles.metricSub}>If Claim Approved</Text>
                                </View>
                            </View>
                            <Text style={styles.metricValue}>{BLOCKCHAIN_CONFIG.PAYOUT_AMOUNT} SHM</Text>
                        </View>

                        {/* File Claim Button */}
                        <TouchableOpacity
                            style={[styles.fileClaimBtn, !isActive && styles.fileClaimBtnDisabled]}
                            onPress={() => {
                                if (!isActive) {
                                    Alert.alert("Coverage Expired", "Your coverage has expired. Start a new shift to file claims.");
                                    return;
                                }
                                HapticFeedback.light();
                                router.push('/claim');
                            }}
                            activeOpacity={isActive ? 0.8 : 1}
                            disabled={isPurchasing}
                        >
                            <MaterialIcons name="report-problem" size={20} color={isActive ? "white" : "#888"} />
                            <Text style={[styles.fileClaimText, !isActive && styles.fileClaimTextDisabled]}>
                                {isActive ? 'FILE A CLAIM' : 'COVERAGE EXPIRED'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer Slider */}
                <View style={styles.footer}>
                    <View
                        style={styles.sliderContainer}
                    >
                        <View style={styles.sliderTextContainer}>
                            <Text style={styles.sliderText}>SLIDE TO END SHIFT</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="rgba(255,255,255,0.2)" />
                        </View>

                        {/* Draggable Knob */}
                        <Animated.View
                            style={[
                                styles.sliderKnob,
                                {
                                    transform: [{ translateX: pan.x }]
                                }
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <MaterialIcons name="power-settings-new" size={24} color="black" />
                        </Animated.View>
                    </View>

                    <View style={styles.syncRow}>
                        <View style={styles.syncLeft}>
                            <View style={[styles.dot, { backgroundColor: ScreenColors.primary }]} />
                            <Text style={styles.syncText}>SYNCING</Text>
                        </View>
                        <Text style={styles.syncText}>TX: 0x7f...3a2b</Text>
                    </View>

                    {/* DEMO ONLY BUTTON */}
                    <TouchableOpacity
                        style={styles.demoAccidentBtn}
                        onPress={() => router.push('/simulation/accident')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="alert-octagon" size={14} color="#ef4444" />
                        <Text style={styles.demoAccidentText}>TEST ACCIDENT FLOW</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ScreenColors.background,
    },
    glowTopRight: {
        position: 'absolute',
        top: 0, right: 0,
        width: 300, height: 300,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderRadius: 150,
    },
    content: {
        flex: 1,
        paddingVertical: 12,
    },
    mainSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        flex: 1,
        justifyContent: 'center',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 48,
        gap: 12,
    },
    pingContainer: {
        position: 'relative',
        width: 10,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ScreenColors.primary,
    },
    pingRing: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ScreenColors.primary,
        opacity: 0.3,
        transform: [{ scale: 1.5 }],
    },
    statusText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 1.5,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    pillDivider: {
        width: 1,
        height: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timerWrapper: {
        alignItems: 'center',
        marginBottom: 64,
        width: '100%',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    timerText: {
        fontFamily: Typography.fontFamily.displayLight,
        fontSize: 84,
        color: 'white',
        lineHeight: 90,
        includeFontPadding: false,
    },
    separatorContainer: {
        height: 50,
        justifyContent: 'space-evenly',
        paddingVertical: 8,
    },
    separatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#333', // Darker dots as in image
    },
    elapsedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 240,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 16,
        marginTop: 8,
    },
    elapsedLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    secondsRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    secondsValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 22,
        color: ScreenColors.primary,
        fontWeight: '600',
    },
    secondsLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: ScreenColors.primary,
        fontWeight: '600',
    },
    metricsContainer: {
        width: '100%',
        maxWidth: 340,
    },
    metricsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 12,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    metricsTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    metricCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12, // Increased border radius
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginBottom: 12,
    },
    metricLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    metricIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    metricSub: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 15,
        color: 'white',
        letterSpacing: -0.2,
    },
    metricValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 20,
        color: 'white',
        letterSpacing: 0,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    sliderContainer: {
        height: 72,
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        padding: 6,
        position: 'relative',
        justifyContent: 'center',
        marginBottom: 32,
    },
    sliderTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 40, // Offset text to center properly
    },
    sliderText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        fontWeight: '700',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginRight: 8,
    },
    sliderKnob: {
        position: 'absolute',
        left: 6,
        top: 6, bottom: 6,
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'white',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 10
    },
    syncRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    syncLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    syncText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: 'rgba(255,255,255,0.2)', // Darker text
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    demoAccidentBtn: {
        marginTop: 24,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)', // Red border low opacity
        borderRadius: 4,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    demoAccidentText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#ef4444',
        letterSpacing: 1,
        fontWeight: '700',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    fileClaimBtn: {
        marginTop: 16,
        backgroundColor: ScreenColors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    fileClaimBtnDisabled: {
        backgroundColor: ScreenColors.disabled,
    },
    fileClaimText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: 'white',
        letterSpacing: 1,
    },
    fileClaimTextDisabled: {
        color: '#888',
    },
    statusPillExpired: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    pingDotExpired: {
        backgroundColor: '#EF4444',
    },
    pingRingExpired: {
        backgroundColor: '#EF4444',
    },
    statusTextExpired: {
        color: '#F87171',
    },
});
