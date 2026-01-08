import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic Feedback Utility
 * 
 * Provides a simplified interface for triggering haptic feedback
 * with fallbacks for unsupported platforms (web).
 */
export const HapticFeedback = {
    /**
     * Light impact, good for buttons and tab switches
     */
    light: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Medium impact, good for secondary actions
     */
    medium: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Heavy impact, good for primary actions or significant events
     */
    heavy: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Selection feedback, good for scrollers or lists
     */
    selection: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.selectionAsync();
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Success notification (double vibration usually)
     */
    success: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Warning notification
     */
    warning: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },

    /**
     * Error notification
     */
    error: async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch (error) {
                // Ignore haptic errors
            }
        }
    },
};
