# 🚀 Quick Start - MetaMask Integration

## Step 1: Install Dependencies

```bash
cd mobile/ParaCipher
npm install
```

## Step 2: Rebuild App (Required for Native Dependencies)

```bash
# Clear cache and restart
npx expo start --clear
```

**OR** for a full rebuild:

```bash
# Android
npx expo prebuild --platform android
npx expo run:android

# iOS
npx expo prebuild --platform ios
npx expo run:ios
```

## Step 3: Test on Device

1. **Install MetaMask Mobile** on your device
2. **Start ParaCipher app**
3. **Go to Wallet tab**
4. **Tap "CONNECT WALLET"**
5. **Approve in MetaMask**
6. **App returns automatically**

## ✅ Expected Result

- ParaCipher shows: `Connected: 0x7B4F...A29C`
- Balance displays in MATIC
- Console shows connection logs

## 🐛 Quick Fixes

```bash
# If MetaMask doesn't open
npx expo start --clear

# If connection fails
# Check console logs for errors
# Ensure MetaMask is installed and unlocked
```

---

**Full documentation:** See `METAMASK_SETUP.md`

