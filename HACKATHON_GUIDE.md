# 🚀 ParaCipher Mobile App Integration Guide (Hackathon Edition)

## 📍 Contract Addresses (Shardeum Testnet)

```typescript
const CONTRACTS = {
  insurancePolicy: "0x3A84E06554876A557b16249619247eF765C35407",
  claimPayout: "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D",
  reputationScore: "0x199678E7AF0B7a9f62523563f9eF861e242e944A"
};

const NETWORK = {
  chainId: "0x1FB7", // 8119 in hex
  chainName: "Shardeum Testnet",
  rpcUrl: "https://api-mezame.shardeum.org",
  blockExplorer: "https://explorer-mezame.shardeum.org",
  nativeCurrency: {
    name: "Shardeum",
    symbol: "SHM",
    decimals: 18
  }
};

const AMOUNTS = {
  premium: "5",      // User pays 5 SHM
  payout: "150"      // User gets 150 SHM if claim approved
};
```

---

## 🔧 Step-by-Step Integration

### 1️⃣ **Add Shardeum Network to MetaMask**

```javascript
async function addShardeumNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x1FB7',
        chainName: 'Shardeum Testnet',
        nativeCurrency: { name: 'Shardeum', symbol: 'SHM', decimals: 18 },
        rpcUrls: ['https://api-mezame.shardeum.org'],
        blockExplorerUrls: ['https://explorer-mezame.shardeum.org']
      }]
    });
    console.log("✅ Shardeum network added!");
  } catch (error) {
    console.error("Failed to add network:", error);
  }
}
```

---

### 2️⃣ **Connect Wallet**

```javascript
import { ethers } from 'ethers';

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }
  
  // Request account access
  const accounts = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  });
  
  // Create provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  console.log("Connected:", address);
  return { provider, signer, address };
}
```

---

### 3️⃣ **Contract ABIs (Copy These)**

Create a file `contracts/abis.ts`:

```typescript
export const INSURANCE_POLICY_ABI = [
  "function buyDailyCoverage() external payable",
  "function checkMyCoverage() external view returns (bool isActive, uint256 coverageAmount, uint256 timeRemaining)",
  "function PREMIUM_AMOUNT() external view returns (uint256)",
  "function COVERAGE_AMOUNT() external view returns (uint256)"
];

export const CLAIM_PAYOUT_ABI = [
  "function fileClaim(string memory notes) external",
  "function approveClaim(address worker) external",
  "function rejectClaim(address worker, string memory reason) external",
  "function getMyClaimStatus() external view returns (uint8 status, uint256 requestedAmount, uint256 filedAt, string memory notes)",
  "function PAYOUT_AMOUNT() external view returns (uint256)"
];

export const REPUTATION_SCORE_ABI = [
  "function getMyScore() external view returns (uint256)",
  "function getScore(address user) external view returns (uint256)"
];
```

---

### 4️⃣ **Buy Coverage (User Action)**

```javascript
async function buyCoverage(signer) {
  const insuranceContract = new ethers.Contract(
    CONTRACTS.insurancePolicy,
    INSURANCE_POLICY_ABI,
    signer
  );
  
  try {
    console.log("💰 Buying coverage for 5 SHM...");
    
    const tx = await insuranceContract.buyDailyCoverage({
      value: ethers.parseEther("5") // 5 SHM
    });
    
    console.log("⏳ Transaction sent:", tx.hash);
    await tx.wait();
    
    console.log("✅ Coverage purchased! Valid for 24 hours");
    return { success: true, txHash: tx.hash };
    
  } catch (error) {
    console.error("❌ Failed:", error);
    return { success: false, error };
  }
}
```

---

### 5️⃣ **Check Coverage Status**

```javascript
async function checkCoverage(signer) {
  const insuranceContract = new ethers.Contract(
    CONTRACTS.insurancePolicy,
    INSURANCE_POLICY_ABI,
    signer
  );
  
  const [isActive, coverageAmount, timeRemaining] = 
    await insuranceContract.checkMyCoverage();
  
  if (isActive) {
    const hoursLeft = Math.floor(Number(timeRemaining) / 3600);
    console.log(`✅ Coverage Active: ${ethers.formatEther(coverageAmount)} SHM`);
    console.log(`⏰ Expires in: ${hoursLeft} hours`);
  } else {
    console.log("❌ No active coverage");
  }
  
  return { isActive, coverageAmount, timeRemaining };
}
```

---

### 6️⃣ **File a Claim (User Action)**

