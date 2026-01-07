const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 PARACIPHER DEPLOYMENT");
    console.log("=".repeat(60) + "\n");

    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying from account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

    // ========== STEP 1: Deploy InsurancePolicy ==========
    console.log("📋 [1/5] Deploying InsurancePolicy...");
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = await InsurancePolicy.deploy();
    await insurancePolicy.waitForDeployment();
    const insurancePolicyAddress = await insurancePolicy.getAddress();
    console.log("✅ InsurancePolicy deployed:", insurancePolicyAddress);

    // ========== STEP 2: Deploy ClaimPayout ==========
    console.log("\n📋 [2/5] Deploying ClaimPayout...");
    console.log("   ↳ Linking to InsurancePolicy:", insurancePolicyAddress);
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = await ClaimPayout.deploy(insurancePolicyAddress);
    await claimPayout.waitForDeployment();
    const claimPayoutAddress = await claimPayout.getAddress();
    console.log("✅ ClaimPayout deployed:", claimPayoutAddress);

    // ========== STEP 3: Deploy ReputationScore ==========
    console.log("\n📋 [3/5] Deploying ReputationScore...");
    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = await ReputationScore.deploy();
    await reputationScore.waitForDeployment();
    const reputationScoreAddress = await reputationScore.getAddress();
    console.log("✅ ReputationScore deployed:", reputationScoreAddress);

    // ========== STEP 4: Connect Contracts ==========
    console.log("\n🔗 [4/5] Connecting contracts...");
    console.log("   ↳ Linking ReputationScore to ClaimPayout...");
    const linkTx = await claimPayout.setReputationContract(reputationScoreAddress);
    await linkTx.wait();
    console.log("✅ Contracts connected successfully");

    // ========== STEP 5: Fund ClaimPayout ==========
    console.log("\n💰 [5/5] Funding ClaimPayout contract...");
    const fundingAmount = ethers.parseEther("500000"); // 500,000 MATIC for payouts
    console.log("   ↳ Amount:", ethers.formatEther(fundingAmount), "MATIC");
    const fundTx = await claimPayout.fundContract({ value: fundingAmount });
    await fundTx.wait();
    
    const claimBalance = await ethers.provider.getBalance(claimPayoutAddress);
    console.log("✅ ClaimPayout funded. Balance:", ethers.formatEther(claimBalance), "MATIC");

    // ========== DEPLOYMENT SUMMARY ==========
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    
    console.log("\n📌 Contract Addresses:\n");
    console.log("   InsurancePolicy:  ", insurancePolicyAddress);
    console.log("   ClaimPayout:      ", claimPayoutAddress);
    console.log("   ReputationScore:  ", reputationScoreAddress);

    console.log("\n📊 Contract States:\n");
    console.log("   Premium Amount:     ", ethers.formatEther(await insurancePolicy.PREMIUM_AMOUNT()), "MATIC");
    console.log("   Coverage Amount:    ", ethers.formatEther(await insurancePolicy.COVERAGE_AMOUNT()), "MATIC");
    console.log("   Payout Amount:      ", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), "MATIC");
    console.log("   ClaimPayout Balance:", ethers.formatEther(claimBalance), "MATIC");

    console.log("\n🔥 Next Steps:\n");
    console.log("   1. Save contract addresses above");
    console.log("   2. Verify contracts on block explorer");
    console.log("   3. Test with: npx hardhat run scripts/test-flow.js --network <network>");
    console.log("   4. Build your frontend with these addresses\n");

    // Save addresses to file for easy reference
    const fs = require('fs');
    const deploymentInfo = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            InsurancePolicy: insurancePolicyAddress,
            ClaimPayout: claimPayoutAddress,
            ReputationScore: reputationScoreAddress
        },
        constants: {
            premiumAmount: "25 MATIC",
            coverageAmount: "50000 MATIC",
            payoutAmount: "50000 MATIC",
            coverageDuration: "24 hours"
        }
    };

    fs.writeFileSync(
        'deployment-addresses.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("📝 Deployment info saved to: deployment-addresses.json\n");
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
