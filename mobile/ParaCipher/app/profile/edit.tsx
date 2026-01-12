import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Edit Profile" showBack />

            <View style={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value="Mithil"
                        placeholderTextColor={Colors.gray600}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email ID</Text>
                    <TextInput
                        style={styles.input}
                        value="mithil@paraciphersystems.com"
                        placeholderTextColor={Colors.gray600}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value="+91 98765 43210"
                        placeholderTextColor={Colors.gray600}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save Changes</Text>
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
        gap: 24,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.display,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: Colors.surfaceCard,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontFamily: Typography.fontFamily.displayMedium,
        fontSize: 16,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
