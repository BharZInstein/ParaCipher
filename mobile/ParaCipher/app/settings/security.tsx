import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SecurityScreen() {
    const [twoFactor, setTwoFactor] = useState(true);
    const [biometric, setBiometric] = useState(true);

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="SECURITY" subtitle="ACCOUNT PROTECTION" showBack />

            <View style={styles.content}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AUTHENTICATION</Text>

                    <View style={styles.row}>
                        <View>
                            <Text style={styles.itemTitle}>Biometric Login</Text>
                            <Text style={styles.itemSub}>FaceID / Fingerprint</Text>
                        </View>
                        <Switch
                            value={biometric}
                            onValueChange={setBiometric}
                            trackColor={{ false: '#333', true: 'rgba(25, 230, 94, 0.3)' }}
                            thumbColor={biometric ? Colors.primary : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.row}>
                        <View>
                            <Text style={styles.itemTitle}>2-Factor Authentication</Text>
                            <Text style={styles.itemSub}>Require OTP for withdrawals</Text>
                        </View>
                        <Switch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            trackColor={{ false: '#333', true: 'rgba(25, 230, 94, 0.3)' }}
                            thumbColor={twoFactor ? Colors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DEVICES</Text>
                    <View style={styles.deviceItem}>
                        <MaterialIcons name="phone-iphone" size={24} color={Colors.gray400} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.itemTitle}>iPhone 15 Pro</Text>
                            <Text style={styles.itemSub}>Generic City, US • Active Now</Text>
                        </View>
                        <View style={styles.activeDot} />
                    </View>
                </View>

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
    },
    section: {
        marginBottom: 32,
        backgroundColor: Colors.surfaceCard,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    sectionTitle: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    itemTitle: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
    },
    itemSub: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        marginTop: 2,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
});
