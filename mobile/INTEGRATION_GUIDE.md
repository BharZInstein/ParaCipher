# 🚀 ParaCipher Mobile - READY TO INTEGRATE!

## ✅ What I Just Added

I created 2 new files in your mobile app:

1. **`constants/Blockchain.ts`** - Contract addresses & config
2. **`services/BlockchainService.ts`** - Functions to interact with contracts

---

## 🎯 What YOU Need to Do (3 Steps)

### **STEP 1: Update WalletContext** (Add Shardeum Support)

Open: `mobile/ParaCipher/context/WalletContext.tsx`

Add this import at the top:
```typescript
import { NetworkService } from '@/services/BlockchainService';
```

In the `connectWallet` function (around line 137), AFTER the connection succeeds, add:
```typescript
// After this line: const accounts = await sdk.connect();

// Switch to Shardeum network
if (provider) {
  await NetworkService.switchToShardeum(provider);
}
```

---

### **STEP 2: Update Home Screen** (Make START SHIFT actually buy coverage)

Open: `mobile/ParaCipher/app/(tabs)/index.tsx`

**Add imports at top:**
```typescript
import { InsurancePolicyService } from '@/services/BlockchainService';
import { useWallet } from '@/context/WalletContext';
import { useSDK } from '@metamask/sdk-react-native';
import { Alert } from 'react-native';
```

**Add state:**
```typescript
const { isConnected } = useWallet();
const { provider } = useSDK();
const [isLoading, setIsLoading] = useState(false);
const [coverageStatus, setCoverageStatus] = useState({ isActive: false });
```

**Replace the `handleStartShift` function** (line 15-17):
```typescript
const handleStartShift = async () => {
  if (!isConnected || !provider) {
    Alert.alert("Not Connected", "Please connect your wallet first!");
    return;
  }
  
  setIsLoading(true);
  
  try {
    const signer = await provider.getSigner();
    const result = await InsurancePolicyService.buyCoverage(signer);
    
    if (result.success) {
      Alert.alert(
        "Coverage Activated! ✅",
        `You're covered for 24 hours!\n\nTransaction: ${result.txHash?.slice(0, 10)}...`,
        [{ text: "OK", onPress: () => router.push('/shift/active') }]
      );
    } else {
      Alert.alert("Failed", result.error || "Could not buy coverage");
    }
  } catch (error: any) {
    Alert.alert("Error", error.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Update the button text** (line 114):
```typescript
<Text style={styles.startBtnPrice}>5 SHM</Text>  {/* Changed from ₹25 */}
```

---

### **STEP 3: Create File Claim Screen**

Create new file: `mobile/ParaCipher/app/claim.tsx`

```typescript
import { Colors, Typography } from '@/constants/Theme';
import { ClaimPayoutService } from '@/services/BlockchainService';
import { MaterialIcons } from '@expo/vector-icons';
import { useSDK } from '@metamask/sdk-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function FileClaimScreen() {
  const router = useRouter();
  const { provider } = useSDK();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please describe the accident");
      return;
    }

    if (!provider) {
      Alert.alert("Error", "Wallet not connected");
      return;
    }

    setIsLoading(true);

    try {
      const signer = await provider.getSigner();
      const result = await ClaimPayoutService.fileClaim(signer, description);

      if (result.success) {
        Alert.alert(
          "Claim Filed! 📋",
          "Your claim has been submitted for review. You'll receive 150 SHM once approved.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Failed", result.error || "Could not file claim");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FILE CLAIM</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Describe what happened. Claims are reviewed and approved within 24 hours.
          </Text>
        </View>

        <Text style={styles.label}>ACCIDENT DESCRIPTION</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe the accident..."
          placeholderTextColor={Colors.gray600}
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>SUBMIT CLAIM</Text>
              <Text style={styles.submitBtnAmount}>150 SHM</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 16,
    color: 'white',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(39, 228, 114, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(39, 228, 114, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    color: Colors.gray400,
    lineHeight: 18,
  },
  label: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    color: Colors.gray400,
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 12,
    padding: 16,
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    color: 'white',
    height: 150,
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: 16,
    color: 'black',
    letterSpacing: 1,
  },
  submitBtnAmount: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
  },
});
```

---

## 🎯 That's It! Now Test:

1. **Connect Wallet** - Should switch to Shardeum
2. **Click START SHIFT** - Pays 5 SHM, gets 24hr coverage
3. **Go to /claim screen** - File a claim
4. **You (owner) approve** - User gets 150 SHM

---

## 🔗 Quick Links

- **Contracts:** Check [READY_FOR_HACKATHON.md](../../READY_FOR_HACKATHON.md) in root
- **Explorer:** https://explorer-mezame.shardeum.org

---

## ❓ Questions?

Everything is already deployed and funded on Shardeum. Just integrate these 3 steps and you're done!

**GOOD LUCK! 🚀**
