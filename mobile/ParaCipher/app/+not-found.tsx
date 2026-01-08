import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@/constants/Theme';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <Text style={styles.title}>404_ERR // PAGE_NOT_FOUND</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>RETURN TO SYSTEM_ROOT</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 20,
        fontFamily: Typography.fontFamily.mono,
        color: Colors.primary,
        marginBottom: 16,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: Colors.accentBlue,
        fontFamily: Typography.fontFamily.mono,
    },
});
