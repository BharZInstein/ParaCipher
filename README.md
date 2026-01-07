# ParaCipher - Parametric Insurance for Gig Workers

A simple blockchain-based parametric insurance platform for Uber/Zomato drivers. Workers pay ₹25 for 24-hour coverage and receive ₹50,000 instant payout if they have an accident.

---

## 📋 Smart Contracts Overview

### 1. **InsurancePolicy.sol**
- Manages daily coverage purchases
- Stores active policies
- Handles premium collection
- 24-hour auto-expiring coverage

### 2. **ClaimPayout.sol**
- Processes accident claims
- Manual claim approval (MVP)
- Sends instant payouts
- Prevents double claims

### 3. **ReputationScore.sol**
- Tracks worker safety records
- Calculates premium discounts
- Rewards safe drivers
- Penalizes frequent claims

---

## 🚀 Deployment Order

**IMPORTANT:** Deploy in this exact order!

### Step 1: Deploy InsurancePolicy
```solidity
// Deploy first - it's independent
InsurancePolicy insurancePolicy = new InsurancePolicy();
```

### Step 2: Deploy ClaimPayout
```solidity
// Deploy second - needs InsurancePolicy address
ClaimPayout claimPayout = new ClaimPayout(address(insurancePolicy));
```

### Step 3: Deploy ReputationScore
```solidity
// Deploy third - it's independent
ReputationScore reputationScore = new ReputationScore();
```

### Step 4: Connect Contracts
```solidity
// Link ReputationScore to ClaimPayout
claimPayout.setReputationContract(address(reputationScore));
```

### Step 5: Fund ClaimPayout Contract
```solidity
// Send MATIC to ClaimPayout for payouts
claimPayout.fundContract{value: 500000 ether}();
// Or simply send directly to contract address
```

---

## 🔗 How Contracts Work Together

```
┌─────────────────────┐
│  InsurancePolicy    │
│  (Coverage Sales)   │
└──────────┬──────────┘
           │
           │ hasValidCoverage()
           │ markAsClaimed()
           ▼
┌─────────────────────┐      ┌──────────────────┐
│   ClaimPayout       │─────▶│ ReputationScore  │
│  (Claims & Payouts) │      │ (Safety Tracker) │
└─────────────────────┘      └──────────────────┘
           │                          ▲
           │                          │
           └──deductForClaim()────────┘
```

**Flow:**
1. Worker buys coverage from **InsurancePolicy**
2. Worker files claim via **ClaimPayout**
3. **ClaimPayout** checks **InsurancePolicy** for valid coverage
4. Owner approves claim in **ClaimPayout**
5. **ClaimPayout** triggers payout + updates **ReputationScore**

---

## 📝 Complete Usage Flow

### For Workers:

#### 1. Buy Coverage
```solidity
// Send 25 MATIC to buy 24-hour coverage
insurancePolicy.buyDailyCoverage{value: 25 ether}();
```

#### 2. Check Your Coverage
```solidity
(bool isActive, uint256 coverage, uint256 timeLeft) = insurancePolicy.checkMyCoverage();
// Returns: (true, 50000 MATIC, seconds remaining)
```

#### 3. File a Claim (if accident happens)
```solidity
claimPayout.fileClaim("Two-wheeler accident on MG Road, Bangalore at 3 PM");
```

#### 4. Check Claim Status
```solidity
(ClaimStatus status, uint256 amount, uint256 filedAt, string memory notes) = 
    claimPayout.getMyClaimStatus();
```

#### 5. Check Your Reputation
```solidity
(uint256 score, uint256 safeDays, uint256 claims, int256 discount) = 
    reputationScore.getMyScore();
// Example: (120, 15, 1, 10) = Score 120, 15 safe days, 1 claim, 10% discount
```

---

### For Owner (Admin):

#### 1. Approve Claims
```solidity
// After verifying accident occurred
claimPayout.approveClaim(workerAddress);
// This automatically:
// - Marks policy as claimed
// - Sends 50,000 MATIC to worker
// - Deducts 20 reputation points
```

#### 2. Reject Fraudulent Claims
```solidity
claimPayout.rejectClaim(workerAddress, "No evidence of accident");
```

#### 3. Reward Safe Workers
```solidity
// Give +5 points for completing a safe day
reputationScore.addSafeDay(workerAddress);
```

#### 4. Withdraw Premiums
```solidity
insurancePolicy.withdrawPremiums();
```

#### 5. Fund Payout Contract
```solidity
claimPayout.fundContract{value: 1000000 ether}();
```

---

## 🎯 Test Scenario Walkthrough

### Scenario: Rajesh (Uber Driver) Complete Journey

