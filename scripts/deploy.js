const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 PARACIPHER DEPLOYMENT");
    console.log("=".repeat(60) + "\n");

    const [deployer] = await ethers.getSigners();
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";
    console.log("📝 Deploying from account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), currencySymbol);
    console.log("🌐 Network:", hre.network.name, "\n");

    // ========== STEP 1: Deploy InsurancePolicy ==========
    console.log("📋 [1/5] Deploying InsurancePolicy...");
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = await InsurancePolicy.deploy({
        gasLimit: 2000000  // Lower gas limit for Shardeum
    });
    await insurancePolicy.waitForDeployment();
    const insurancePolicyAddress = await insurancePolicy.getAddress();
    console.log("✅ InsurancePolicy deployed:", insurancePolicyAddress);

    // ========== STEP 2: Deploy ClaimPayout ==========
    console.log("\n📋 [2/5] Deploying ClaimPayout...");
    console.log("   ↳ Linking to InsurancePolicy:", insurancePolicyAddress);
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = await ClaimPayout.deploy(insurancePolicyAddress, {
        gasLimit: 2000000  // Lower gas limit for Shardeum
    });
    await claimPayout.waitForDeployment();
    const claimPayoutAddress = await claimPayout.getAddress();
    console.log("✅ ClaimPayout deployed:", claimPayoutAddress);

    // ========== STEP 3: Deploy ReputationScore ==========
    console.log("\n📋 [3/5] Deploying ReputationScore...");
    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = await ReputationScore.deploy({
        gasLimit: 2000000  // Lower gas limit for Shardeum
    });
    await reputationScore.waitForDeployment();
    const reputationScoreAddress = await reputationScore.getAddress();
    console.log("✅ ReputationScore deployed:", reputationScoreAddress);

    // ========== STEP 4: Connect Contracts ==========
    console.log("\n🔗 [4/5] Connecting contracts...");
    console.log("   ↳ Linking ReputationScore to ClaimPayout...");
    const linkTx1 = await claimPayout.setReputationContract(reputationScoreAddress);
    await linkTx1.wait();
    console.log("   ↳ Linking ClaimPayout to InsurancePolicy (for premium forwarding)...");
    const linkTx2 = await insurancePolicy.setClaimPayoutContract(claimPayoutAddress);
    await linkTx2.wait();
    console.log("✅ Contracts connected successfully");

    // ========== STEP 5: Fund ClaimPayout ==========
    console.log("\n💰 [5/5] Funding ClaimPayout contract...");

    // Get funding amount from environment variable or use default (30 SHM for testing)
    const fundingAmountEnv = process.env.FUNDING_AMOUNT || "30";
    const fundingAmount = ethers.parseEther(fundingAmountEnv);

    console.log("   ↳ Amount:", ethers.formatEther(fundingAmount), currencySymbol);
    console.log("   ↳ Set FUNDING_AMOUNT env var to change this amount");

    // Check if deployer has enough balance
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    if (deployerBalance < fundingAmount) {
        console.log("   ⚠️  Warning: Deployer balance might be insufficient");
        console.log("   ↳ Deployer balance:", ethers.formatEther(deployerBalance), currencySymbol);
        console.log("   ↳ Required:", ethers.formatEther(fundingAmount), currencySymbol);
    }

    const fundTx = await claimPayout.fundContract({ 
        value: fundingAmount,
        gasLimit: 500000  // Explicit gas limit for funding
    });
    await fundTx.wait();

    const claimBalance = await ethers.provider.getBalance(claimPayoutAddress);
    console.log("✅ ClaimPayout funded. Balance:", ethers.formatEther(claimBalance), currencySymbol);

    // ========== DEPLOYMENT SUMMARY ==========
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));

    console.log("\n📌 Contract Addresses:\n");
    console.log("   InsurancePolicy:  ", insurancePolicyAddress);
    console.log("   ClaimPayout:      ", claimPayoutAddress);
    console.log("   ReputationScore:  ", reputationScoreAddress);

    console.log("\n📊 Contract States:\n");
    console.log("   Premium Amount:     ", ethers.formatEther(await insurancePolicy.PREMIUM_AMOUNT()), currencySymbol);
    console.log("   Coverage Amount:    ", ethers.formatEther(await insurancePolicy.COVERAGE_AMOUNT()), currencySymbol);
    console.log("   Payout Amount:      ", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), currencySymbol);
    console.log("   ClaimPayout Balance:", ethers.formatEther(claimBalance), currencySymbol);

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
            premiumAmount: "5 SHM",
            coverageAmount: "15 SHM",
            payoutAmount: "15 SHM",
            coverageDuration: "6 hours"
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
