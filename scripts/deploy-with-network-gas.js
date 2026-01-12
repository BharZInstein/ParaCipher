const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🚀 PARACIPHER DEPLOYMENT - Using Network Gas Price");
    console.log("=".repeat(70) + "\n");

    const [deployer] = await ethers.getSigners();
    const currencySymbol = "SHM";
    
    console.log("📝 Deploying from:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), currencySymbol);
    console.log("🌐 Network: Shardeum\n");

    // Get network fee data
    const feeData = await ethers.provider.getFeeData();
    console.log("⛽ Network Gas Info:");
    console.log("   Gas Price:", feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") + " gwei" : "N/A");
    console.log("   Max Fee Per Gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") + " gwei" : "N/A");
    console.log("");

    // Use network's suggested gas price with reasonable gas limit
    // Shardeum seems to require high gas prices, so we'll use what network suggests
    const gasLimit = 2000000; // 2M gas should be enough
    
    // Calculate estimated cost
    const estimatedCost = feeData.maxFeePerGas 
        ? feeData.maxFeePerGas * BigInt(gasLimit)
        : (feeData.gasPrice || ethers.parseUnits("1", "gwei")) * BigInt(gasLimit);
    
    console.log("💰 Estimated deployment cost:", ethers.formatEther(estimatedCost), currencySymbol);
    console.log("   (for all 3 contracts: ~", ethers.formatEther(estimatedCost * 3n), currencySymbol, ")");
    console.log("");

    if (estimatedCost * 3n > balance) {
        console.log("⚠️  Warning: Estimated cost exceeds balance!");
        console.log("   You may need more SHM or try deploying one contract at a time.");
        console.log("");
    }

    let insurancePolicy, claimPayout, reputationScore;
    let insurancePolicyAddress, claimPayoutAddress, reputationScoreAddress;

    try {
        // Use EIP-1559 format if available, otherwise legacy
        const txOptions = feeData.maxFeePerGas ? {
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || feeData.maxFeePerGas / 2n,
            gasLimit: gasLimit
        } : {
            gasPrice: feeData.gasPrice || ethers.parseUnits("1", "gwei"),
            gasLimit: gasLimit
        };

        // ========== STEP 1: Deploy InsurancePolicy ==========
        console.log("📋 [1/5] Deploying InsurancePolicy...");
        const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy(txOptions);
        console.log("   ⏳ Waiting for deployment...");
        await insurancePolicy.waitForDeployment();
        insurancePolicyAddress = await insurancePolicy.getAddress();
        console.log("✅ InsurancePolicy:", insurancePolicyAddress);

        // ========== STEP 2: Deploy ClaimPayout ==========
        console.log("\n📋 [2/5] Deploying ClaimPayout...");
        const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(insurancePolicyAddress, txOptions);
        console.log("   ⏳ Waiting for deployment...");
        await claimPayout.waitForDeployment();
        claimPayoutAddress = await claimPayout.getAddress();
        console.log("✅ ClaimPayout:", claimPayoutAddress);

        // ========== STEP 3: Deploy ReputationScore ==========
        console.log("\n📋 [3/5] Deploying ReputationScore...");
        const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
        reputationScore = await ReputationScore.deploy(txOptions);
        console.log("   ⏳ Waiting for deployment...");
        await reputationScore.waitForDeployment();
        reputationScoreAddress = await reputationScore.getAddress();
        console.log("✅ ReputationScore:", reputationScoreAddress);

        // ========== STEP 4: Connect Contracts ==========
        console.log("\n🔗 [4/5] Connecting contracts...");
        const linkTx = await claimPayout.setReputationContract(reputationScoreAddress, {
            gasLimit: 200000
        });
        await linkTx.wait();
        console.log("✅ Contracts linked!");

        // ========== STEP 5: Fund ClaimPayout ==========
        console.log("\n💰 [5/5] Funding ClaimPayout...");
        const fundingAmount = ethers.parseEther("50");
        const fundTx = await claimPayout.fundContract({
            value: fundingAmount,
            gasLimit: 200000
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
        const claimBalance = await ethers.provider.getBalance(claimPayoutAddress);

        console.log("   Premium Amount:     ", ethers.formatEther(premium), currencySymbol);
        console.log("   Coverage Amount:    ", ethers.formatEther(coverage), currencySymbol);
        console.log("   Payout Amount:      ", ethers.formatEther(payout), currencySymbol);
        console.log("   ClaimPayout Balance:", ethers.formatEther(claimBalance), currencySymbol);

        // Verify amounts
        if (premium.toString() === ethers.parseEther("5").toString() &&
            coverage.toString() === ethers.parseEther("15").toString() &&
            payout.toString() === ethers.parseEther("15").toString()) {
            console.log("\n✅ All amounts are correct! (5 SHM premium, 15 SHM coverage/payout)");
        } else {
            console.log("\n⚠️  Warning: Amounts don't match expected values!");
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
                coverageDuration: "24 hours"
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
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Suggestion: You may need more SHM tokens.");
            console.log("   Current balance:", ethers.formatEther(balance), currencySymbol);
            console.log("   Try getting more from Shardeum faucet.");
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