```javascript
// ===== DAY 1: New Driver Joins =====

// 1. Rajesh buys coverage (8 AM)
await insurancePolicy.connect(rajesh).buyDailyCoverage({value: ethers.parseEther("25")});
✅ Event: PolicyPurchased
✅ Coverage: 50,000 MATIC until 8 AM tomorrow
✅ Reputation: 100 (default)

// 2. Rajesh completes safe day (8 PM)
await reputationScore.connect(owner).addSafeDay(rajesh.address);
✅ Reputation: 105 (+5)
✅ Discount: 0% (still below 120)


// ===== DAY 2: Accident Happens =====

// 3. Rajesh renews coverage (8 AM)
await insurancePolicy.connect(rajesh).buyDailyCoverage({value: ethers.parseEther("25")});
✅ New 24-hour coverage starts

// 4. Accident occurs! (2 PM)
await claimPayout.connect(rajesh).fileClaim("Bike accident, broken arm");
✅ Event: ClaimFiled
✅ Status: Pending

// 5. Owner verifies and approves (2:30 PM)
await claimPayout.connect(owner).approveClaim(rajesh.address);
✅ Event: ClaimApproved
✅ Event: PayoutSent
✅ Rajesh receives: 50,000 MATIC
✅ Reputation: 85 (-20 penalty)
✅ Policy marked as claimed


// ===== DAY 10: Rajesh Returns =====

// 6. After recovery, Rajesh continues working
// Owner rewards him for 7 safe days
for(let i = 0; i < 7; i++) {
    await reputationScore.connect(owner).addSafeDay(rajesh.address);
}
✅ Reputation: 120 (85 + 35)
✅ Now qualifies for 10% discount!

// 7. Check discount
const discount = await reputationScore.calculateDiscount(rajesh.address);
console.log(discount); // Returns: 10

// 8. Buy coverage with new reputation
await insurancePolicy.connect(rajesh).buyDailyCoverage({value: ethers.parseEther("25")});
// NOTE: In V2, we'll integrate discount into buyDailyCoverage()
// For now, discount is just tracked for future use


// ===== DAY 30: Premium Driver Status =====

// 9. After 30 total safe days
// Reputation: 150+ (qualifies for 20% discount)
const premium = await reputationScore.getDiscountedPremium(
    rajesh.address, 
    ethers.parseEther("25")
);
console.log(premium); // Returns: 20 MATIC (20% off)
```

---

## 💡 Key Features Explained

### 1. **Auto-Expiring Coverage**
- Coverage automatically expires after 24 hours
- No need to manually cancel
- Worker can buy new coverage anytime after expiration

### 2. **Prevents Double Claims**
- Each policy can only be claimed once
- `hasClaimed` flag prevents fraud
- Must buy new coverage to claim again

### 3. **Reputation-Based Pricing**
- Safe drivers get discounts (up to 20% off)
- Risky drivers pay surcharges (10% extra)
- Incentivizes safe driving behavior

### 4. **Manual Approval (MVP)**
- Owner verifies accidents before payout
- Future: Integrate Chainlink oracles for automation
- Prevents fraudulent claims

### 5. **Reentrancy Protection**
- `noReentrant` modifier on approveClaim
- Prevents reentrancy attacks during payouts
- Industry-standard security pattern

---

## 🛡️ Security Features

✅ **onlyOwner** modifiers on admin functions  
✅ **Reentrancy protection** on payouts  
✅ **Double-claim prevention**  
✅ **Coverage validation** before payouts  
✅ **Balance checks** before transfers  
✅ **Timestamp-based expiration** (not manually controlled)  

---

## 📊 Contract Addresses (After Deployment)

```
InsurancePolicy:  0x... (deploy first)
ClaimPayout:      0x... (deploy second, pass InsurancePolicy address)
ReputationScore:  0x... (deploy third)
```

Then run:
```solidity
claimPayout.setReputationContract(reputationScoreAddress);
```

---

