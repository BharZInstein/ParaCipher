import { Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Local Theme Overrides
const OracleTheme = {
    primary: "#00ff66", // Neon Green
    primaryDim: "#00cc52",
    background: "#000000",
    surface: "#050505",
    surfaceGrid: "#1a1a1a",
    textMuted: "#71717A",
    textZinc: "#a1a1aa",
};

export default function OracleProcessingScreen() {
    const router = useRouter();

    // Animation Values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse Animation for Active Dot
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 1000,
                    easing: Easing.bezier(0.4, 0, 0.6, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.bezier(0.4, 0, 0.6, 1),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Spin Animation for loading effect (if used)
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Auto-navigate to Success after delay
        const timer = setTimeout(() => {
            router.replace('/simulation/success');
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Grid Background */}
            <View style={styles.gridContainer} pointerEvents="none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 30 }]} />
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                    <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 30 }]} />
                ))}
            </View>

            {/* Top Glow */}
            <View style={styles.topGlow} pointerEvents="none" />

            <View style={styles.content}>

                {/* Drag Handle Indicator */}
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDotWrapper}>
                            <View style={styles.liveDotPing} />
                            <View style={styles.liveDot} />
                        </View>
                        <Text style={styles.liveText}>LIVE ON-CHAIN</Text>
                    </View>

                    <Text style={styles.titleMain}>
                        ORACLE{'\n'}
                        <Text style={styles.titleSub}>PROCESSING</Text>
                    </Text>
                </View>

                {/* Timeline Section */}
                <View style={styles.timelineContainer}>
                    {/* Vertical Line */}
                    <View style={styles.verticalLineMain} />

                    {/* Step 1: Verified */}
                    <View style={styles.stepRow}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircleDone}>
                                <MaterialIcons name="check" size={16} color={OracleTheme.primary} />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.stepTitle, styles.strikethrough]}>Verifying telematics data</Text>
                            <View style={styles.hashBadge}>
                                <Text style={styles.hashText}>HASH: 0x8F...2A</Text>
                            </View>
                        </View>
                    </View>

                    {/* Step 2: Active */}
                    <View style={styles.stepRow}>
                        {/* Connecting Gradient Line Segment */}
                        <LinearGradient
                            colors={['transparent', OracleTheme.primary, 'transparent']}
                            style={styles.activeLineSegment}
                        />

                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircleActive}>
                                <Animated.View style={[styles.activeRing, { transform: [{ scale: pulseAnim }], opacity: 0.2 }]} />
                                <View style={styles.activeDot} />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.stepTitle, { color: 'white', fontSize: 16, fontWeight: '700' }]}>
                                Oracle confirmation received
                            </Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusLine} />
                                <Text style={styles.statusTextActive}>AWAITING CONSENSUS</Text>
                            </View>

                            {/* Data Block Box */}
                            <View style={styles.dataBlock}>
                                <View style={styles.skeletonLine} />
                                <View style={[styles.skeletonLine, { width: 80 }]} />
                                <View style={[styles.skeletonLine, { width: 40 }]} />
                            </View>
                        </View>
                    </View>

                    {/* Step 3: Pending */}
                    <View style={[styles.stepRow, { opacity: 0.4 }]}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCirclePending}>
                                <View style={styles.pendingDot} />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.stepTitle}>Executing smart contract</Text>
                            <Text style={styles.pendingSub}>PENDING FINALIZATION</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                {/* Footer */}
                <View style={styles.footer}>
                    {/* Info Table */}
                    <View style={styles.infoTable}>
                        {/* Row 1 */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabelBox}>
                                <Text style={styles.tableLabel}>SESSION</Text>
                            </View>
                            <View style={styles.tableValueBox}>
                                <Text style={styles.tableValue}>0x4f8a...2b9c</Text>
                                <MaterialIcons name="lock" size={12} color={OracleTheme.textZinc} />
                            </View>
                        </View>
                        {/* Row 2 */}
                        <View style={[styles.tableRow, { borderTopWidth: 0 }]}>
                            <View style={styles.tableLabelBox}>
                                <Text style={styles.tableLabel}>STATUS</Text>
                            </View>
                            <View style={styles.tableValueBox}>
                                <View style={styles.processingDot} />
                                <Text style={styles.processingText}>PROCESSING</Text>
                            </View>
                        </View>
                    </View>

                    {/* Minimize Button */}
                    <TouchableOpacity style={styles.minimizeBtn} onPress={() => router.back()}>
                        <Text style={styles.minimizeText}>MINIMIZE OVERLAY</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={16} color={OracleTheme.textZinc} />
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: OracleTheme.background,
    },
    gridContainer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
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
        top: -100, left: 50,
        width: 300, height: 300,
        backgroundColor: OracleTheme.primary,
        opacity: 0.05,
        borderRadius: 150,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
    },
    header: {
        marginBottom: 40,
        paddingLeft: 8,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0, 255, 102, 0.2)',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    liveDotWrapper: {
        width: 8,
        height: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: OracleTheme.primary,
    },
    liveDotPing: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: OracleTheme.primary,
        opacity: 0.5,
        transform: [{ scale: 1.5 }],
    },
    liveText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: OracleTheme.primary,
        letterSpacing: 2,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    titleMain: {
        fontFamily: Typography.fontFamily.displayBold, // Inter
        fontSize: 40, // 5xl roughly
        color: 'white',
        lineHeight: 40,
        letterSpacing: -1,
    },
    titleSub: {
        color: '#3f3f46', // Zinc-700
    },
    timelineContainer: {
        paddingLeft: 10,
        position: 'relative',
    },
    verticalLineMain: {
        position: 'absolute',
        left: 25, // Center of circles (32px width / 2 + paddingLeft 10 approx)
        top: 16,
        bottom: 40,
        width: 1,
        backgroundColor: '#18181b', // Zinc-900
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 32,
        position: 'relative',
    },
    activeLineSegment: {
        position: 'absolute',
        left: 15,
        top: -30,
        bottom: 20,
        width: 1,
        opacity: 0.8,
    },
    iconContainer: {
        width: 32,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
    },
    iconCircleDone: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#18181b', // Zinc-900
        borderWidth: 1,
        borderColor: '#27272a', // Zinc-800
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: OracleTheme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: OracleTheme.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    activeRing: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: OracleTheme.primary,
    },
    activeDot: {
        width: 8,
        height: 8,
        backgroundColor: OracleTheme.primary,
        borderRadius: 4,
        shadowColor: OracleTheme.primary,
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    iconCirclePending: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: '#27272a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pendingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#27272a',
    },
    textContainer: {
        flex: 1,
        paddingTop: 4,
    },
    stepTitle: {
        fontSize: 15,
        fontFamily: Typography.fontFamily.displayMedium,
        color: OracleTheme.textZinc,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: '#52525b', // Zinc-600
    },
    hashBadge: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#27272a',
        backgroundColor: 'rgba(24, 24, 27, 0.5)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    hashText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    statusLine: {
        width: 16,
        height: 1,
        backgroundColor: 'rgba(0, 255, 102, 0.5)',
    },
    statusTextActive: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: OracleTheme.primary,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    dataBlock: {
        marginTop: 12,
        padding: 12,
        backgroundColor: 'rgba(24, 24, 27, 0.3)', // Zinc-900/30
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(0, 255, 102, 0.3)',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        gap: 6,
    },
    skeletonLine: {
        height: 6,
        width: 64,
        backgroundColor: '#27272a',
        borderRadius: 3,
    },
    pendingSub: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
        marginTop: 4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    footer: {
        paddingBottom: 24,
    },
    infoTable: {
        borderWidth: 1,
        borderColor: '#27272a',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginBottom: 16,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#27272a',
    },
    tableLabelBox: {
        width: '35%',
        borderRightWidth: 1,
        borderRightColor: '#27272a',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(24, 24, 27, 0.2)',
    },
    tableValueBox: {
        width: '65%',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tableLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#71717a', // Zinc-500
        textTransform: 'uppercase',
    },
    tableValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: 'white',
        letterSpacing: 0.5,
    },
    processingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: OracleTheme.primary,
        marginRight: 8,
    },
    processingText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: OracleTheme.primary,
        letterSpacing: 1,
    },
    minimizeBtn: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272a',
        backgroundColor: 'rgba(24, 24, 27, 0.2)',
        gap: 8,
    },
    minimizeText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#a1a1aa', // Zinc-400
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
