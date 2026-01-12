import { Colors, Typography } from '@/constants/theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UnifiedHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightIcon?: keyof typeof MaterialIcons.glyphMap;
    onRightPress?: () => void;
    showNotification?: boolean;
}

export default function UnifiedHeader({
    title,
    subtitle,
    showBack = false,
    onBack,
    rightIcon,
    onRightPress,
    showNotification = false,
}: UnifiedHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        HapticFeedback.light();
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleRightPress = () => {
        HapticFeedback.light();
        if (onRightPress) {
            onRightPress();
        } else if (rightIcon === 'notifications-none') {
            router.push('/notifications');
        }
    };

    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            {/* Left Section */}
            <View style={styles.leftSection}>
                {showBack ? (
                    <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
                        <MaterialIcons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconBtn} />
                )}
            </View>

            {/* Center Title */}
            <View style={styles.centerSection}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {/* Right Section */}
            <View style={styles.rightSection}>
                {rightIcon ? (
                    <TouchableOpacity style={styles.iconBtn} onPress={handleRightPress}>
                        <MaterialIcons name={rightIcon} size={20} color="rgba(255,255,255,0.8)" />
                        {showNotification && <View style={styles.notificationDot} />}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconBtn} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'rgba(3, 3, 3, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    leftSection: {
        width: 44,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        width: 44,
        alignItems: 'flex-end',
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    title: {
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
        color: 'white',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 10,
        color: Colors.primary,
        letterSpacing: 1,
        marginTop: 2,
        opacity: 0.8,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
});
