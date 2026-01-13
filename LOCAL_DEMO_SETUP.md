# 🚀 Local Demo Setup - Show It Working!

## ✅ Contracts Deployed Locally!

**Local Contract Addresses:**
- InsurancePolicy: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- ClaimPayout: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- ReputationScore: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

**Configuration:**
- Premium: 5 ETH
- Coverage: 15 ETH
- Payout: 15 ETH
- Duration: **6 hours** ✅
- ClaimPayout Balance: 100 ETH (ready for claims!)

---

## 🎯 Quick Setup for Demo

### Step 1: Keep Hardhat Node Running

The Hardhat node should be running in the background. If not:
```bash
cd /home/bharzinstein76/Devz/paracipher
npx hardhat node --hostname 0.0.0.0
```

**Keep this terminal open!**

### Step 2: Update Mobile App Config

**Option A: Quick Switch (Temporary)**
Edit `mobile/ParaCipher/constants/Blockchain.ts`:
- Change RPC_URL to: `"http://YOUR_COMPUTER_IP:8545"`
- Change contract addresses to local ones (see below)
- Change CHAIN_ID to: `31337`

**Option B: Use Localhost Config**
Rename or update:
```bash
# In mobile/ParaCipher/constants/
# Use Blockchain.localhost.ts temporarily
```

### Step 3: Connect MetaMask to Local Network

**In MetaMask:**
1. Settings → Networks → Add Network
2. Network Name: `Hardhat Local`
3. RPC URL: `http://YOUR_COMPUTER_IP:8545` (or `http://localhost:8545` if on same device)
4. Chain ID: `31337`
5. Currency Symbol: `ETH`

**Get Your Computer's IP:**
```bash
# Linux/Mac
hostname -I
# or
ip addr show | grep "inet "
```

### Step 4: Import Test Account to MetaMask

Hardhat provides test accounts with 10,000 ETH. Import one:

**Private Key (from Hardhat):**
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**In MetaMask:**
1. Import Account
2. Paste private key
3. You'll have 10,000 ETH! 🎉

---

## 📱 Mobile App Setup

### Update Constants

Edit `mobile/ParaCipher/constants/Blockchain.ts`:

```typescript
export const BLOCKCHAIN_CONFIG = {
    // LOCAL CONTRACTS
    INSURANCE_POLICY_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    CLAIM_PAYOUT_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    REPUTATION_SCORE_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",

    // LOCAL NETWORK
    CHAIN_ID: 31337,
    CHAIN_ID_HEX: "0x7A69",
    CHAIN_NAME: "Hardhat Local",
    RPC_URL: "http://YOUR_IP:8545",  // Replace with your computer's IP
    EXPLORER_URL: "http://localhost:8545",
    SYMBOL: "ETH",

    // Amounts
    PREMIUM_AMOUNT: "5",
    COVERAGE_AMOUNT: "15",
    PAYOUT_AMOUNT: "15",
    COVERAGE_DURATION: 6
};
```

---

## 🧪 Test the Flow

### 1. Test Contracts Locally

```bash
npx hardhat run scripts/test-contracts.js --network localhost
```

### 2. Test Full Flow

```bash
npx hardhat run scripts/test-flow.js --network localhost
```

### 3. Test in Mobile App

1. Start Hardhat node (if not running)
2. Connect MetaMask to local network
3. Import test account (10,000 ETH)
4. Open mobile app
5. Connect wallet
6. Click "START SHIFT"
7. Pay 5 ETH → Coverage active for 6 hours!
8. File a claim
9. Claim auto-approves (if new ClaimPayout) or needs approval (old)

---

## 💡 Demo Tips

### Show Coverage Purchase:
- "Watch me buy 6-hour coverage for 5 ETH"
- Transaction happens instantly on local network!

### Show Claim Filing:
- "I'll file a claim now"
- "See how it auto-approves and pays 15 ETH instantly!"

### Show Timer:
- "Coverage is active for 6 hours"
- Timer counts down in real-time

---

## 🔧 Troubleshooting

### "Cannot connect to network"
- Make sure Hardhat node is running
- Check RPC URL is correct (use your computer's IP)
- Make sure phone/device is on same network

### "Insufficient funds"
- Import test account with private key above
- You'll have 10,000 ETH

### "Transaction failed"
- Check Hardhat node is running
- Check network is connected in MetaMask
- Try again - local network is fast!

---

## ✅ What Works Locally

- ✅ All contracts deployed
- ✅ 6 hours coverage
- ✅ Auto-approval (new ClaimPayout)
- ✅ Premium forwarding to pool
- ✅ Full flow works perfectly!

**Perfect for demos!** 🎉

---

**Quick Start:**
1. Keep `npx hardhat node` running
2. Update mobile app RPC URL to your IP
3. Connect MetaMask to local network
4. Import test account
5. Test in app!

