const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🚀 PARACIPHER DEPLOYMENT - Direct Transaction Method");
    console.log("=".repeat(70) + "\n");

    const [deployer] = await ethers.getSigners();
    const currencySymbol = "SHM";
    
    console.log("📝 Deploying from:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), currencySymbol);
    console.log("🌐 Network: Shardeum\n");

    // Try with very low gas limit - Shardeum might accept it
    const gasLimit = 800000; // 800k gas
    
    let insurancePolicy, claimPayout, reputationScore;
    let insurancePolicyAddress, claimPayoutAddress, reputationScoreAddress;

    try {
        // ========== STEP 1: Deploy InsurancePolicy ==========
        console.log("📋 [1/5] Deploying InsurancePolicy...");
        console.log("   Using gas limit:", gasLimit);
        
        const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
        const insurancePolicyBytecode = InsurancePolicy.bytecode;
        
        // Try deploying with explicit gas limit
        const deployTx1 = await deployer.sendTransaction({
            data: insurancePolicyBytecode,
            gasLimit: gasLimit
        });
        
        console.log("   ⏳ Transaction sent:", deployTx1.hash);
        const receipt1 = await deployTx1.wait();
        insurancePolicyAddress = receipt1.contractAddress;
        
        if (!insurancePolicyAddress) {
            throw new Error("Contract address not found in receipt");
        }
        
        insurancePolicy = InsurancePolicy.attach(insurancePolicyAddress);
        console.log("✅ InsurancePolicy:", insurancePolicyAddress);

        // ========== STEP 2: Deploy ClaimPayout ==========
        console.log("\n📋 [2/5] Deploying ClaimPayout...");
        const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
        const claimPayoutBytecode = ClaimPayout.bytecode;
        const claimPayoutInterface = new ethers.Interface(ClaimPayout.abi);
        const encodedConstructor = claimPayoutInterface.encodeDeploy([insurancePolicyAddress]);
        
        const deployTx2 = await deployer.sendTransaction({
            data: claimPayoutBytecode + encodedConstructor.slice(2),
            gasLimit: gasLimit
        });
        
        console.log("   ⏳ Transaction sent:", deployTx2.hash);
        const receipt2 = await deployTx2.wait();
        claimPayoutAddress = receipt2.contractAddress;
        
        if (!claimPayoutAddress) {
            throw new Error("Contract address not found in receipt");
        }
        
        claimPayout = ClaimPayout.attach(claimPayoutAddress);
        console.log("✅ ClaimPayout:", claimPayoutAddress);

        // ========== STEP 3: Deploy ReputationScore ==========
        console.log("\n📋 [3/5] Deploying ReputationScore...");
        const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
        const reputationScoreBytecode = ReputationScore.bytecode;
        
        const deployTx3 = await deployer.sendTransaction({
            data: reputationScoreBytecode,
            gasLimit: gasLimit
        });
        
        console.log("   ⏳ Transaction sent:", deployTx3.hash);
        const receipt3 = await deployTx3.wait();
        reputationScoreAddress = receipt3.contractAddress;
        
        if (!reputationScoreAddress) {
            throw new Error("Contract address not found in receipt");
        }
        
        reputationScore = ReputationScore.attach(reputationScoreAddress);
        console.log("✅ ReputationScore:", reputationScoreAddress);

        // ========== STEP 4: Connect Contracts ==========
        console.log("\n🔗 [4/5] Connecting contracts...");
        const linkTx = await claimPayout.setReputationContract(reputationScoreAddress, {
            gasLimit: 150000
        });
        await linkTx.wait();
        console.log("✅ Contracts linked!");

        // ========== STEP 5: Fund ClaimPayout ==========
        console.log("\n💰 [5/5] Funding ClaimPayout...");
        const fundingAmount = ethers.parseEther("50");
        const fundTx = await claimPayout.fundContract({
            value: fundingAmount,
            gasLimit: 150000
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

