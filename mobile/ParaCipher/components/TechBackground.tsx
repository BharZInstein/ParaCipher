import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function TechBackground() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Dark Background Base */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#030303' }]} />

            {/* Grid Pattern */}
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <Pattern
                        id="grid-pattern"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Horizontal line */}
                        <Line
                            x1="0"
                            y1="40"
                            x2="40"
                            y2="40"
                            stroke="rgba(0, 255, 102, 0.1)"
                            strokeWidth="1"
                        />
                        {/* Vertical line */}
                        <Line
                            x1="40"
                            y1="0"
                            x2="40"
                            y2="40"
                            stroke="rgba(0, 255, 102, 0.1)"
                            strokeWidth="1"
                        />
                    </Pattern>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#grid-pattern)"
                />
            </Svg>

            {/* Gradient Mask - fades grid toward bottom */}
            <LinearGradient
                colors={['transparent', 'transparent', 'rgba(3, 3, 3, 0.6)', 'rgba(3, 3, 3, 1)']}
                locations={[0, 0.4, 0.7, 1]}
                style={[StyleSheet.absoluteFill]}
                pointerEvents="none"
            />
        </View>
    );
}
