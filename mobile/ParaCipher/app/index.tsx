import { Colors, Typography } from '@/constants/Theme';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRootNavigationState, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Enhanced Loading Component with animations
const LoadingScreen = () => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);
    const rotation = useSharedValue(0);
    const progressWidth = useSharedValue(0);
    const scanLineY = useSharedValue(-20);

    useEffect(() => {
        // Pulsing Icon
        scale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.6, { duration: 800 })
            ),
            -1,
            true
        );
        // Rotating Ring
        rotation.value = withRepeat(
            withTiming(360, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );
        // Progress Bar
        progressWidth.value = withTiming(100, { duration: 2500, easing: Easing.out(Easing.quad) });
        // Scanning Line
        scanLineY.value = withRepeat(
            withSequence(
                withTiming(60, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(-20, { duration: 0 })
            ),
            -1,
            false
        );
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const animatedRingStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
        opacity: 0.6,
    }));

    return (
        <View style={styles.container}>
            {/* Tech Grid Background */}
            <View style={styles.gridBackground}>
                {[...Array(6)].map((_, i) => (
                    <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 16.66}%` }]} />
                ))}
                {[...Array(10)].map((_, i) => (
                    <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 10}%` }]} />
                ))}
            </View>

            <View style={styles.loadingContainer}>
                {/* Outer Rotating Ring */}
                <View style={styles.ringContainer}>
                    <Animated.View style={[styles.rotatingRing, animatedRingStyle]}>
                        <View style={styles.ringSegment} />
                        <View style={[styles.ringSegment, { transform: [{ rotate: '120deg' }] }]} />
                        <View style={[styles.ringSegment, { transform: [{ rotate: '240deg' }] }]} />
                    </Animated.View>

                    {/* Pulsing Lock Icon */}
                    <Animated.View style={[styles.loadingIconContainer, animatedIconStyle]}>
                        <MaterialIcons name="lock" size={36} color={Colors.primary} />
                    </Animated.View>
                </View>

                {/* App Name */}
                <View style={styles.loadingTitleContainer}>
                    <Animated.View style={[styles.scanLine, animatedScanStyle]} />
                    <Text style={styles.loadingAppName}>
                        PARA<Text style={{ color: Colors.primary }}>CIPHER</Text>
                    </Text>
                </View>

                {/* Status Messages */}
                <View style={styles.statusContainer}>
                    <Animated.Text entering={FadeIn.delay(200)} style={styles.loadingStatus}>
                        &gt; INITIALIZING_SECURE_ENVIRONMENT
                    </Animated.Text>
                    <Animated.Text entering={FadeIn.delay(600)} style={styles.loadingStatus}>
                        &gt; VERIFYING_ENCRYPTION_KEYS
                    </Animated.Text>
                    <Animated.Text entering={FadeIn.delay(1000)} style={styles.loadingStatusActive}>
                        &gt; CONNECTING_TO_BLOCKCHAIN...
                    </Animated.Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
                    </View>
                    <Text style={styles.progressText}>LOADING SMART WALLET</Text>
                </View>
            </View>

            {/* Bottom Decoration */}
            <View style={styles.bottomDecor}>
                <View style={styles.decorLine} />
                <Text style={styles.decorText}>SECURED BY ETHEREUM</Text>
                <View style={styles.decorLine} />
            </View>
        </View>
    );
};

