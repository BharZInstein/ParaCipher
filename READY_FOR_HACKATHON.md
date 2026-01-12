# 🚀 ParaCipher - READY FOR HACKATHON!

## ✅ **YOU'RE ALL SET! Here's What You Have:**

### 📍 **Live Contracts on Shardeum Testnet**

```
✅ InsurancePolicy:  0x3A84E06554876A557b16249619247eF765C35407
✅ ClaimPayout:      0xf678B23d7887d9c9dbc49C2170902d5c88075c2D
✅ ReputationScore:  0x199678E7AF0B7a9f62523563f9eF861e242e944A

✅ ClaimPayout Balance: 200 SHM (enough for 1 demo claim!)
✅ Your Wallet Balance: ~409 SHM
```

### 💰 **How It Works**

1. **User pays 5 SHM** → Gets 24-hour coverage
2. **If accident happens** → User files claim
3. **You approve claim** → User receives **150 SHM**
4. **User's reputation** → Gets tracked on-chain

---

## 📱 **For Your Mobile App**

### **Quick Integration (Copy-Paste Ready)**

```typescript
// Contract Addresses
const INSURANCE_POLICY = "0x3A84E06554876A557b16249619247eF765C35407";
const CLAIM_PAYOUT = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";

// Network Config
const SHARDEUM_NETWORK = {
  chainId: "0x1FB7", // 8119 in decimal
  rpcUrl: "https://api-mezame.shardeum.org",
  explorer: "https://explorer-mezame.shardeum.org"
};

// Amounts
const PREMIUM = "5";   // SHM user pays
const PAYOUT = "150";  // SHM user gets
```

### **User Actions (3 functions you need)**

```javascript
import { ethers } from 'ethers';

// 1. Buy Coverage
async function buyCoverage(signer) {
  const contract = new ethers.Contract(
    INSURANCE_POLICY,
    ["function buyDailyCoverage() external payable"],
    signer
  );
  
  const tx = await contract.buyDailyCoverage({
    value: ethers.parseEther("5")
  });
  await tx.wait();
  return tx.hash;
}

// 2. File Claim
async function fileClaim(signer, description) {
  const contract = new ethers.Contract(
    CLAIM_PAYOUT,
    ["function fileClaim(string memory notes) external"],
    signer
  );
  
  const tx = await contract.fileClaim(description);
  await tx.wait();
  return tx.hash;
}

// 3. Check Status
async function checkCoverage(signer) {
  const contract = new ethers.Contract(
    INSURANCE_POLICY,
    ["function checkMyCoverage() external view returns (bool, uint256, uint256)"],
    signer
  );
  
  const [isActive, amount, timeLeft] = await contract.checkMyCoverage();
  return { isActive, amount, timeLeft };
}
```

---

## 🎬 **Hackathon Demo Script**

### **What to Show:**

1. **Opening** (30 sec)
   - "ParaCipher provides instant accident insurance for gig workers"
   - "Built on Shardeum blockchain for low fees"

2. **User Flow** (2 min)
   - Open app → Connect MetaMask
   - "Buy Coverage" → Pay 5 SHM
   - Show "Coverage Active" screen
   - Simulate accident → File claim with description
   - Show claim pending
   
3. **Admin/Owner** (1 min)
   - Review claim
   - Approve claim
   - Show success: 150 SHM sent!

4. **Blockchain Proof** (30 sec)
   - Open Shardeum Explorer
   - Show live transactions
   - Show contract balances
   
5. **Closing**
   - "Decentralized, transparent, instant payouts"
   - "All on Shardeum EVM"

### **Key Talking Points:**
- ✅ Daily micro-insurance (pay per day, not per month)
- ✅ Instant blockchain payouts (no waiting weeks)
- ✅ On-chain reputation system
- ✅ Transparent - all transactions public
- ✅ Low fees on Shardeum

---

## 🔗 **Important Links**

### **Your Contracts:**
- InsurancePolicy: https://explorer-mezame.shardeum.org/address/0x3A84E06554876A557b16249619247eF765C35407
- ClaimPayout: https://explorer-mezame.shardeum.org/address/0xf678B23d7887d9c9dbc49C2170902d5c88075c2D

### **Documentation:**
- Full Integration: `HACKATHON_GUIDE.md` (in your project)
- Shardeum Docs: https://docs.shardeum.org

---

## ⚠️ **IMPORTANT FOR DEMO**

### **Current Status:**
- ✅ Contracts deployed and funded
- ✅ Ready for 1 claim demo (200 SHM in contract)
- ⚠️ Your wallet has ~409 SHM (gas is expensive right now!)

### **For Best Demo:**

**Option 1: Use a Different Test Account**
- Create a NEW MetaMask account for the "user"
- Send it 10-20 SHM from your main wallet
- Have your main wallet be the "owner" who approves claims
- This looks more realistic in demo!

**Option 2: Demo on Frontend Only**
- Build UI that SHOWS the flow
- Don't execute actual transactions during presentation
- Say "In production, this would execute..."
- Then show 1-2 real transactions on explorer

### **What NOT to Do:**
- ❌ Don't buy coverage multiple times (you'll run out of SHM)
- ❌ Don't try to file multiple claims (only 200 SHM in contract)
- ❌ Keep it simple - show 1 complete flow only

---

## 🆘 **Last Minute Commands**

```bash
# Check your balance
npx hardhat run scripts/check-balance.js --network shardeum

# Check contract status
npx hardhat run scripts/verify-deployment.js --network shardeum

# After hackathon - get your 200 SHM back
npx hardhat run scripts/emergency-withdraw.js --network shardeum
```

---

## 💡 **Pro Tips**

1. **Practice the demo 2-3 times** before presenting
2. **Have the Explorer open** in a tab ready to show
3. **Explain the problem first** (gig workers need insurance)
4. **Then show your solution** (blockchain makes it instant & cheap)
5. **Have backup**: Screenshots/video in case of network issues

---

## 🎯 **You're Ready!**

✅ Contracts deployed  
✅ Funded and tested  
✅ Integration code ready  
✅ Explorer links prepared  
✅ Demo script written  

**GOOD LUCK WITH YOUR HACKATHON! 🚀**

---

**Questions?** Check `HACKATHON_GUIDE.md` for detailed code examples.

**After Hackathon:** Run `emergency-withdraw.js` to get your 200 SHM back from the contract!
