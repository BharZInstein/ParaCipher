import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupportScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="SUPPORT" subtitle="HELP CENTER" showBack />

            <ScrollView contentContainerStyle={styles.content}>

                <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('https://paracipher.app/faq')}>
                    <View style={styles.iconBox}>
                        <MaterialIcons name="menu-book" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.title}>Documentation</Text>
                        <Text style={styles.subtitle}>Read guides and integration docs</Text>
                    </View>
                    <MaterialIcons name="open-in-new" size={16} color={Colors.gray600} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('mailto:support@paracipher.app')}>
                    <View style={styles.iconBox}>
                        <MaterialIcons name="email" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.title}>Email Support</Text>
                        <Text style={styles.subtitle}>Get help via email</Text>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" size={12} color={Colors.gray600} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('https://discord.gg/paracipher')}>
                    <View style={styles.iconBox}>
                        <MaterialIcons name="chat" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.title}>Community Chat</Text>
                        <Text style={styles.subtitle}>Join our Discord server</Text>
                    </View>
                    <MaterialIcons name="open-in-new" size={16} color={Colors.gray600} />
                </TouchableOpacity>

            </ScrollView>
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
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceCard,
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
    },
    subtitle: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        marginTop: 4,
    },
});
