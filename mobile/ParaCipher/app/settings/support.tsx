import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupportScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Help & Support" showBack />

            <View style={styles.content}>
                <View style={styles.card}>
                    <MaterialIcons name="support-agent" size={48} color={Colors.primary} />
                    <Text style={styles.title}>How can we help?</Text>
                    <Text style={styles.desc}>
                        Our support team is available 24/7 to assist you with any issues related to shifts, payouts, or account security.
                    </Text>
                </View>

                <TouchableOpacity style={styles.contactBtn}>
                    <MaterialIcons name="chat" size={24} color="black" />
                    <Text style={styles.contactBtnText}>Start Live Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn}>
                    <MaterialIcons name="email" size={24} color="white" />
                    <Text style={styles.secondaryBtnText}>Email Support</Text>
                </TouchableOpacity>

                <View style={styles.faqSection}>
                    <Text style={styles.sectionTitle}>FAQ</Text>
                    <TouchableOpacity style={styles.faqItem}>
                        <Text style={styles.faqText}>How are payouts calculated?</Text>
                        <MaterialIcons name="chevron-right" size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.faqItem}>
                        <Text style={styles.faqText}>What is the coverage limit?</Text>
                        <MaterialIcons name="chevron-right" size={20} color={Colors.gray500} />
                    </TouchableOpacity>
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
        gap: 16,
    },
    card: {
        backgroundColor: Colors.surfaceCard,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        marginBottom: 8,
    },
    title: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 18,
        marginTop: 16,
        marginBottom: 8,
    },
    desc: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.display,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    contactBtn: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    contactBtnText: {
        color: 'black',
        fontFamily: Typography.fontFamily.displayBold,
        textTransform: 'uppercase',
    },
    secondaryBtn: {
        backgroundColor: Colors.surfaceHighlight,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    secondaryBtnText: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        textTransform: 'uppercase',
    },
    faqSection: {
        marginTop: 24,
    },
    sectionTitle: {
        color: Colors.gray500,
        fontFamily: Typography.fontFamily.mono,
        marginBottom: 12,
    },
    faqItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceBorder,
    },
    faqText: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayMedium,
    },
});
