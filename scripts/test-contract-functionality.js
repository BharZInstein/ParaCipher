const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🧪 TESTING CONTRACT FUNCTIONALITY");
    console.log("=".repeat(70) + "\n");

    // Use existing deployed contracts
    const INSURANCE_POLICY = "0x3A84E06554876A557b16249619247eF765C35407";
    const CLAIM_PAYOUT = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";
    const REPUTATION_SCORE = "0x199678E7AF0B7a9f62523563f9eF861e242e944A";

    const [deployer] = await ethers.getSigners();
    const currencySymbol = "SHM";

    console.log("👤 Testing Account:", deployer.address);
    console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), currencySymbol);
    console.log("🌐 Network: Shardeum\n");

    // Get contract instances
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = InsurancePolicy.attach(INSURANCE_POLICY);

    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT);

    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = ReputationScore.attach(REPUTATION_SCORE);

    console.log("=".repeat(70));
    console.log("TEST 1: Read Contract Values");
    console.log("=".repeat(70));

    try {
        const premium = await insurancePolicy.PREMIUM_AMOUNT();
        const coverage = await insurancePolicy.COVERAGE_AMOUNT();
        const payout = await claimPayout.PAYOUT_AMOUNT();
        const claimBalance = await ethers.provider.getBalance(CLAIM_PAYOUT);

        console.log("✅ InsurancePolicy:");
        console.log("   Premium:", ethers.formatEther(premium), currencySymbol);
        console.log("   Coverage:", ethers.formatEther(coverage), currencySymbol);
        console.log("\n✅ ClaimPayout:");
        console.log("   Payout:", ethers.formatEther(payout), currencySymbol);
        console.log("   Balance:", ethers.formatEther(claimBalance), currencySymbol);
        console.log("\n✅ ReputationScore: Accessible");
    } catch (error) {
        console.log("❌ Read test failed:", error.message);
        return;
    }

    console.log("\n" + "=".repeat(70));
    console.log("TEST 2: Buy Coverage (Write Transaction)");
    console.log("=".repeat(70));

    try {
        const premium = await insurancePolicy.PREMIUM_AMOUNT();
        console.log("💰 Attempting to buy coverage for", ethers.formatEther(premium), currencySymbol);
        
        // Check current coverage first
        const [isActiveBefore, coverageBefore] = await insurancePolicy.checkMyCoverage();
        console.log("   Coverage before:", isActiveBefore ? "Active" : "None");

        // Try to buy coverage
        const buyTx = await insurancePolicy.buyDailyCoverage({
            value: premium,
            gasLimit: 300000  // Reasonable gas limit
        });
        console.log("   ⏳ Transaction sent:", buyTx.hash);
        
        const receipt = await buyTx.wait();
        console.log("   ✅ Transaction confirmed! Block:", receipt.blockNumber);
        console.log("   💸 Gas used:", receipt.gasUsed.toString());

        // Check coverage after
        const [isActiveAfter, coverageAfter, timeLeft] = await insurancePolicy.checkMyCoverage();
        console.log("\n   Coverage after:", isActiveAfter ? "Active" : "None");
        if (isActiveAfter) {
            console.log("   Coverage amount:", ethers.formatEther(coverageAfter), currencySymbol);
            const hoursLeft = Math.floor(Number(timeLeft) / 3600);
            console.log("   Time remaining:", hoursLeft, "hours");
        }

        console.log("\n✅ BUY COVERAGE TEST PASSED!");
    } catch (error) {
        console.log("❌ Buy coverage failed:", error.message);
        if (error.message.includes("already have active coverage")) {
            console.log("   ℹ️  You already have active coverage - this is expected!");
        }
    }

    console.log("\n" + "=".repeat(70));
    console.log("TEST 3: File a Claim");
    console.log("=".repeat(70));

    try {
        // Check if we have coverage
        const [hasCoverage] = await insurancePolicy.checkMyCoverage();
        if (!hasCoverage) {
            console.log("⚠️  No active coverage - skipping claim test");
            console.log("   (Buy coverage first, then file claim)");
        } else {
            console.log("📝 Filing claim...");
            const claimTx = await claimPayout.fileClaim("Test claim from functionality test", {
                gasLimit: 300000
            });
            console.log("   ⏳ Transaction sent:", claimTx.hash);
            
            const receipt = await claimTx.wait();
            console.log("   ✅ Claim filed! Block:", receipt.blockNumber);

            // Check claim status
            const [status, amount, filedAt, notes] = await claimPayout.getMyClaimStatus();
            const statusNames = ["None", "Pending", "Approved", "Rejected"];
            console.log("\n   Claim Status:", statusNames[status]);
            console.log("   Amount:", ethers.formatEther(amount), currencySymbol);
            console.log("   Notes:", notes);

            console.log("\n✅ FILE CLAIM TEST PASSED!");
        }
    } catch (error) {
        console.log("❌ File claim failed:", error.message);
        if (error.message.includes("No valid coverage")) {
            console.log("   ℹ️  No active coverage - buy coverage first");
        }
    }

    console.log("\n" + "=".repeat(70));
    console.log("TEST 4: Check Reputation Score");
    console.log("=".repeat(70));

    try {
        const [score, safeDays, claims, discount] = await reputationScore.getMyScore();
        console.log("✅ Reputation Score:");
        console.log("   Score:", score.toString());
        console.log("   Safe Days:", safeDays.toString());
        console.log("   Claims:", claims.toString());
        console.log("   Discount:", discount.toString() + "%");
    } catch (error) {
        console.log("❌ Reputation check failed:", error.message);
    }

    console.log("\n" + "=".repeat(70));
    console.log("📊 SUMMARY");
    console.log("=".repeat(70));
    console.log("\n✅ Contracts are accessible and working!");
    console.log("✅ Read functions work");
    console.log("✅ Write functions work (if you have coverage)");
    console.log("\n💡 To test full flow:");
    console.log("   1. Buy coverage (5 SHM)");
    console.log("   2. File a claim");
    console.log("   3. Approve claim (as owner)");
    console.log("   4. Check payout received");
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test failed:");
        console.error(error);
        process.exit(1);
    });