```javascript
async function fileClaim(signer, accidentDescription) {
  const claimContract = new ethers.Contract(
    CONTRACTS.claimPayout,
    CLAIM_PAYOUT_ABI,
    signer
  );
  
  try {
    console.log("📋 Filing claim...");
    
    const tx = await claimContract.fileClaim(accidentDescription);
    
    console.log("⏳ Transaction sent:", tx.hash);
    await tx.wait();
    
    console.log("✅ Claim filed! Waiting for approval");
    return { success: true, txHash: tx.hash };
    
  } catch (error) {
    console.error("❌ Failed:", error);
    return { success: false, error };
  }
}
```

---

### 7️⃣ **Check Claim Status**

```javascript
async function checkClaimStatus(signer) {
  const claimContract = new ethers.Contract(
    CONTRACTS.claimPayout,
    CLAIM_PAYOUT_ABI,
    signer
  );
  
  const [status, amount, filedAt, notes] = 
    await claimContract.getMyClaimStatus();
  
  const statusNames = ["None", "Pending", "Approved", "Rejected"];
  
  console.log("📊 Claim Status:", statusNames[status]);
  if (status > 0) {
    console.log("💰 Amount:", ethers.formatEther(amount), "SHM");
    console.log("📝 Notes:", notes);
  }
  
  return { status: statusNames[status], amount, filedAt, notes };
}
```

---

### 8️⃣ **Approve Claim (OWNER ONLY - For Your Backend/Admin Panel)**

```javascript
async function approveClaim(ownerSigner, workerAddress) {
  const claimContract = new ethers.Contract(
    CONTRACTS.claimPayout,
    CLAIM_PAYOUT_ABI,
    ownerSigner // Must be the owner/deployer account
  );
  
  try {
    console.log("✅ Approving claim for:", workerAddress);
    
    const tx = await claimContract.approveClaim(workerAddress);
    
    console.log("⏳ Transaction sent:", tx.hash);
    await tx.wait();
    
    console.log("💸 Payout sent! Worker received 150 SHM");
    return { success: true, txHash: tx.hash };
    
  } catch (error) {
    console.error("❌ Failed:", error);
    return { success: false, error };
  }
}
```

---

## 📱 **React Native Example (Complete Flow)**

```typescript
import { ethers } from 'ethers';

// 1. Connect wallet
const { signer } = await connectWallet();

// 2. Buy coverage
await buyCoverage(signer);

// 3. Check coverage
await checkCoverage(signer);

// 4. (If accident happens) File claim
await fileClaim(signer, "Had accident while delivering order");

// 5. Check claim status
await checkClaimStatus(signer);

// 6. (Admin approves - backend/owner wallet)
// await approveClaim(ownerSigner, userAddress);
```

---

## 🎯 **For Your Hackathon Demo:**

### **User Flow:**
1. Open ParaCipher app
2. Connect MetaMask (Shardeum Testnet)
3. Click "Buy Coverage" → Pay 5 SHM
4. Start delivering (24hr coverage active)
5. If accident → Click "File Claim" → Enter details
6. Wait for approval
7. Receive 150 SHM payout!

### **Demo Script:**
```
1. "I'm a gig worker using ParaCipher"
2. "I buy daily insurance for 5 SHM"
3. "Now I'm covered for 24 hours"
4. "Oh no! I had an accident while delivering"
5. "I file a claim through the app"
6. "The owner reviews and approves"
7. "I receive 150 SHM payout instantly!"
```

---

## 🔗 **Explorer Links**

View contracts on blockchain:
- **InsurancePolicy:** https://explorer-mezame.shardeum.org/address/0x3A84E06554876A557b16249619247eF765C35407
- **ClaimPayout:** https://explorer-mezame.shardeum.org/address/0xf678B23d7887d9c9dbc49C2170902d5c88075c2D

---

## ⚡ **Quick Testing Commands**

```bash
# Check your balance
npx hardhat run scripts/check-balance.js --network shardeum

# Verify deployment
npx hardhat run scripts/verify-deployment.js --network shardeum

# Get money back from contract (after demo)
npx hardhat run scripts/emergency-withdraw.js --network shardeum
```

---

## 🎬 **Ready to Demo!**

Your contracts are **LIVE** on Shardeum with **200 SHM** ready for 1 claim demo.

**Current Status:**
- ✅ Contracts deployed
- ✅ Funded with 200 SHM
- ✅ Ready for testing
- 💰 Your wallet: ~463 SHM remaining

**Good luck with your hackathon! 🚀**
