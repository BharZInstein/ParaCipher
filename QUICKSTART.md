# ParaCipher Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Hardhat (if not already)

```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

Choose: **Create a JavaScript project**

### Step 2: Copy Contract Files

Your contracts are already in `contracts/`:
- `InsurancePolicy.sol`
- `ClaimPayout.sol`
- `ReputationScore.sol`

### Step 3: Deploy Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
    // 1. Deploy InsurancePolicy
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = await InsurancePolicy.deploy();
    await insurancePolicy.waitForDeployment();
    console.log("InsurancePolicy:", await insurancePolicy.getAddress());

    // 2. Deploy ClaimPayout
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());
    await claimPayout.waitForDeployment();
    console.log("ClaimPayout:", await claimPayout.getAddress());

    // 3. Deploy ReputationScore
    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = await ReputationScore.deploy();
    await reputationScore.waitForDeployment();
    console.log("ReputationScore:", await reputationScore.getAddress());

    // 4. Connect contracts
    await claimPayout.setReputationContract(await reputationScore.getAddress());
    console.log("✅ Contracts connected");

    // 5. Fund ClaimPayout
    await claimPayout.fundContract({value: hre.ethers.parseEther("500000")});
    console.log("✅ ClaimPayout funded");
}

main().catch(console.error);
```

### Step 4: Run Deployment

```bash
# Local network (for testing)
npx hardhat node

# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🎮 Quick Test

### Test Script

Create `scripts/test-flow.js`:

```javascript
const hre = require("hardhat");

async function main() {
    const [owner, worker] = await hre.ethers.getSigners();

    // Get deployed contracts (replace with your addresses)
    const insurancePolicy = await hre.ethers.getContractAt("InsurancePolicy", "0x...");
    const claimPayout = await hre.ethers.getContractAt("ClaimPayout", "0x...");
    const reputationScore = await hre.ethers.getContractAt("ReputationScore", "0x...");

    console.log("\n🧪 Testing ParaCipher...\n");

    // 1. Worker buys coverage
    console.log("1️⃣ Worker buying coverage...");
    await insurancePolicy.connect(worker).buyDailyCoverage({
        value: hre.ethers.parseEther("25")
    });
    console.log("✅ Coverage purchased");

    // 2. Check coverage
    console.log("\n2️⃣ Checking coverage...");
    const [isActive, coverage] = await insurancePolicy.connect(worker).checkMyCoverage();
    console.log(`Coverage: ${isActive ? "Active" : "Inactive"} - ${hre.ethers.formatEther(coverage)} MATIC`);

    // 3. File claim
    console.log("\n3️⃣ Filing claim...");
    await claimPayout.connect(worker).fileClaim("Bike accident on highway");
    console.log("✅ Claim filed");

    // 4. Approve claim
    console.log("\n4️⃣ Owner approving claim...");
    const balanceBefore = await hre.ethers.provider.getBalance(worker.address);
    await claimPayout.connect(owner).approveClaim(worker.address);
    const balanceAfter = await hre.ethers.provider.getBalance(worker.address);
    console.log(`✅ Payout sent: ${hre.ethers.formatEther(balanceAfter - balanceBefore)} MATIC`);

    // 5. Check reputation
    console.log("\n5️⃣ Checking reputation...");
    const [score] = await reputationScore.connect(worker).getMyScore();
    console.log(`Reputation Score: ${score} (Decreased by 20 for claim)`);

    console.log("\n✨ Test complete!");
}

main().catch(console.error);
```

---

## 📱 Simple Frontend

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>ParaCipher - Worker Dashboard</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
</head>
<body>
    <h1>🛡️ ParaCipher Insurance</h1>
    
    <div id="status">
        <p>Coverage: <span id="coverage">-</span></p>
        <p>Reputation: <span id="reputation">-</span></p>
        <p>Discount: <span id="discount">-</span>%</p>
    </div>

    <button onclick="buyCoverage()">Buy Coverage (25 MATIC)</button>
    <button onclick="fileClaim()">File Claim</button>
    <button onclick="checkStatus()">Refresh Status</button>

    <script>
        const POLICY_ADDRESS = "0x..."; // Your deployed address
        const CLAIM_ADDRESS = "0x...";
        const REP_ADDRESS = "0x...";

        // ABIs (simplified - get full from compilation)
        const POLICY_ABI = [
            "function buyDailyCoverage() payable",
            "function checkMyCoverage() view returns (bool, uint256, uint256)"
        ];

        let provider, signer, policyContract;

        async function connect() {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            policyContract = new ethers.Contract(POLICY_ADDRESS, POLICY_ABI, signer);
        }

        async function buyCoverage() {
            await connect();
            const tx = await policyContract.buyDailyCoverage({
                value: ethers.utils.parseEther("25")
            });
            await tx.wait();
            alert("Coverage purchased!");
            checkStatus();
        }

        async function checkStatus() {
            await connect();
            const [isActive, coverage] = await policyContract.checkMyCoverage();
            document.getElementById("coverage").innerText = 
                isActive ? "Active - " + ethers.utils.formatEther(coverage) + " MATIC" : "Inactive";
        }

        // Auto-load on page load
        window.addEventListener('load', checkStatus);
    </script>
</body>
</html>
```

---

## 🎯 Common Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy locally
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (Mumbai)
npx hardhat run scripts/deploy.js --network polygon_mumbai

# Verify on Polygonscan
npx hardhat verify --network polygon_mumbai DEPLOYED_ADDRESS
```

---

## ⚡ Hardhat Config

Update `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};
```

Create `.env`:
```
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_api_key_here
```

---

## 🐛 Troubleshooting

### "Insufficient funds"
- Make sure ClaimPayout has enough MATIC for payouts
- Run: `claimPayout.fundContract({value: ethers.parseEther("100000")})`

### "No valid coverage found"
- Worker must buy coverage BEFORE filing claim
- Coverage expires after 24 hours

### "Policy already claimed"
- Each policy can only be claimed once
- Worker must buy new coverage to claim again

---

## 🎓 Learning Checklist

- [ ] Deploy all 3 contracts
- [ ] Buy coverage as worker
- [ ] File and approve a claim
- [ ] Check reputation changes
- [ ] Test coverage expiration (24hrs)
- [ ] Try double claim (should fail)
- [ ] Withdraw premiums as owner

---

**Ready to hack! 🚀**
