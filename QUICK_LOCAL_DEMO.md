# ⚡ Quick Local Demo Setup

## ✅ Contracts Deployed Locally!

**Local Contract Addresses:**
```
InsurancePolicy:  0x5FbDB2315678afecb367f032d93F642f64180aa3
ClaimPayout:      0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ReputationScore:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

**Your Computer IP:** `172.16.44.115` (use this for mobile app)

---

## 🚀 3-Step Setup

### Step 1: Start Hardhat Node
```bash
cd /home/bharzinstein76/Devz/paracipher
npx hardhat node --hostname 0.0.0.0
```
**Keep this terminal open!**

### Step 2: Update Mobile App Config

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
    RPC_URL: "http://172.16.44.115:8545",  // Your computer's IP
    EXPLORER_URL: "http://localhost:8545",
    SYMBOL: "ETH",

    PREMIUM_AMOUNT: "5",
    COVERAGE_AMOUNT: "15",
    PAYOUT_AMOUNT: "15",
    COVERAGE_DURATION: 6
};
```

### Step 3: Connect MetaMask

**Add Network in MetaMask:**
- Network Name: `Hardhat Local`
- RPC URL: `http://172.16.44.115:8545`
- Chain ID: `31337`
- Currency: `ETH`

**Import Test Account:**
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- You'll have 10,000 ETH! 🎉

---

## 🎯 Demo Flow

1. **Start Hardhat node** (Step 1)
2. **Update mobile app** (Step 2)
3. **Connect MetaMask** (Step 3)
4. **Open mobile app** → Connect wallet
5. **Click START SHIFT** → Pay 5 ETH
6. **Coverage active for 6 hours!** ✅
7. **File a claim** → Auto-approves → Get 15 ETH!

---

## ✅ What Works

- ✅ All contracts deployed locally
- ✅ 6 hours coverage
- ✅ Auto-approval
- ✅ Premium forwarding
- ✅ Full flow works!

**Perfect for demos!** 🎉

---

**Quick Commands:**
```bash
# Start node
npx hardhat node --hostname 0.0.0.0

# Test contracts
npx hardhat run scripts/test-contracts.js --network localhost

# Test full flow
npx hardhat run scripts/test-flow.js --network localhost
```

