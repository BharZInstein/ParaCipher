import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { useWallet } from '@/context/WalletContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import React from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function DepositScreen() {
    const { address } = useWallet();

    const handleCopy = async () => {
        if (address) {
            await Clipboard.setStringAsync(address);
            ToastAndroid.show('Address copied to clipboard', ToastAndroid.SHORT);
        }
    };

    const handleOpenMetaMask = async () => {
        // Deep link to MetaMask Buy/On-ramp
        const url = 'https://metamask.app.link/buy';
        const canOpen = await Linking.canOpenURL(url);

        if (canOpen) {
            await Linking.openURL(url);
        } else {
            // Fallback to standard link or just inform user
            await Linking.openURL('https://metamask.io/download/');
        }
    };

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="RECEIVE ASSETS" subtitle='TOP-UP WALLET' showBack />

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>SCAN QR CODE</Text>

                    <View style={styles.qrContainer}>
                        {address ? (
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={address}
                                    size={200}
                                    color="black"
                                    backgroundColor="transparent"
                                />
                            </View>
                        ) : (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>CONNECT WALLET FIRST</Text>
                            </View>
                        )}
                    </View>

                    <Text style={[styles.label, { marginTop: 32 }]}>YOUR WALLET ADDRESS</Text>
                    <TouchableOpacity style={styles.addressBox} onPress={handleCopy} activeOpacity={0.7}>
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode='middle'>
                            {address || "Not Connected"}
                        </Text>
                        <MaterialIcons name="content-copy" size={20} color={Colors.primary} />
                    </TouchableOpacity>

                    {/* MetaMask Fund Button */}
                    <TouchableOpacity style={[styles.shareBtn, { marginTop: 16, backgroundColor: '#f6851b' }]} onPress={handleOpenMetaMask}>
                        <MaterialIcons name="account-balance-wallet" size={20} color="white" />
                        <Text style={[styles.shareText, { color: 'white' }]}>FUND VIA METAMASK</Text>
                    </TouchableOpacity>

                    <Text style={styles.helperText}>
                        Send only ETH or compatible tokens to this address. Sending other assets may result in permanent loss.
                    </Text>
                </View>

                {/* Share Button (Mock) */}
                <TouchableOpacity style={styles.shareBtn}>
                    <MaterialIcons name="share" size={20} color="black" />
                    <Text style={styles.shareText}>SHARE ADDRESS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        backgroundColor: Colors.surfaceCard,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    qrContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 8,
    },
    qrWrapper: {

    },
    errorContainer: {
        height: 200,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
    },
    errorText: {
        color: '#666',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        width: '100%',
        gap: 12,
    },
    addressText: {
        flex: 1,
        color: 'white',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
    },
    helperText: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 18,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        marginTop: 24,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        gap: 8,
        width: '100%',
    },
    shareText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        letterSpacing: 1,
    },
});
