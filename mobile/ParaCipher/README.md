# ParaCipher 🛡️

**Parametric Insurance for the Gig Economy.**
ParaCipher is a blockchain-based insurance platform designed for gig workers (Uber, Zomato, Swiggy). It provides instant, automated payouts for accidents using smart contracts and on-device sensor simulation.

Powered by **Ethereum (Polygon)** for transparency and **React Native (Expo)** for a premium mobile experience.

---

## 🚀 Key Features

### 1. **Instant Coverage**
- Workers pay a small premium (e.g., ₹25) for 24-hour coverage.
- Policies are auto-issued via smart contracts.
- **Visuals:** "Coverage Inactive" vs "Protected" status on Home Screen.

### 2. **Accident Simulation & Detection**
- **Simulation Mode:** Interactive hold-to-simulate crash interface.
- **Sensor Integration:** Uses device accelerometer (simulated) to detect high-impact events.
- **Auto-Claim:** Automatically triggers a claim when a crash is detected.

### 3. **Smart Wallet**
- **Built-in Wallet:** View balances, premiums paid, and payouts received.
- **Dummy Connection:** Simulates connecting to a crypto wallet (e.g., MetaMask).
- **Yield:** "Earn while you protect" visualization.

### 4. **Safety Passport (Profile)**
- **Reputation Score:** 850-scale safety score based on driving history.
- **On-Chain Proof:** verifiable proof of insurance and safety record.
- **Dynamic Pricing:** Safer drivers get lower premiums.

---

## 🛠️ Technology Stack

- **Frontend:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **Styling:** Custom StyleSheet (Neon/Dark Cyberpunk aesthetic)
- **Navigation:** Expo Router (File-based routing)
- **Animations:** React Native Reanimated 2
- **State Management:** React Context (Currency, Wallet)
- **Storage:** Async Storage (Persist settings/wallet state)

---

## 🔧 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/paracipher.git
    cd paracipher
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the app**
    ```bash
    npx expo start
    ```
    - Scan the QR code with **Expo Go** on your Android/iOS device.
    - Or press `a` to run on Android Emulator.

---

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx       # Home: Coverage Status & Dashboard
│   ├── explore.tsx     # Map view (simulation)
│   ├── wallet.tsx      # Wallet: Balance & Connection
│   ├── history.tsx     # Claims History
│   ├── profile.tsx     # Safety Passport & Reputation
│   └── settings.tsx    # App Config
├── simulation/
│   └── accident.tsx    # Crash Simulation Screen
├── shift/
│   └── active.tsx      # Active Shift Timer
└── proof/
    └── index.tsx       # On-Chain Verification Proof
```

---

## 🔗 Smart Contract Integration

The app is designed to interface with the following Solidity contracts:
- **InsurancePolicy.sol:** Manages daily coverage.
- **ClaimPayout.sol:** Handles claims and payouts.
- **ReputationScore.sol:** Tracks driver safety scores.


---

## 🎨 Design System

- **Theme:** Dark Mode First (OLED Black #030303)
- **Accents:** Neon Green (`#00ff9d`), Emergency Red (`#FF3B30`), Cyan (`#00F0FF`)
- **Typography:** Inter (Body) & JetBrains Mono (Data/Tech)

