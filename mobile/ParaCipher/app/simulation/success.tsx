import { Typography } from '@/constants/Theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Local Theme Overrides
const SuccessTheme = {
    primary: "#19e65e", // Neon Green
    primaryDark: "#14b84b",
    background: "#050505",
    surfaceCard: "#0A0A0A",
    textZinc: "#71717a",
    border: "rgba(255, 255, 255, 0.1)",
};

export default function PayoutSuccessScreen() {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleDone = () => {
        router.replace('/(tabs)');
    };

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

            <View style={styles.header}>
                <TouchableOpacity onPress={handleDone} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={24} color="#71717a" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>

                {/* Visual Confirmation */}
                <View style={styles.confirmationSection}>
                    <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
                        {/* Tech Corners */}
                        <View style={[styles.techCorner, styles.tl]} />
                        <View style={[styles.techCorner, styles.br]} />

                        <View style={styles.checkBox}>
                            <MaterialIcons name="check" size={40} color={SuccessTheme.primary} />
                        </View>
                    </Animated.View>

                    <Text style={styles.successTitle}>PAYMENT SUCCESSFUL</Text>

                    <View style={styles.amountContainer}>
                        <View style={styles.amountDecorLeft} />
                        <View style={styles.amountContent}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <Text style={styles.amountText}>2,000</Text>
                        </View>
                        <View style={styles.amountDecorRight} />
                    </View>

                    <View style={styles.creditedBadge}>
                        <View style={styles.creditedDot} />
                        <Text style={styles.creditedText}>CREDITED INSTANTLY</Text>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsHeaderRow}>
                        <Text style={styles.detailsHeader}>TRANSACTION DETAILS</Text>
                        <View style={styles.detailsDivider} />
                    </View>

                    <View style={styles.detailsList}>
                        {/* Reference */}
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Reference</Text>
                            <View style={styles.detailValueRow}>
                                <Text style={styles.detailValueMono}>0x71C...9A2</Text>
                                <MaterialCommunityIcons name="content-copy" size={14} color="#52525b" />
                            </View>
                        </View>

                        {/* Network */}
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Network</Text>
                            <View style={styles.detailValueRow}>
                                <View style={styles.networkDot} />
                                <Text style={styles.detailValue}>Polygon Mainnet</Text>
                            </View>
                        </View>

                        {/* Time */}
                        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.detailLabel}>Time</Text>
                            <Text style={[styles.detailValueMono, { color: '#d4d4d8' }]}>Oct 24, 10:42 AM</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.explorerLink}>
                        <Text style={styles.explorerText}>VIEW ON BLOCK EXPLORER</Text>
                        <MaterialIcons name="arrow-outward" size={12} color="#52525b" />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }} />

                {/* Done Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.9}>
                        <Text style={styles.doneBtnText}>DONE</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SuccessTheme.background,
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
        top: -150, left: width / 2 - 150,
        width: 300, height: 300,
        backgroundColor: SuccessTheme.primary,
        opacity: 0.1,
        borderRadius: 150,
        transform: [{ scaleX: 1.5 }],
    },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    closeBtn: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingTop: 24,
    },
    confirmationSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    checkContainer: {
        width: 80,
        height: 80,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    techCorner: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderColor: SuccessTheme.primary,
        borderWidth: 2,
    },
    tl: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
    br: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },
    checkBox: {
        width: 80,
        height: 80,
        backgroundColor: SuccessTheme.surfaceCard,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: SuccessTheme.primary,
        letterSpacing: 2,
        marginBottom: 16,
        opacity: 0.8,
        textTransform: 'uppercase',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    amountDecorLeft: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(25, 230, 94, 0.5)',
        marginRight: 24,
    },
    amountDecorRight: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(25, 230, 94, 0.5)',
        marginLeft: 24,
    },
    amountContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currencySymbol: {
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 28,
        color: '#71717a',
        marginTop: 6,
        marginRight: 4,
    },
    amountText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 56,
        color: 'white',
        letterSpacing: -1,
    },
    creditedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(25, 230, 94, 0.05)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(25, 230, 94, 0.2)',
        gap: 8,
    },
    creditedDot: {
        width: 6,
        height: 6,
        backgroundColor: SuccessTheme.primary,
        shadowColor: SuccessTheme.primary,
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    creditedText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: SuccessTheme.primary,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    detailsContainer: {
        paddingHorizontal: 24,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    detailsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-between',
    },
    detailsHeader: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    detailsDivider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 16,
    },
    detailsList: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    detailLabel: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#71717a',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    detailValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailValueMono: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: '#d4d4d8',
    },
    detailValue: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: 'white',
    },
    networkDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8247E5', // Polygon Purple
        shadowColor: '#8247E5',
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    explorerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    explorerText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: '#52525b',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    footer: {
        padding: 24,
        paddingBottom: 32,
    },
    doneBtn: {
        backgroundColor: SuccessTheme.primary,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneBtnText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        fontWeight: '700',
        color: 'black',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
