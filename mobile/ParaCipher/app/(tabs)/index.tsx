import TechBackground from '@/components/TechBackground';
import { Colors, Typography } from '@/constants/theme';
import { HapticFeedback } from '@/utils/Haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { InsurancePolicyService } from '@/services/BlockchainService';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';


export default function HomeScreen() {
  const router = useRouter();
  const { isConnected, provider } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartShift = async () => {
    console.log('[HomeScreen] handleStartShift called');

    if (!isConnected || !provider) {
      Alert.alert("Not Connected", "Please connect your wallet from the Wallet tab first!");
      return;
    }

    HapticFeedback.medium();

    // Navigate to active shift - transaction will happen there
    router.push('/shift/active');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TechBackground />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(800)} style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoA-QNNnSkBfTAYv0iXHillvcnTqJDpycsX2Ykm0qN3feKo4eYSiBvxuM-5ssJXjdu3qsXchofkNBDYc7Eb8BlH14V6ZBuOC1wuiY0Kzl-QOkfJfuhTYFnJYeUXLQaNZE3tPssW7pzcclhMdL9E7dQ4aNaWCiwkRHWkCxl4RJdf4vgY6WFdC3NZUnGrTMvO6M6kj2H9c5mYD2Y6psGQyTksMj_qjbtUiFIBuQclY4IEd22EDYGfZgcD6uy-sz5oukDpFGEdLwM8Q" }}
                  style={styles.avatarImage}
                />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>WELCOME BACK</Text>
                <Text style={styles.usernameText}>MITHIL</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => {
                HapticFeedback.light();
                router.push('/notifications');
              }}
            >
              <MaterialIcons name="notifications-none" size={24} color={Colors.gray400} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Status Card */}
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              {/* Background Effects would go here - simplified for RN */}
              <View style={styles.statusCardOverlay} />

              <View style={styles.cardHeader}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusBadgeText}>COVERAGE INACTIVE</Text>
                </View>
                <MaterialIcons name="shield" size={20} color="rgba(255,255,255,0.3)" />
              </View>

              <View style={styles.cardCenter}>
                {/* Ring Animation Simulation */}
                <View style={styles.ringOuter}>
                  <View style={styles.ringInner} />
                  <MaterialIcons name="lock-open" size={32} color={Colors.gray600} />
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.statusTitle}>Not Protected</Text>
                <Text style={styles.statusSubtitle}>
                                    // PARAMETRIC INSURANCE PAUSED{'\n'}
                  Activate shift protection to secure income.
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statItem, styles.statBorderRight]}>
              <Text style={styles.statLabel}>COVERED</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
            <View style={[styles.statItem, styles.statBorderRight]}>
              <Text style={styles.statLabel}>BALANCE</Text>
              <Text style={styles.statValue}>₹450</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>STREAK</Text>
              <View style={styles.streakContainer}>
                <Text style={styles.statValue}>5</Text>
                <MaterialIcons name="local-fire-department" size={16} color="#F97316" />
              </View>
            </View>
          </View>

          {/* Start Shift Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.startBtn, isLoading && styles.startBtnDisabled]}
              onPress={handleStartShift}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <View style={styles.boltIconContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <MaterialIcons name="bolt" size={28} color={Colors.primary} />
                )}
              </View>
              <View style={styles.startBtnContent}>
                <View>
                  <Text style={styles.startBtnTitle}>{isLoading ? 'PROCESSING...' : 'START SHIFT'}</Text>
                  <Text style={styles.startBtnSubtitle}>6 HOUR COVERAGE</Text>
                </View>
                <Text style={styles.startBtnPrice}>5 SHM</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <MaterialIcons name="arrow-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {/* Item 1 */}
              <TouchableOpacity style={styles.activityItem} onPress={() => router.push({ pathname: '/transaction/[id]', params: { id: '123' } })}>
                <View style={styles.activityLeft}>
                  <View style={styles.activityIconBox}>
                    <MaterialIcons name="security" size={18} color={Colors.gray400} />
                  </View>
                  <View>
                    <Text style={styles.itemTitle}>Shift Protection</Text>
                    <Text style={styles.itemDate}>YESTERDAY</Text>
                  </View>
                </View>
                <Text style={styles.itemAmountNeg}>- ₹25</Text>
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity style={[styles.activityItem, { borderBottomWidth: 0 }]} onPress={() => router.push({ pathname: '/transaction/[id]', params: { id: '456' } })}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityIconBox, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                    <MaterialIcons name="account-balance-wallet" size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.itemTitle}>Wallet Top-up</Text>
                    <Text style={styles.itemDate}>OCT 24</Text>
                  </View>
                </View>
                <Text style={styles.itemAmountPos}>+ ₹500</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    // Note: React Native needs an image for repeating grid patterns effectively or SVG.
    // Simplifying with just background color for now as per RN limitations without assets.
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    backgroundColor: 'rgba(3, 3, 3, 0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: Colors.gray500,
    letterSpacing: 1,
  },
  usernameText: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 14,
    color: 'white',
    letterSpacing: 0.5,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  statusSection: {
    padding: 24,
    paddingBottom: 8,
  },
  statusCard: {
    height: 320,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 24,
  },
  statusCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    // Ideally we would add the image here if we had it locally
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  statusBadgeText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: '#F87171', // Red-400
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    pointerEvents: 'none',
  },
  ringOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cardFooter: {
    gap: 8,
  },
  statusTitle: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 30,
    color: 'white',
    letterSpacing: -0.5,
  },
  statusSubtitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    color: Colors.gray500,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 15, 15, 0.3)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12, // Slight deviation but cleaner on mobile
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statBorderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceBorder,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: Colors.gray500,
    letterSpacing: 1,
  },
  statValue: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 20,
    color: 'white',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  startBtn: {
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6, // matching the web design's internal padding logic
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  startBtnDisabled: {
    opacity: 0.5,
  },
  boltIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtnContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  startBtnTitle: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 18,
    color: 'black',
    letterSpacing: -0.5,
  },
  startBtnSubtitle: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 10,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1,
  },
  startBtnPrice: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
  },
  activitySection: {
    paddingHorizontal: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0, // List has border top
  },
  activityTitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    color: Colors.gray400,
    letterSpacing: 1,
    fontWeight: '700',
  },
  activityList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: Colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: Typography.fontFamily.displayMedium,
    fontSize: 14,
    color: '#E5E7EB', // Gray-200
  },
  itemDate: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: Colors.gray600,
    marginTop: 2,
  },
  itemAmountNeg: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    fontWeight: '700',
    color: '#D1D5DB', // Gray-300
  },
  itemAmountPos: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  walletCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 148, 0.2)',
    overflow: 'hidden',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 148, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 2,
    flex: 1,
  },
  walletAmount: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 32,
    color: 'white',
    letterSpacing: -1,
    marginBottom: 12,
  },
  walletFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendBadge: {
    backgroundColor: '#00ff9d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: 'black',
  },
  walletSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    height: 80,
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  actionGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: 'white',
    marginTop: 8,
    letterSpacing: 1,
  },
});
