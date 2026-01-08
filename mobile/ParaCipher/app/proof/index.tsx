import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProofScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <TechBackground />

            <UnifiedHeader title="ON-CHAIN PROOF" subtitle="IMMUTABLE RECORD" />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Status Badge */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.statusBadge}>
                    <MaterialIcons name="verified" size={32} color={Colors.primary} />
                    <Text style={styles.statusText}>VERIFIED VALID</Text>
                </Animated.View>

                {/* Transaction Card */}
                <Animated.View entering={FadeInDown.delay(400)} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>TRANSACTION HASH</Text>
                        <MaterialIcons name="open-in-new" size={16} color={Colors.gray400} />
                    </View>
                    <Text style={styles.hashText}>
                        0x7f9a...3b21
                    </Text>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>BLOCK</Text>
                            <Text style={styles.value}>18,234,910</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>TIMESTAMP</Text>
                            <Text style={styles.value}>2024-03-15 14:23:01</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Data JSON Preview */}
                <Animated.View entering={FadeInDown.delay(600)} style={styles.codeCard}>
                    <Text style={styles.codeTitle}>// SMART_CONTRACT_DATA</Text>
                    <Text style={styles.codeText}>
                        {`{
  "proofId": "PC-9923-X",
  "validator": "ParaCipher_Node_V3",
  "integrity": "100%",
  "signals": [
    { "type": "GPS", "status": "MATCH" },
    { "type": "ACCEL", "val": "4.2g" }
  ]
}`}
                    </Text>
                </Animated.View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => router.back()}
                >
                    <Text style={styles.btnText}>RETURN TO PROFILE</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
    },
    statusBadge: {
        alignItems: 'center',
        marginBottom: 32,
        padding: 24,
        backgroundColor: 'rgba(0, 255, 157, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 157, 0.2)',
    },
    statusText: {
        marginTop: 12,
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 16,
        color: Colors.primary,
        letterSpacing: 2,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.gray400,
    },
    hashText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 18,
        color: 'white',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.surfaceBorder,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.gray400,
        marginBottom: 4,
    },
    value: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
        color: 'white',
    },
    codeCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        marginBottom: 32,
    },
    codeTitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.primary,
        marginBottom: 12,
        opacity: 0.8,
    },
    codeText: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 12,
        color: Colors.gray400,
        lineHeight: 20,
    },
    btn: {
        height: 56,
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    btnText: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: 'white',
        letterSpacing: 1,
    },
});
