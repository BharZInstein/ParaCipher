import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Local Theme Overrides for Emergency Style
const EmergencyTheme = {
    primary: "#FF3B30", // Emergency Red
    primaryDark: "#b91c1c",
    accent: "#00F0FF", // Cyan
    background: "#08080A",
    surface: "#121214",
    surfaceBorder: "#27272A",
    textMuted: "#71717A",
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AccidentMatchScreen() {
    const router = useRouter();
    const progress = useRef(new Animated.Value(0)).current;

    // Waveform Animation not strictly necessary to be real-time for visual demo, but let's try a simple offset
    // For now static SVG waveform as per design is fine, maybe pulse opacity.

    const handleSimulate = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/simulation/processing');
    };

    const resetProgress = () => {
        Animated.timing(progress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 3000, // 3 seconds hold
                    useNativeDriver: true,
                }).start(({ finished }) => {
                    if (finished) {
                        handleSimulate();
                    }
                });
            },
            onPanResponderRelease: () => {
                progress.stopAnimation();
                resetProgress();
            },
            onPanResponderTerminate: () => {
                progress.stopAnimation();
                resetProgress();
            },
        })
    ).current;

    // SVG Circle Props
    const size = 200;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const strokeDashoffset = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.container}>
            <TechBackground />

            {/* Header */}
            <UnifiedHeader
                title="DETECTION ACTIVE"
                subtitle="LIVE"
                showBack
                onBack={() => router.back()}
            />

            <View style={styles.content}>

                {/* Data Card */}
                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['rgba(255, 59, 48, 0.4)', 'transparent', 'transparent', 'rgba(0, 240, 255, 0.4)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardBorderGradient} // Simulated borders via padding
                    >
                        <View style={styles.cardContent}>
                            {/* Card Corners */}
                            <View style={[styles.corner, styles.tl, { borderColor: EmergencyTheme.primary }]} />
                            <View style={[styles.corner, styles.tr, { borderColor: EmergencyTheme.accent }]} />
                            <View style={[styles.corner, styles.bl, { borderColor: EmergencyTheme.accent }]} />
                            <View style={[styles.corner, styles.br, { borderColor: EmergencyTheme.primary }]} />

                            {/* Top Row */}
                            <View style={styles.cardStatsRow}>
                                <View>
                                    <Text style={styles.statLabel}>STABILITY INDEX</Text>
                                    <View style={styles.statMainValue}>
                                        <Text style={styles.statValue}>98.4</Text>
                                        <Text style={styles.statUnit}>%</Text>
                                    </View>
                                </View>
                                <View style={styles.gpsBadge}>
                                    <MaterialIcons name="satellite-alt" size={14} color={EmergencyTheme.accent} />
                                    <Text style={styles.gpsText}>GPS LOCKED</Text>
                                </View>
                            </View>

                            {/* Waveform */}
                            <View style={styles.waveformContainer}>
                                <Svg height="50" width="100%" viewBox="0 0 400 50">
                                    <Defs>
                                        <SvgLinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                                            <Stop offset="0" stopColor={EmergencyTheme.accent} stopOpacity="0.1" />
                                            <Stop offset="0.5" stopColor={EmergencyTheme.accent} stopOpacity="0.8" />
                                            <Stop offset="1" stopColor={EmergencyTheme.accent} stopOpacity="0.1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Path
                                        d="M0 25 Q 100 55, 200 25 T 400 25"
                                        fill="none"
                                        stroke="url(#waveGrad)"
                                        strokeWidth="2"
                                    />
                                    <Circle cx="200" cy="25" r="3" fill="white" />
                                </Svg>
                            </View>

                            {/* Grid Stats */}
                            <View style={styles.gridStats}>
                                <View style={[styles.gridItem, { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }]}>
                                    <Text style={styles.gridLabel}>G-FORCE</Text>
                                    <Text style={styles.gridValue}>1.02g</Text>
                                </View>
                                <View style={[styles.gridItem, { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }]}>
                                    <Text style={styles.gridLabel}>SPEED</Text>
                                    <Text style={styles.gridValue}>0 <Text style={{ fontSize: 10, color: EmergencyTheme.textMuted }}>km/h</Text></Text>
                                </View>
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>IMPACT</Text>
                                    <Text style={[styles.gridValue, { color: EmergencyTheme.textMuted }]}>--</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={{ flex: 1 }} />

                {/* Big Button Area */}
                <View style={styles.actionArea}>
                    {/* Background Rings */}
                    <View style={[styles.bgRing, { width: 300, height: 300, opacity: 0.05 }]} />
                    <View style={[styles.bgRing, { width: 450, height: 450, opacity: 0.03 }]} />

                    <View style={styles.buttonWrapper} {...panResponder.panHandlers}>
                        <View style={styles.buttonGlow} />

                        {/* Scale Animation could go here on touch */}
                        <LinearGradient
                            colors={[EmergencyTheme.primary, '#b91c1c']}
                            style={styles.mainButton}
                        >
                            <MaterialIcons name="policy" size={32} color="white" />
                            <Text style={styles.btnTitle}>SIMULATE</Text>
                            <Text style={styles.btnSub}>ACCIDENT</Text>
                        </LinearGradient>

                        {/* SVG Progress Ring */}
                        <View style={styles.progressRingContainer}>
                            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                                <Circle
                                    cx={size / 2} cy={size / 2} r={radius}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth={strokeWidth / 2}
                                    fill="none"
                                />
                                <AnimatedCircle
                                    cx={size / 2} cy={size / 2} r={radius}
                                    stroke="white"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </Svg>
                        </View>
                    </View>

                    <Text style={styles.holdText}>PRESS & HOLD 3S</Text>
                </View>

                {/* Footer Warning */}
                <View style={styles.footer}>
                    <View style={styles.warningBox}>
                        <View style={styles.warningLine} />
                        <View>
                            <Text style={styles.warningTitle}>IRREVERSIBLE ACTION</Text>
                            <Text style={styles.warningText}>
                                This triggers an instant blockchain settlement. Only execute for verified emergencies or required testing protocols.
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: EmergencyTheme.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    cardContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardBorderGradient: {
        padding: 1,
        borderRadius: 16,
    },
    cardContent: {
        backgroundColor: EmergencyTheme.surface,
        borderRadius: 15, // 16 - 1
        padding: 20,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderWidth: 0,
    },
    tl: { top: 8, left: 8, borderTopWidth: 1, borderLeftWidth: 1, borderRadius: 2 },
    tr: { top: 8, right: 8, borderTopWidth: 1, borderRightWidth: 1, borderRadius: 2 },
    bl: { bottom: 8, left: 8, borderBottomWidth: 1, borderLeftWidth: 1, borderRadius: 2 },
    br: { bottom: 8, right: 8, borderBottomWidth: 1, borderRightWidth: 1, borderRadius: 2 },

    cardStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    statLabel: {
        fontSize: 10,
        fontFamily: Typography.fontFamily.mono,
        color: EmergencyTheme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statMainValue: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '600',
        color: 'white',
    },
    statUnit: {
        fontSize: 12,
        fontFamily: Typography.fontFamily.mono,
        color: EmergencyTheme.textMuted,
    },
    gpsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(39, 39, 42, 0.5)',
        borderWidth: 1,
        borderColor: EmergencyTheme.surfaceBorder,
        borderRadius: 4,
    },
    gpsText: {
        fontSize: 10,
        fontFamily: Typography.fontFamily.mono,
        color: EmergencyTheme.accent,
    },
    waveformContainer: {
        height: 48,
        marginBottom: 24,
        opacity: 0.8,
    },
    gridStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(39, 39, 42, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    gridItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        gap: 4,
    },
    gridLabel: {
        fontSize: 9,
        fontFamily: Typography.fontFamily.mono,
        color: EmergencyTheme.textMuted,
        textTransform: 'uppercase',
    },
    gridValue: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    actionArea: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        position: 'relative',
    },
    bgRing: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: EmergencyTheme.primary,
    },
    buttonWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonGlow: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: EmergencyTheme.primary,
        opacity: 0.2,
        shadowColor: EmergencyTheme.primary,
        shadowRadius: 40,
        shadowOpacity: 0.5,
    },
    mainButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: EmergencyTheme.primary,
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    btnTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: 'white',
        marginTop: 4,
        letterSpacing: -0.5,
    },
    btnSub: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1,
    },
    progressRingContainer: {
        position: 'absolute',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    holdText: {
        marginTop: 32,
        fontSize: 10,
        fontFamily: Typography.fontFamily.mono,
        color: EmergencyTheme.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    footer: {
        paddingBottom: 32,
    },
    warningBox: {
        flexDirection: 'row',
        paddingLeft: 16,
        position: 'relative',
    },
    warningLine: {
        position: 'absolute',
        left: 0,
        top: 0, bottom: 0,
        width: 2,
        backgroundColor: EmergencyTheme.primary,
    },
    warningTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    warningText: {
        color: EmergencyTheme.textMuted,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Typography.fontFamily.mono,
    }
});
