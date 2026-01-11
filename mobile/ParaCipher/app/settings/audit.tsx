import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AuditScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="AUDIT REPORT" subtitle="SMART CONTRACT SECURITY" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>AUDIT STATUS: PASSED</Text>
                    <Text style={styles.statusDate}>Completed: Dec 12, 2025</Text>
                </View>
                <Text style={styles.text}>
                    Our smart contracts have been audited by leading security firms. No critical vulnerabilities were found.{'\n\n'}
                    - Reentrancy: Safe{'\n'}
                    - Access Control: Verified{'\n'}
                    - Logic Errors: None Found{'\n\n'}
                    Full report available on GitHub.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundDark },
    content: { padding: 20 },
    statusBox: {
        backgroundColor: 'rgba(25, 230, 94, 0.1)',
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    statusTitle: {
        color: Colors.primary,
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        marginBottom: 4,
    },
    statusDate: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
    },
    text: { color: Colors.gray400, fontFamily: Typography.fontFamily.mono, lineHeight: 24 }
});
