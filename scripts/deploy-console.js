const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🚀 PARACIPHER DEPLOYMENT - Console Method");
    console.log("=".repeat(70) + "\n");

    const [deployer] = await ethers.getSigners();
    const currencySymbol = "SHM";
    
    console.log("📝 Deploying from:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), currencySymbol);
    console.log("🌐 Network: Shardeum\n");

    // Use conservative gas settings - increase for ClaimPayout
    const deployGasOptions = {
        gasLimit: 2000000  // 2M gas for deployments
    };
    
    const callGasOptions = {
        gasLimit: 300000  // 300k for function calls
    };

    let insurancePolicy, claimPayout, reputationScore;
    let insurancePolicyAddress, claimPayoutAddress, reputationScoreAddress;

    try {
        // ========== STEP 1: Deploy InsurancePolicy ==========
        console.log("📋 [1/5] Deploying InsurancePolicy...");
        const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy(deployGasOptions);
        console.log("   ⏳ Waiting for deployment...");
        await insurancePolicy.waitForDeployment();
        insurancePolicyAddress = await insurancePolicy.getAddress();
        console.log("✅ InsurancePolicy:", insurancePolicyAddress);

        // ========== STEP 2: Deploy ClaimPayout ==========
        console.log("\n📋 [2/5] Deploying ClaimPayout...");
        const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(insurancePolicyAddress, deployGasOptions);
        console.log("   ⏳ Waiting for deployment...");
        await claimPayout.waitForDeployment();
        claimPayoutAddress = await claimPayout.getAddress();
        console.log("✅ ClaimPayout:", claimPayoutAddress);

        // ========== STEP 3: Deploy ReputationScore ==========
        console.log("\n📋 [3/5] Deploying ReputationScore...");
        const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
        reputationScore = await ReputationScore.deploy(deployGasOptions);
        console.log("   ⏳ Waiting for deployment...");
        await reputationScore.waitForDeployment();
        reputationScoreAddress = await reputationScore.getAddress();
        console.log("✅ ReputationScore:", reputationScoreAddress);

        // ========== STEP 4: Connect Contracts ==========
        console.log("\n🔗 [4/5] Connecting contracts...");
        console.log("   ↳ Linking ReputationScore to ClaimPayout...");
        const linkTx1 = await claimPayout.setReputationContract(reputationScoreAddress, callGasOptions);
        await linkTx1.wait();
        console.log("   ↳ Linking ClaimPayout to InsurancePolicy (for premium forwarding)...");
        const linkTx2 = await insurancePolicy.setClaimPayoutContract(claimPayoutAddress, callGasOptions);
        await linkTx2.wait();
        console.log("✅ Contracts connected successfully");

        // ========== STEP 5: Fund ClaimPayout ==========
        console.log("\n💰 [5/5] Funding ClaimPayout contract...");
        const fundingAmount = ethers.parseEther("50");
        const fundTx = await claimPayout.fundContract({
            value: fundingAmount,
            ...callGasOptions
        });
        await fundTx.wait();
        console.log("✅ Funded with 50 SHM");

        // ========== VERIFY DEPLOYMENT ==========
        console.log("\n" + "=".repeat(70));
        console.log("✅ DEPLOYMENT COMPLETE!");
        console.log("=".repeat(70));

        console.log("\n📌 Contract Addresses:\n");
        console.log("   InsurancePolicy:  ", insurancePolicyAddress);
        console.log("   ClaimPayout:      ", claimPayoutAddress);
        console.log("   ReputationScore:  ", reputationScoreAddress);

        console.log("\n📊 Contract Configuration:\n");
        const premium = await insurancePolicy.PREMIUM_AMOUNT();
        const coverage = await insurancePolicy.COVERAGE_AMOUNT();
        const payout = await claimPayout.PAYOUT_AMOUNT();
        const duration = await insurancePolicy.COVERAGE_DURATION();
        const claimBalance = await ethers.provider.getBalance(claimPayoutAddress);

        console.log("   Premium Amount:     ", ethers.formatEther(premium), currencySymbol);
        console.log("   Coverage Amount:    ", ethers.formatEther(coverage), currencySymbol);
        console.log("   Payout Amount:      ", ethers.formatEther(payout), currencySymbol);
        console.log("   Coverage Duration:  ", (Number(duration) / 3600).toString(), "hours");
        console.log("   ClaimPayout Balance:", ethers.formatEther(claimBalance), currencySymbol);

        // Verify amounts
        const expectedDuration = 6 * 3600; // 6 hours in seconds
        if (premium.toString() === ethers.parseEther("5").toString() &&
            coverage.toString() === ethers.parseEther("15").toString() &&
            payout.toString() === ethers.parseEther("15").toString() &&
            duration.toString() === expectedDuration.toString()) {
            console.log("\n✅ All amounts are correct! (5 SHM premium, 15 SHM coverage/payout, 6 hours)");
        } else {
            console.log("\n⚠️  Warning: Some values don't match expected!");
        }

        // Save to file
        const fs = require('fs');
        const deploymentInfo = {
            network: "shardeum",
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
        console.log("\n📝 Saved to: deployment-addresses.json");

        console.log("\n🔗 View on Explorer:");
        console.log("   https://explorer-mezame.shardeum.org/address/" + insurancePolicyAddress);
        console.log("   https://explorer-mezame.shardeum.org/address/" + claimPayoutAddress);
        console.log("   https://explorer-mezame.shardeum.org/address/" + reputationScoreAddress);
        console.log("");

    } catch (error) {
        console.error("\n❌ Deployment failed:");
        console.error(error.message);
        
        if (insurancePolicyAddress) {
            console.log("\n⚠️  Partial deployment:");
            console.log("   InsurancePolicy:", insurancePolicyAddress);
        }
        if (claimPayoutAddress) {
            console.log("   ClaimPayout:", claimPayoutAddress);
        }
        if (reputationScoreAddress) {
            console.log("   ReputationScore:", reputationScoreAddress);
        }
        
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });

