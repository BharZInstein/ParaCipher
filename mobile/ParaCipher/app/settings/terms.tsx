import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TermsScreen() {
    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="TERMS OF SERVICE" subtitle="LEGAL" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>
                    1. Acceptance of Terms{'\n'}
                    By accessing or using the ParaCipher app, you agree to be bound by these terms.{'\n\n'}
                    2. Service Description{'\n'}
                    ParaCipher provides decentralized parametric insurance protocols.{'\n\n'}
                    3. No Financial Advice{'\n'}
                    The content provided is for informational purposes only.{'\n\n'}
                    4. Risks{'\n'}
                    Using blockchain technology involves significant risks. You are responsible for your own keys.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundDark },
    content: { padding: 20 },
    text: { color: Colors.gray400, fontFamily: Typography.fontFamily.mono, lineHeight: 24 }
});
