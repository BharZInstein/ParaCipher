import TechBackground from '@/components/TechBackground';
import UnifiedHeader from '@/components/UnifiedHeader';
import { Colors, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const MOCK_ACTIVITY = [
    { id: '1', type: 'receive', title: 'Received ETH', date: 'Today, 10:23 AM', amount: '+0.45 ETH', status: 'Confirmed', statusColor: '#4ade80' },
    { id: '2', type: 'send', title: 'Sent to 0x4d...2a', date: 'Yesterday, 04:15 PM', amount: '-0.12 ETH', status: 'Confirmed', statusColor: '#4ade80' },
    { id: '3', type: 'swap', title: 'Swap ETH for USDC', date: 'Oct 24, 09:30 AM', amount: '-1.50 ETH', status: 'Confirmed', statusColor: '#4ade80' },
    { id: '4', type: 'contract', title: 'Contract Interaction', date: 'Oct 22, 11:00 AM', amount: '-0.005 ETH', status: 'Failed', statusColor: '#f87171' },
    { id: '5', type: 'receive', title: 'Received ETH', date: 'Oct 20, 08:45 AM', amount: '+2.00 ETH', status: 'Confirmed', statusColor: '#4ade80' },
    { id: '6', type: 'send', title: 'Sent to 0x8b...9f', date: 'Oct 18, 02:20 PM', amount: '-0.50 ETH', status: 'Confirmed', statusColor: '#4ade80' },
];

export default function ActivityScreen() {

    const getIcon = (type: string) => {
        switch (type) {
            case 'receive': return 'arrow-downward';
            case 'send': return 'arrow-upward';
            case 'swap': return 'swap-horiz';
            case 'contract': return 'code';
            default: return 'history';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.activityItem}>
            <View style={styles.iconBox}>
                <MaterialIcons name={getIcon(item.type) as any} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.date} • <Text style={{ color: item.statusColor }}>{item.status}</Text></Text>
            </View>
            <Text style={[styles.amount, { color: item.amount.startsWith('+') ? '#4ade80' : 'white' }]}>{item.amount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TechBackground />
            <UnifiedHeader title="ACTIVITY LOG" subtitle="TRANSACTION HISTORY" showBack />

            <FlatList
                data={MOCK_ACTIVITY}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
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
        padding: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceCard,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: {
        color: 'white',
        fontFamily: Typography.fontFamily.displayBold,
        fontSize: 14,
    },
    itemSub: {
        color: Colors.gray600,
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        marginTop: 4,
    },
    amount: {
        fontFamily: Typography.fontFamily.mono,
        fontSize: 14,
    }
});
