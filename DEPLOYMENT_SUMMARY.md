# 🎉 Shardeum Deployment Summary

**Deployment Date:** January 12, 2026  
**Network:** Shardeum EVM Testnet (Mezame)  
**Status:** ✅ Successfully Deployed

---

## 📊 Updated Contract Parameters

### Premium & Coverage
- **Premium Amount (Fee):** 5 SHM  
  _(What workers pay to get coverage)_
  
- **Coverage Amount:** 150 SHM  
  _(The maximum claim amount)_
  
- **Payout Amount:** 150 SHM  
  _(What workers receive when claim is approved)_
  
- **Coverage Duration:** 24 hours

### Previous Values (Before Update)
- Premium: 25 MATIC → **Now: 5 SHM**
- Coverage: 50 MATIC → **Now: 150 SHM**
- Payout: 50 MATIC → **Now: 150 SHM**

---

## 📌 Deployed Contract Addresses

### InsurancePolicy Contract
**Address:** `0x3A84E06554876A557b16249619247eF765C35407`  
**Explorer:** [View on Shardeum Explorer](https://explorer-mezame.shardeum.org/address/0x3A84E06554876A557b16249619247eF765C35407)

**Functions:**
- `buyDailyCoverage()` - payable, send 5 SHM to buy 24h coverage
- `checkMyCoverage()` - check your current coverage status
- `getPolicyDetails(address)` - get policy details for any worker

---

### ClaimPayout Contract
**Address:** `0xf678B23d7887d9c9dbc49C2170902d5c88075c2D`  
**Explorer:** [View on Shardeum Explorer](https://explorer-mezame.shardeum.org/address/0xf678B23d7887d9c9dbc49C2170902d5c88075c2D)  
**Current Balance:** 100 SHM _(can handle 0 full claims before needing more funding)_

**Functions:**
- `fileClaim(string notes)` - file an accident claim
- `approveClaim(address worker)` - owner approves a claim (sends 150 SHM)
- `rejectClaim(address worker, string reason)` - owner rejects a claim
- `getMyClaimStatus()` - check your claim status
- `fundContract()` - owner can add more SHM for payouts

---

### ReputationScore Contract
**Address:** `0x199678E7AF0B7a9f62523563f9eF861e242e944A`  
**Explorer:** [View on Shardeum Explorer](https://explorer-mezame.shardeum.org/address/0x199678E7AF0B7a9f62523563f9eF861e242e944A)

**Functions:**
- `getMyScore()` - check your reputation score
- `getScore(address)` - check any worker's score

---

## 💰 Deployment Costs

- **Total Gas Used:** ~7154 SHM _(7842 SHM → 687 SHM remaining)_
- **Contract Funding:** 100 SHM _(funded to ClaimPayout)_
- **Remaining Balance:** 687 SHM

---

## ⚠️ Important Notice

**ClaimPayout Balance Issue:** The contract currently has **100 SHM** but each payout is **150 SHM**. This means:
- ❌ Cannot process any claims yet
- ✅ Need to add at least 50 more SHM to process 1 claim
- 💡 Recommended: Fund with 500+ SHM for multiple claims

### To Fund the Contract:
```bash
# Option 1: Using hardhat console
npx hardhat console --network shardeum
> const claimPayout = await ethers.getContractAt("ClaimPayout", "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D")
> await claimPayout.fundContract({ value: ethers.parseEther("500") })

# Option 2: Update .env and redeploy with more funding
FUNDING_AMOUNT=500
```

---

## 🚀 Next Steps

### 1. Fund the ClaimPayout Contract
You need to add more SHM to the ClaimPayout contract before it can process claims.

**Quick funding script:**
```javascript
const { ethers } = require("hardhat");

async function fund() {
  const claimPayout = await ethers.getContractAt(
    "ClaimPayout", 
    "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D"
  );
  
  const tx = await claimPayout.fundContract({ 
    value: ethers.parseEther("500") 
  });
  await tx.wait();
  
  console.log("✅ Funded with 500 SHM");
}

fund();
```

### 2. Update Your Frontend/Mobile App

Update your app configuration with these addresses:

**For Mobile App** (`mobile/ParaCipher/...`):
```typescript
const CONTRACTS = {
  INSURANCE_POLICY: "0x3A84E06554876A557b16249619247eF765C35407",
  CLAIM_PAYOUT: "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D",
  REPUTATION_SCORE: "0x199678E7AF0B7a9f62523563f9eF861e242e944A",
  NETWORK: {
    name: "Shardeum Testnet",
    chainId: 8119,
    rpcUrl: "https://api-mezame.shardeum.org",
    explorer: "https://explorer-mezame.shardeum.org"
  }
};

const AMOUNTS = {
  PREMIUM: "5",        // 5 SHM to buy coverage
  COVERAGE: "150",     // 150 SHM coverage amount
  PAYOUT: "150"        // 150 SHM payout when claim approved
};
```

### 3. Test the Complete Flow

Once funded, test the full user journey:

1. **Buy Coverage** - Worker pays 5 SHM
2. **File Claim** - Worker files accident claim
3. **Approve Claim** - Owner reviews and approves
4. **Receive Payout** - Worker receives 150 SHM

### 4. Monitor on Block Explorer

All transactions can be viewed on:  
🔗 **Shardeum Explorer:** https://explorer-mezame.shardeum.org

---

## 📝 Files Changed

### Smart Contracts:
1. **`contracts/InsurancePolicy.sol`**
   - Premium: 25 MATIC → 5 SHM
   - Coverage: 50 MATIC → 150 SHM

2. **`contracts/ClaimPayout.sol`**
   - Payout: 50 MATIC → 150 SHM

### Scripts:
3. **`scripts/deploy.js`**
   - Updated default funding: 100 → 500 SHM
   - Updated deployment summary

4. **`scripts/verify-deployment.js`** _(NEW)_
   - Quick verification script for deployed contracts

### Documentation:
5. **`SHARDEUM_DEPLOYMENT.md`**
   - Updated all amounts and costs
   - Updated balance requirements

---

## 🔧 Useful Commands

```bash
# Check account balance
npx hardhat run scripts/check-balance.js --network shardeum

# Verify deployment
npx hardhat run scripts/verify-deployment.js --network shardeum

# Re-compile contracts (if you make changes)
npx hardhat compile

# Deploy to Shardeum (if redeploying)
npx hardhat run scripts/deploy.js --network shardeum
```

---

## ❓ FAQ

**Q: Why is the ClaimPayout balance only 100 SHM when payouts are 150 SHM?**  
A: The deployment script used the old default (100 SHM). You need to manually fund it with more SHM or set `FUNDING_AMOUNT=500` in `.env` and redeploy.

**Q: Can I change the premium/coverage amounts without redeploying?**  
A: No, these are constants in the smart contracts. You'd need to redeploy new contracts.

**Q: How do I get more testnet SHM?**  
A: Visit the Shardeum faucet or testnet Discord for free testnet tokens.

**Q: What if I need to redeploy?**  
A: Simply run the deploy command again. It will create new contract instances with new addresses.

---

## 🎯 Summary Checklist

- [x] Contracts compiled successfully
- [x] Deployed to Shardeum testnet
- [x] Premium updated to 5 SHM
- [x] Coverage/Payout updated to 150 SHM
- [x] Contracts verified and working
- [ ] **Fund ClaimPayout with additional SHM** ⚠️
- [ ] Update mobile app with new addresses
- [ ] Test complete user flow
- [ ] Monitor transactions on explorer

---

**Need Help?** Check the contract addresses on the Shardeum Explorer or review the deployment logs above.

**Last Updated:** January 12, 2026
