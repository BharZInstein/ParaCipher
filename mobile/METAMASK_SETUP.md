# MetaMask SDK Integration Guide

## 📋 Overview

This guide explains how to set up and test MetaMask deep linking in the ParaCipher mobile app.

## 🚀 Installation Steps

### 1. Navigate to Mobile Folder

```bash
cd mobile/ParaCipher
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@metamask/sdk-react-native` - MetaMask SDK for React Native
- `ethers` - Ethereum library for balance fetching

### 3. Install iOS Pods (iOS only)

If you're testing on iOS:

```bash
cd ios
pod install
cd ..
```

### 4. Rebuild the App

Since we added native dependencies, you need to rebuild:

**For Development:**
```bash
# Stop any running Expo server first (Ctrl+C)
npx expo start --clear
```

**For Production Build:**
```bash
# Android
npx expo prebuild --platform android
npx expo run:android

# iOS
npx expo prebuild --platform ios
npx expo run:ios
```

## 🧪 Testing Deep Linking

### Prerequisites

1. **Install MetaMask Mobile App** on your device:
   - iOS: [App Store](https://apps.apple.com/app/metamask/id1438144202)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=io.metamask)

2. **Create/Import a Wallet** in MetaMask mobile app

3. **Ensure both apps are installed** on the same device

### Test Flow

1. **Start ParaCipher App**
   ```bash
   npx expo start
   ```
   - Scan QR code with Expo Go, or
   - Press `a` for Android emulator, or
   - Press `i` for iOS simulator

2. **Navigate to Wallet Tab**
   - Tap the "Wallet" tab in bottom navigation

3. **Tap "CONNECT WALLET" Button**
   - You should see console logs: `[WalletScreen] Connect button pressed`
   - Then: `[WalletContext] Connect wallet initiated`

4. **MetaMask Should Open Automatically**
   - App switches to MetaMask
   - MetaMask shows: "ParaCipher wants to connect. Approve?"
   - Check console for: `[WalletContext] Requesting connection from MetaMask...`

5. **Approve in MetaMask**
   - Tap "Approve" in MetaMask
   - App should automatically switch back to ParaCipher

6. **Verify Connection**
   - ParaCipher should show:
     - "Connected: 0x7B4F...A29C" (your address)
     - Balance in MATIC
   - Console should show: `[WalletContext] Wallet connected successfully`

## 🔍 Debugging

### Check Console Logs

The integration includes extensive logging. Watch for these logs:

```
[WalletContext] Connect wallet initiated
[WalletContext] Requesting connection from MetaMask...
[WalletContext] Connection response: [...]
[WalletContext] Wallet connected successfully: 0x7B4F...A29C
[WalletContext] Balance loaded: 0.00 MATIC
```

### Common Issues

#### 1. MetaMask Doesn't Open

**Symptoms:** Tapping "CONNECT WALLET" does nothing

**Solutions:**
- Ensure MetaMask app is installed
- Check console for errors
- Try restarting both apps
- Verify deep linking is configured in `app.json`

**Debug:**
```bash
# Check if deep linking works
adb shell am start -W -a android.intent.action.VIEW -d "paracipher://" com.paracipher.app
```

#### 2. App Doesn't Return After Approval

**Symptoms:** MetaMask opens, but app doesn't switch back

**Solutions:**
- Check if `app.json` has correct `scheme: "paracipher"`
- Verify deep linking permissions in AndroidManifest.xml (auto-generated)
- Try manually switching back to ParaCipher app

#### 3. "MetaMask Not Found" Error

**Symptoms:** Alert shows "MetaMask Not Found"

**Solutions:**
- Install MetaMask mobile app
- Ensure it's the official MetaMask app (not a browser extension)
- Try reinstalling MetaMask

#### 4. Connection Fails Silently

**Symptoms:** No error, but wallet doesn't connect

**Solutions:**
- Check console logs for detailed errors
- Verify MetaMask is unlocked
- Try disconnecting and reconnecting
- Clear app cache: `npx expo start --clear`

#### 5. Balance Shows 0.00

**Symptoms:** Connected but balance is 0

**Solutions:**
- This is normal if wallet has no MATIC
- Check if provider is initialized (check console logs)
- Verify network connection
- Balance is fetched from Polygon network (default)

### Enable Verbose Logging

To see more detailed logs, check the React Native debugger or Metro bundler console.

## 📱 Platform-Specific Notes

### Android

- Deep linking uses `intentFilters` in `app.json`
- Test on real device for best results
- Emulator may have issues with app switching

### iOS

- Deep linking uses `associatedDomains` in `app.json`
- Requires proper bundle identifier
- Test on real device (simulator has limitations)

## 🔧 Configuration Files Modified

1. **`package.json`** - Added MetaMask SDK and ethers
2. **`app.json`** - Added deep linking configuration
3. **`context/WalletContext.tsx`** - Complete rewrite with MetaMask SDK
4. **`app/_layout.tsx`** - Added MetaMaskProvider wrapper
5. **`app/(tabs)/wallet.tsx`** - Updated to show connected address

## 🎯 Expected User Flow

1. ✅ User opens ParaCipher app
2. ✅ Sees "CONNECT WALLET" button
3. ✅ Taps button
4. ✅ App AUTOMATICALLY opens MetaMask mobile app
5. ✅ MetaMask shows: "ParaCipher wants to connect. Approve?"
6. ✅ User taps "Approve" in MetaMask
7. ✅ App AUTOMATICALLY switches back to ParaCipher
8. ✅ ParaCipher shows: "Connected: 0x7B4F...A29C" and balance

## 🐛 Troubleshooting Commands

```bash
# Clear Metro cache
npx expo start --clear

# Rebuild native code
npx expo prebuild --clean

# Check if MetaMask is installed (Android)
adb shell pm list packages | grep metamask

# Test deep link manually (Android)
adb shell am start -W -a android.intent.action.VIEW -d "paracipher://test" com.paracipher.app
```

## 📞 Support

If issues persist:
1. Check MetaMask SDK documentation: https://docs.metamask.io/wallet/sdk/react-native/
2. Review console logs for specific error messages
3. Verify all dependencies are installed correctly
4. Try on a different device

---

**Note:** Deep linking works best on physical devices. Emulators/simulators may have limitations with app switching.

