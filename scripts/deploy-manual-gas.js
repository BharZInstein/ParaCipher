const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 PARACIPHER DEPLOYMENT (Manual Gas Settings)");
    console.log("=".repeat(60) + "\n");

    const [deployer] = await ethers.getSigners();
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";
    console.log("📝 Deploying from account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), currencySymbol);
    console.log("🌐 Network:", hre.network.name, "\n");

    // Manual gas settings for Shardeum - using very low limits
    const gasSettings = {
        gasLimit: 500000,  // Much lower gas limit
    };

    console.log("⚙️  Using manual gas settings:");
    console.log("   Gas Limit:", gasSettings.gasLimit);
    console.log("");

    // ========== STEP 1: Deploy InsurancePolicy ==========
    console.log("📋 [1/5] Deploying InsurancePolicy...");
    let insurancePolicy, claimPayout, reputationScore;
    try {
        const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy(gasSettings);
        await insurancePolicy.waitForDeployment();
        const insurancePolicyAddress = await insurancePolicy.getAddress();
        console.log("✅ InsurancePolicy deployed:", insurancePolicyAddress);
    } catch (error) {
        console.error("❌ Failed to deploy InsurancePolicy:", error.message);
        throw error;
    }

    // ========== STEP 2: Deploy ClaimPayout ==========
    console.log("\n📋 [2/5] Deploying ClaimPayout...");
    const insurancePolicyAddress = await insurancePolicy.getAddress();
    console.log("   ↳ Linking to InsurancePolicy:", insurancePolicyAddress);
    try {
        const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(insurancePolicyAddress, gasSettings);
        await claimPayout.waitForDeployment();
        const claimPayoutAddress = await claimPayout.getAddress();
        console.log("✅ ClaimPayout deployed:", claimPayoutAddress);
    } catch (error) {
        console.error("❌ Failed to deploy ClaimPayout:", error.message);
        throw error;
    }

    // ========== STEP 3: Deploy ReputationScore ==========
    console.log("\n📋 [3/5] Deploying ReputationScore...");
    try {
        const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
        reputationScore = await ReputationScore.deploy(gasSettings);
        await reputationScore.waitForDeployment();
        const reputationScoreAddress = await reputationScore.getAddress();
        console.log("✅ ReputationScore deployed:", reputationScoreAddress);
    } catch (error) {
        console.error("❌ Failed to deploy ReputationScore:", error.message);
        throw error;
    }

    // ========== STEP 4: Connect Contracts ==========
    console.log("\n🔗 [4/5] Connecting contracts...");
    const claimPayoutAddress = await claimPayout.getAddress();
    const reputationScoreAddress = await reputationScore.getAddress();
    console.log("   ↳ Linking ReputationScore to ClaimPayout...");
    try {
        const linkTx = await claimPayout.setReputationContract(reputationScoreAddress, {
            gasLimit: 200000
        });
        await linkTx.wait();
        console.log("✅ Contracts connected successfully");
    } catch (error) {
        console.error("❌ Failed to connect contracts:", error.message);
        throw error;
    }

    // ========== STEP 5: Fund ClaimPayout ==========
    console.log("\n💰 [5/5] Funding ClaimPayout contract...");

    const fundingAmountEnv = process.env.FUNDING_AMOUNT || "50";
    const fundingAmount = ethers.parseEther(fundingAmountEnv);

    console.log("   ↳ Amount:", ethers.formatEther(fundingAmount), currencySymbol);
    console.log("   ↳ Set FUNDING_AMOUNT env var to change this amount");

    try {
        const fundTx = await claimPayout.fundContract({ 
            value: fundingAmount,
            gasLimit: 200000
        });
        await fundTx.wait();

        const claimBalance = await ethers.provider.getBalance(claimPayoutAddress);
        console.log("✅ ClaimPayout funded. Balance:", ethers.formatEther(claimBalance), currencySymbol);
    } catch (error) {
        console.error("❌ Failed to fund ClaimPayout:", error.message);
        throw error;
    }

    // ========== DEPLOYMENT SUMMARY ==========
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));

    const finalInsurancePolicyAddress = await insurancePolicy.getAddress();
    const finalClaimPayoutAddress = await claimPayout.getAddress();
    const finalReputationScoreAddress = await reputationScore.getAddress();

    console.log("\n📌 Contract Addresses:\n");
    console.log("   InsurancePolicy:  ", finalInsurancePolicyAddress);
    console.log("   ClaimPayout:      ", finalClaimPayoutAddress);
    console.log("   ReputationScore:  ", finalReputationScoreAddress);

    console.log("\n📊 Contract States:\n");
    console.log("   Premium Amount:     ", ethers.formatEther(await insurancePolicy.PREMIUM_AMOUNT()), currencySymbol);
    console.log("   Coverage Amount:    ", ethers.formatEther(await insurancePolicy.COVERAGE_AMOUNT()), currencySymbol);
    console.log("   Payout Amount:      ", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), currencySymbol);
    const finalClaimBalance = await ethers.provider.getBalance(finalClaimPayoutAddress);
    console.log("   ClaimPayout Balance:", ethers.formatEther(finalClaimBalance), currencySymbol);

    console.log("\n🔥 Next Steps:\n");
    console.log("   1. Save contract addresses above");
    console.log("   2. Verify contracts on block explorer");
    console.log("   3. Test with: npx hardhat run scripts/test-contracts.js --network shardeum");
    console.log("   4. Build your frontend with these addresses\n");

    // Save addresses to file
    const fs = require('fs');
    const deploymentInfo = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            InsurancePolicy: finalInsurancePolicyAddress,
            ClaimPayout: finalClaimPayoutAddress,
            ReputationScore: finalReputationScoreAddress
        },
        constants: {
            premiumAmount: "5 SHM",
            coverageAmount: "15 SHM",
            payoutAmount: "15 SHM",
            coverageDuration: "24 hours"
        }
    };

    fs.writeFileSync(
        'deployment-addresses.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("📝 Deployment info saved to: deployment-addresses.json\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });

