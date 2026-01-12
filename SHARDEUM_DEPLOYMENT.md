# 🚀 Shardeum EVM Testnet Deployment Guide

## 📋 Prerequisites

1. **Private Key**: Your wallet's private key (keep it secret!)
2. **Testnet SHM**: At least 150 SHM for deployment + gas fees
3. **Node.js & npm**: Already installed ✅

## 🔧 Step 1: Setup Environment Variables

Create a `.env` file in the root directory (`/home/bharzinstein76/Devz/paracipher/`):

```bash
# Shardeum EVM Testnet Configuration
SHARDEUM_RPC_URL=https://api-mezame.shardeum.org
SHARDEUM_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Optional: Funding amount (default is 500 SHM)
FUNDING_AMOUNT=500
```

**⚠️ IMPORTANT:**
- Never commit `.env` to git!
- Replace `0xYOUR_PRIVATE_KEY_HERE` with your actual private key
- Make sure you have at least 150 SHM in your wallet

## 📦 Step 2: Install Dependencies (if not done)

```bash
cd /home/bharzinstein76/Devz/paracipher
npm install
```

## 🔨 Step 3: Compile Contracts

```bash
npx hardhat compile
```

You should see:
```
Compiled 3 Solidity files successfully
```

## 🚀 Step 4: Deploy to Shardeum

### Option A: Using npm script (Recommended)
```bash
npm run deploy:shardeum
```

### Option B: Using hardhat directly
```bash
npx hardhat run scripts/deploy.js --network shardeum
```

## 📊 What Happens During Deployment

The script will:

1. ✅ **Deploy InsurancePolicy** contract
2. ✅ **Deploy ClaimPayout** contract (linked to InsurancePolicy)
3. ✅ **Deploy ReputationScore** contract
4. ✅ **Connect contracts** (link ReputationScore to ClaimPayout)
5. ✅ **Fund ClaimPayout** with 500 SHM (or amount from FUNDING_AMOUNT env var)

## 💰 Gas Cost Estimate

- **Deployment**: ~5-10 SHM per contract (3 contracts = ~15-30 SHM)
- **Linking**: ~1-2 SHM
- **Funding**: 500 SHM (configurable)
- **Total**: ~515-530 SHM

With 7800+ SHM, you have plenty! ✅

## 📝 Step 5: Save Contract Addresses

After deployment, you'll see output like:

```
🎉 DEPLOYMENT COMPLETE!
============================================================

📌 Contract Addresses:

   InsurancePolicy:  0x1234...5678
   ClaimPayout:      0xabcd...efgh
   ReputationScore:  0x9876...5432
```

**Save these addresses!** They're also saved to `deployment-addresses.json`

## 🔍 Step 6: Verify on Block Explorer

Visit: https://explorer-mezame.shardeum.org

Search for your contract addresses to see:
- ✅ Deployment transactions
- ✅ Contract code
- ✅ Contract interactions

## 🧪 Step 7: Test the Contracts

```bash
npx hardhat run scripts/test-flow.js --network shardeum
```

This will test:
- Buying coverage
- Filing a claim
- Approving claim
- Reputation system

## 📱 Step 8: Update Mobile App

Update your mobile app with the deployed contract addresses:

1. Open `mobile/ParaCipher/context/WalletContext.tsx` (or wherever you store contract addresses)
2. Update the contract addresses:
   ```typescript
   const INSURANCE_POLICY_ADDRESS = "0x..."; // From deployment
   const CLAIM_PAYOUT_ADDRESS = "0x...";
   const REPUTATION_SCORE_ADDRESS = "0x...";
   ```

## 🐛 Troubleshooting

### "Insufficient funds"
- Check your wallet has enough SHM
- Reduce FUNDING_AMOUNT in `.env` if needed

### "Invalid private key"
- Make sure your private key starts with `0x`
- Check for extra spaces or quotes

### "Network error"
- Verify RPC URL is correct: `https://api-mezame.shardeum.org`
- Check your internet connection

### "Contract deployment failed"
- Check gas limit (should auto-adjust)
- Verify contracts compile successfully
- Check block explorer for transaction status

## 📋 Quick Command Reference

```bash
# Compile
npx hardhat compile

# Deploy
npm run deploy:shardeum

# Test
npx hardhat run scripts/test-flow.js --network shardeum

# Check balance
npx hardhat run scripts/check-balance.js --network shardeum
```

## ✅ Deployment Checklist

- [ ] Created `.env` file with private key
- [ ] Have at least 600 SHM in wallet for deployment
- [ ] Contracts compiled successfully
- [ ] Deployed all 3 contracts
- [ ] Saved contract addresses
- [ ] Verified on block explorer
- [ ] Tested contracts with test-flow script
- [ ] Updated mobile app with addresses

---

**Need help?** Check the console output for detailed error messages!