export default function LoginScreen() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        // Wait for navigation to be ready
        if (!rootNavigationState?.key) return;

        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            const hasBio = compatible && enrolled;

            setIsBiometricSupported(hasBio);

            // Check Settings
            let isAppLockEnabled = true; // Default true
            try {
                const savedLock = await AsyncStorage.getItem('isAppLockEnabled');
                if (savedLock !== null) {
                    isAppLockEnabled = JSON.parse(savedLock);
                }
            } catch (e) {
                console.warn('Failed to read settings');
            }

            // Only lock if bio is available AND enabled in settings
            if (hasBio && isAppLockEnabled) {
                setIsLocked(true);
                // Auto-prompt after a short delay
                setTimeout(() => {
                    handleBiometricAuth(true);
                }, 500);
            }
        })();
    }, [rootNavigationState?.key]);

    const handleBiometricAuth = async (isAuto = false) => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock ParaCipher',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                handleLogin(true);
            } else {
                if (!isAuto) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
            }
        } catch (error) {
            console.error(error);
            if (!isAuto) Alert.alert('Error', 'Biometric authentication failed.');
        }
    };

    const handleLogin = (immediate = false) => {
        setIsLoading(true);
        const delay = immediate ? 1500 : 2500;

        setTimeout(() => {
            setIsLoading(false);
            router.replace('/(tabs)');
        }, delay);
    };

    const handleReset = () => {
        setIsLocked(false);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.systemBadge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.systemText}>SYSTEM_ONLINE</Text>
                </View>
                <View style={styles.headerLine} />
            </View>

            <View style={styles.content}>
                {/* Decorative Lines */}
                <LinearGradient
                    colors={['transparent', 'rgba(25, 230, 94, 0.5)', 'transparent']}
                    style={styles.leftLine}
                />

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.iconBox}>
                        <Image
                            source={require('../assets/ParaCipher.png')}
                            style={styles.logoImageSmall}
                            resizeMode="contain"
                        />
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerBR} />
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>
                            Para<Text style={styles.titleHighlight}>Cipher</Text>
                        </Text>
                    </View>

                    <LinearGradient
                        colors={[Colors.primary, 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.divider}
                    />

                    <View style={styles.subtextContainer}>
                        <Text style={styles.subtext}>_DECENTRALIZED</Text>
                        <Text style={styles.subtext}>_PARAMETRIC</Text>
                        <Text style={styles.subtext}>_MICRO-INSURANCE</Text>
                    </View>
                </View>

                {/* Feature Grid - Only show if NOT locked (Setup Mode) */}
                {!isLocked && (
                    <View style={styles.gridContainer}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>GAS_FEES</Text>
                            <Text style={styles.gridValue}>NONE</Text>
                        </View>
                        <View style={[styles.gridItem, { borderLeftWidth: 1, borderColor: Colors.gridLine }]}>
                            <Text style={styles.gridLabel}>SETUP</Text>
                            <Text style={styles.gridValue}>INSTANT</Text>
                        </View>
                        <View style={[styles.gridItem, styles.gridFullWidth]}>
                            <Text style={styles.gridLabel}>SECURITY</Text>
                            <Text style={styles.gridValue}>NON-CUSTODIAL // NO SEED PHRASE</Text>
                        </View>
                    </View>
                )}

                {/* Locked Message */}
                {isLocked && (
                    <View style={styles.lockedMessageContainer}>
                        <Text style={styles.lockedMessage}>APP LOCKED · AUTHENTICATION REQUIRED</Text>
                    </View>
                )}
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>

                {/* APP LOCK STATE */}
                {isLocked && (
                    <>
                        <TouchableOpacity style={styles.btnBiometric} onPress={() => handleBiometricAuth(false)} activeOpacity={0.8}>
                            <MaterialIcons name="fingerprint" size={24} color={Colors.primary} />
                            <Text style={styles.btnBiometricText}>UNLOCK APP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
                            <Text style={styles.btnResetText}>[ SWITCH WALLET / RESET ]</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* SETUP STATE */}
                {!isLocked && (
                    <>
                        <TouchableOpacity style={styles.btnApple} onPress={() => handleLogin(false)} activeOpacity={0.8}>
                            <FontAwesome name="apple" size={20} color="black" />
                            <Text style={styles.btnAppleText}>CONNECT WITH APPLE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnGoogle} onPress={() => handleLogin(false)} activeOpacity={0.8}>
                            <FontAwesome name="google" size={18} color="white" />
                            <Text style={styles.btnGoogleText}>CONNECT WITH GOOGLE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnPhone} onPress={() => handleLogin(false)}>
                            <Text style={styles.btnPhoneText}>[ USE PHONE NUMBER ]</Text>
                        </TouchableOpacity>
                    </>
                )}

                <View style={styles.legalContainer}>
                    <Text style={styles.legalText}>
                        By accessing the protocol you agree to our Terms and Privacy.
                    </Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: Colors.gridLine,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom removed as it's handled by parent ringContainer
        backgroundColor: Colors.surfaceHighlight,
    },
    loadingTitle: {
        fontFamily: Typography.fontFamily.display,
        color: 'white',
        fontSize: 20,
        letterSpacing: 1,
        marginBottom: 8,
    },
    loadingStatus: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray400,
        fontSize: 10,
        marginTop: 4,
    },
    loadingStatusActive: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.primary,
        fontSize: 10,
        marginTop: 4,
    },
    gridBackground: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
    },
    gridLineV: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: Colors.gridLine,
    },
    gridLineH: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.gridLine,
    },
    ringContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    rotatingRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringSegment: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'transparent',
        borderTopColor: Colors.primary,
    },
    loadingTitleContainer: {
        position: 'relative',
        marginBottom: 24,
        overflow: 'hidden',
    },
    loadingAppName: {
        fontFamily: Typography.fontFamily.displayBold,
        color: 'white',
        fontSize: 28,
        letterSpacing: 4,
    },
    statusContainer: {
        alignItems: 'flex-start',
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    progressContainer: {
        width: '80%',
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    progressText: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray500,
        fontSize: 9,
        letterSpacing: 2,
        marginTop: 12,
    },
    bottomDecor: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    decorLine: {
        width: 40,
        height: 1,
        backgroundColor: Colors.gridLine,
    },
    decorText: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray600,
        fontSize: 8,
        letterSpacing: 2,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 2,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(34,34,34,0.3)',
    },
    systemBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    systemText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray400,
        letterSpacing: 2,
    },
    headerLine: {
        width: 48,
        height: 1,
        backgroundColor: Colors.gridLine,
    },
    content: {
        paddingHorizontal: 32,
        width: '100%',
        position: 'relative',
    },
    leftLine: {
        position: 'absolute',
        left: 32,
        top: -20,
        bottom: -20,
        width: 1,
        height: 100,
    },
    logoSection: {
        marginBottom: 32,
    },
    iconBox: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(10,10,10,0.5)',
        borderWidth: 1,
        borderColor: Colors.gridLine,
        position: 'relative',
    },
    logoImageSmall: {
        width: 52,
        height: 52,
    },
    cornerTL: {
        position: 'absolute',
        top: -1,
        left: -1,
        width: 8,
        height: 8,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: Colors.primary,
    },
    cornerBR: {
        position: 'absolute',
        bottom: -1,
        right: -1,
        width: 8,
        height: 8,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.accentBlue,
    },
    titleContainer: {
        marginBottom: 16,
    },
    titleText: {
        fontFamily: Typography.fontFamily.displayLight,
        fontSize: 48,
        color: 'white',
        lineHeight: 48,
        letterSpacing: -1,
    },
    titleHighlight: {
        fontFamily: Typography.fontFamily.displayBold,
        color: Colors.primary,
    },
    divider: {
        height: 1,
        width: 64,
        marginBottom: 16,
    },
    subtextContainer: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.gridLine,
        paddingLeft: 16,
    },
    subtext: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray400,
        fontSize: 12,
        lineHeight: 18,
    },
    gridContainer: {
        marginTop: 32,
        borderWidth: 1,
        borderColor: Colors.gridLine,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '50%',
        padding: 12,
        backgroundColor: Colors.backgroundDark,
        gap: 4,
    },
    gridFullWidth: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: Colors.gridLine,
    },
    gridLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray500,
    },
    gridValue: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 12,
        color: 'white',
    },
    footer: {
        padding: 24,
        gap: 12,
    },
    btnBiometric: {
        height: 56,
        backgroundColor: 'rgba(39, 228, 114, 0.1)',
        borderWidth: 1,
        borderColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 8,
    },
    btnBiometricText: {
        fontFamily: Typography.fontFamily.displayBold,
        color: Colors.primary,
        fontSize: 14,
        letterSpacing: 1,
    },
    btnApple: {
        height: 56,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    btnAppleText: {
        fontFamily: Typography.fontFamily.displayBold,
        color: 'black',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    btnGoogle: {
        height: 56,
        backgroundColor: Colors.surfaceDark,
        borderWidth: 1,
        borderColor: Colors.gridLine,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    btnGoogleText: {
        fontFamily: Typography.fontFamily.displayBold,
        color: 'white',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    btnPhone: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPhoneText: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray400,
        fontSize: 13,
    },
    legalContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(34,34,34,0.3)',
        paddingTop: 12,
        alignItems: 'center',
    },
    legalText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray600,
        textAlign: 'center',
        maxWidth: 240,
    },
    lockedMessageContainer: {
        marginTop: 48,
        alignItems: 'center',
    },
    lockedMessage: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.primary,
        fontSize: 12,
        letterSpacing: 2,
        textAlign: 'center',
    },
    btnReset: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    btnResetText: {
        fontFamily: Typography.fontFamily.mono,
        color: Colors.gray400,
        fontSize: 11,
        letterSpacing: 1,
    },
});