## 🔧 Deployment Script Example

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying ParaCipher contracts...\n");

    // 1. Deploy InsurancePolicy
    console.log("📝 Deploying InsurancePolicy...");
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = await InsurancePolicy.deploy();
    await insurancePolicy.waitForDeployment();
    const insurancePolicyAddress = await insurancePolicy.getAddress();
    console.log("✅ InsurancePolicy deployed to:", insurancePolicyAddress);

    // 2. Deploy ClaimPayout
    console.log("\n📝 Deploying ClaimPayout...");
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = await ClaimPayout.deploy(insurancePolicyAddress);
    await claimPayout.waitForDeployment();
    const claimPayoutAddress = await claimPayout.getAddress();
    console.log("✅ ClaimPayout deployed to:", claimPayoutAddress);

    // 3. Deploy ReputationScore
    console.log("\n📝 Deploying ReputationScore...");
    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = await ReputationScore.deploy();
    await reputationScore.waitForDeployment();
    const reputationScoreAddress = await reputationScore.getAddress();
    console.log("✅ ReputationScore deployed to:", reputationScoreAddress);

    // 4. Connect contracts
    console.log("\n🔗 Connecting contracts...");
    const tx = await claimPayout.setReputationContract(reputationScoreAddress);
    await tx.wait();
    console.log("✅ ReputationScore linked to ClaimPayout");

    // 5. Fund ClaimPayout
    console.log("\n💰 Funding ClaimPayout with 500,000 MATIC...");
    const fundTx = await claimPayout.fundContract({
        value: ethers.parseEther("500000")
    });
    await fundTx.wait();
    console.log("✅ ClaimPayout funded");

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(50));
    console.log("\nContract Addresses:");
    console.log("InsurancePolicy: ", insurancePolicyAddress);
    console.log("ClaimPayout:     ", claimPayoutAddress);
    console.log("ReputationScore: ", reputationScoreAddress);
    console.log("\n✨ Ready for testing!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

Run with:
```bash
npx hardhat run scripts/deploy.js --network polygon_mumbai
```

---

## 🧪 Testing

Create `test/ParaCipher.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ParaCipher E2E Test", function() {
    let insurancePolicy, claimPayout, reputationScore;
    let owner, worker1;

    beforeEach(async function() {
        [owner, worker1] = await ethers.getSigners();

        // Deploy contracts
        const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy();

        const ClaimPayout = await ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());

        const ReputationScore = await ethers.getContractFactory("ReputationScore");
        reputationScore = await ReputationScore.deploy();

        // Connect contracts
        await claimPayout.setReputationContract(await reputationScore.getAddress());

        // Fund ClaimPayout
        await claimPayout.fundContract({value: ethers.parseEther("100000")});
    });

    it("Full flow: Buy coverage → File claim → Get payout", async function() {
        // 1. Worker buys coverage
        await insurancePolicy.connect(worker1).buyDailyCoverage({
            value: ethers.parseEther("25")
        });

        // 2. Check coverage is active
        const [isActive, coverage] = await insurancePolicy.connect(worker1).checkMyCoverage();
        expect(isActive).to.be.true;
        expect(coverage).to.equal(ethers.parseEther("50000"));

        // 3. File claim
        await claimPayout.connect(worker1).fileClaim("Test accident");

        // 4. Check claim is pending
        const [status] = await claimPayout.connect(worker1).getMyClaimStatus();
        expect(status).to.equal(1); // Pending

        // 5. Owner approves claim
        const balanceBefore = await ethers.provider.getBalance(worker1.address);
        await claimPayout.connect(owner).approveClaim(worker1.address);

        // 6. Verify payout received
        const balanceAfter = await ethers.provider.getBalance(worker1.address);
        expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("50000"));

        // 7. Check reputation decreased
        const [score] = await reputationScore.connect(worker1).getMyScore();
        expect(score).to.equal(80); // 100 - 20 penalty
    });
});
```

Run tests:
```bash
npx hardhat test
```

---

## 🎨 Frontend Integration Example

```javascript
// Connect to contracts
const insurancePolicy = new ethers.Contract(POLICY_ADDRESS, POLICY_ABI, signer);
const claimPayout = new ethers.Contract(CLAIM_ADDRESS, CLAIM_ABI, signer);
const reputationScore = new ethers.Contract(REP_ADDRESS, REP_ABI, signer);

// Buy coverage button click
async function buyCoverage() {
    try {
        const tx = await insurancePolicy.buyDailyCoverage({
            value: ethers.parseEther("25")
        });
        await tx.wait();
        alert("Coverage purchased! You're covered for 24 hours.");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// File claim button click
async function fileClaim(description) {
    try {
        const tx = await claimPayout.fileClaim(description);
        await tx.wait();
        alert("Claim filed! Waiting for approval.");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Check my dashboard
async function loadDashboard() {
    // Get coverage status
    const [isActive, coverage, timeLeft] = await insurancePolicy.checkMyCoverage();
    
    // Get reputation
    const [score, safeDays, claims, discount] = await reputationScore.getMyScore();
    
    // Get claim status
    const [claimStatus] = await claimPayout.getMyClaimStatus();
    
    // Update UI
    document.getElementById("coverage").innerText = isActive ? "Active" : "Inactive";
    document.getElementById("score").innerText = score;
    document.getElementById("discount").innerText = discount + "%";
}
```

---

## 🚧 Future Enhancements (V2)

1. **Chainlink Oracle Integration**
   - Automate claim verification
   - Connect to accident databases
   - Remove manual approval

2. **Dynamic Pricing**
   - Integrate reputation discounts into buyDailyCoverage
   - Real-time premium calculation

3. **NFT Policies**
   - Mint ERC721 tokens as policy certificates
   - Tradeable policies

4. **Multi-tier Coverage**
   - ₹50K, ₹100K, ₹200K coverage options
   - Different premium tiers

5. **Automated Reputation Tracking**
   - Daily automated safe day rewards
   - No manual admin intervention

---

## 📞 Support

For questions or issues:
- GitHub Issues: [Your Repo]
- Email: [Your Email]
- Discord: [Your Discord]

---

## 📄 License

MIT License - Built for hackathon demo purposes

---

**Happy Hacking! 🚀**
