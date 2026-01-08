import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/Theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NOTIFICATIONS = [
    { id: '1', title: 'Shift Bonus Received', message: 'You received a 500 INR bonus for high efficiency.', time: '2 mins ago', type: 'success' },
    { id: '2', title: 'System Maintenance', message: 'Scheduled maintenance at 03:00 AM UTC.', time: '1 hour ago', type: 'info' },
    { id: '3', title: 'New Zone Unlocked', message: 'Sector 7 is now available for patrol.', time: '5 hours ago', type: 'success' },
    { id: '4', title: 'Security Alert', message: 'Unusual login attempt detected from new device.', time: '1 day ago', type: 'warning' },
];

export default function NotificationsScreen() {
    const router = useRouter();

    const renderItem = ({ item, index }: { item: typeof NOTIFICATIONS[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => HapticFeedback.light()}
            >
                <View style={[styles.iconBox, {
                    backgroundColor: item.type === 'success' ? 'rgba(0, 255, 102, 0.1)' :
                        item.type === 'warning' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    borderColor: item.type === 'success' ? Colors.primary :
                        item.type === 'warning' ? 'orange' : Colors.accentBlue
                }]}>
                    <MaterialIcons
                        name={item.type === 'success' ? "check-circle" : item.type === 'warning' ? "warning" : "info"}
                        size={24}
                        color={item.type === 'success' ? Colors.primary : item.type === 'warning' ? 'orange' : Colors.accentBlue}
                    />
                </View>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="Notifications" showBack />

            <FlatList
                data={NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: Colors.surfaceCard,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
    },
    time: {
        color: Colors.gray500,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
    },
    message: {
        color: Colors.gray400,
        fontFamily: Typography.fontFamily.display,
        fontSize: 12,
        lineHeight: 18,
    },
});
