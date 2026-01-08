import CustomToggle from '@/components/CustomToggle';
import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SecurityToggle = ({ label, icon, initialValue }: { label: string, icon: keyof typeof MaterialIcons.glyphMap, initialValue: boolean }) => {
    const [isEnabled, setIsEnabled] = useState(initialValue);

    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                    <MaterialIcons name={icon} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <CustomToggle value={isEnabled} onValueChange={(val) => {
                HapticFeedback.success();
                setIsEnabled(val);
            }} />
        </View>
    );
};

export default function SecurityScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Security" showBack />

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Authentication</Text>
                    <SecurityToggle label="Two-Factor Auth (2FA)" icon="security" initialValue={true} />
                    <SecurityToggle label="Biometric Login" icon="fingerprint" initialValue={false} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Privacy</Text>
                    <SecurityToggle label="Share Usage Data" icon="analytics" initialValue={true} />
                    <SecurityToggle label="Location Tracking" icon="location-on" initialValue={true} />
                </View>

                <TouchableOpacity style={styles.dangerBtn}>
                    <MaterialIcons name="delete-forever" size={20} color="#FF4444" />
                    <Text style={styles.dangerText}>Delete Account</Text>
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
        gap: 32,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: Colors.gray500,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceBorder,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 255, 102, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 14,
    },
    dangerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.3)',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 68, 68, 0.05)',
        gap: 8,
        marginTop: 20,
    },
    dangerText: {
        color: '#FF4444',
        fontFamily: Typography.fontFamily.displayBold,
    },
});
