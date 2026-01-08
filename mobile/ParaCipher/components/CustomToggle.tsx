import { Colors } from '@/constants/Theme';
import { HapticFeedback } from '@/utils/Haptics';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function CustomToggle({ value, onValueChange }: CustomToggleProps) {
    return (
        <TouchableOpacity onPress={() => {
            HapticFeedback.success();
            onValueChange(!value);
        }} activeOpacity={0.8}>
            <View style={[
                styles.toggleContainer,
                value ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                    : { backgroundColor: 'transparent', borderColor: '#333' }
            ]}>
                <View style={[
                    styles.toggleHandle,
                    value ? { transform: [{ translateX: 20 }], backgroundColor: 'black' }
                        : { transform: [{ translateX: 0 }], backgroundColor: '#555' }
                ]} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        width: 48,
        height: 28,
        borderRadius: 4, // Square tech look
        borderWidth: 1,
        justifyContent: 'center',
        padding: 2,
    },
    toggleHandle: {
        width: 20,
        height: 20,
        borderRadius: 2, // Square handle
    },
});
