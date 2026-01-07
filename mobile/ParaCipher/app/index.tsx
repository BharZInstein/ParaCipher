import { Colors, Typography } from '@/constants/Theme';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.replace('/(tabs)');
        }, 2500);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingIconContainer}>
                        <MaterialIcons name="lock" size={32} color={Colors.primary} />
                    </View>
                    <Text style={styles.loadingTitle}>
                        INITIALIZING <Text style={{ fontWeight: '700' }}>SMART WALLET</Text>
                    </Text>
                    <Text style={styles.loadingStatus}>&gt; SECURING_SHIFT _</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
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

                {/* Feature Grid */}
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
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnApple} onPress={handleLogin} activeOpacity={0.8}>
                    <FontAwesome name="apple" size={20} color="black" />
                    <Text style={styles.btnAppleText}>CONTINUE WITH APPLE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnGoogle} onPress={handleLogin} activeOpacity={0.8}>
                    <FontAwesome name="google" size={18} color="white" />
                    <Text style={styles.btnGoogleText}>CONTINUE WITH GOOGLE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnPhone} onPress={handleLogin}>
                    <Text style={styles.btnPhoneText}>[ USE PHONE NUMBER ]</Text>
                </TouchableOpacity>

                <View style={styles.legalContainer}>
                    <Text style={styles.legalText}>
                        By accessing the protocol you agree to our Terms and Privacy.
                    </Text>
                </View>
            </View>

        </SafeAreaView>
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
        marginBottom: 24,
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
        color: Colors.primary,
        fontSize: 12,
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
        height: 100, // Should be adjusted or absolute positioned better
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
});
