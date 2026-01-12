const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🧪 PARACIPHER END-TO-END TEST FLOW");
    console.log("=".repeat(70) + "\n");

    // Get signers (on remote networks you may only have 1)
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
        throw new Error("No signers available. Check your private key configuration.");
    }
    const owner = signers[0];
    const worker1 = signers[1] || owner;
    const worker2 = signers[2] || owner;

    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";

    console.log("👤 Owner:", owner.address);
    console.log("👤 Worker 1 (Rajesh):", worker1.address, worker1 === owner ? "(same as owner)" : "");
    console.log("👤 Worker 2 (Priya):", worker2.address, worker2 === owner ? "(same as owner)" : "");

    console.log("\n📋 Deploying contracts...\n");

    // Deploy contracts
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = await InsurancePolicy.deploy();
    await insurancePolicy.waitForDeployment();
    console.log("✅ InsurancePolicy:", await insurancePolicy.getAddress());

    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());
    await claimPayout.waitForDeployment();
    console.log("✅ ClaimPayout:", await claimPayout.getAddress());

    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = await ReputationScore.deploy();
    await reputationScore.waitForDeployment();
    console.log("✅ ReputationScore:", await reputationScore.getAddress());

    // Connect contracts
    await claimPayout.setReputationContract(await reputationScore.getAddress());
    console.log("🔗 Contracts linked");

    // Determine payout amount and ensure we have enough balance to fund
    const payoutAmount = await claimPayout.PAYOUT_AMOUNT();
    const fundingAmountEnv = process.env.TEST_FUNDING_AMOUNT || null;
    const fundingAmount = fundingAmountEnv
        ? ethers.parseEther(fundingAmountEnv)
        : payoutAmount; // fund with at least payout amount

    if (fundingAmount < payoutAmount) {
        throw new Error(
            `TEST_FUNDING_AMOUNT (${ethers.formatEther(fundingAmount)} ${currencySymbol}) is below payout amount ` +
            `${ethers.formatEther(payoutAmount)} ${currencySymbol}. Increase TEST_FUNDING_AMOUNT or top up balance.`
        );
    }

    const deployerBalance = await ethers.provider.getBalance(owner.address);

    console.log("💰 Funding plan:");
    console.log("   • Payout amount needed:", ethers.formatEther(payoutAmount), currencySymbol);
    console.log("   • Planned funding:     ", ethers.formatEther(fundingAmount), currencySymbol);
    console.log("   • Deployer balance:    ", ethers.formatEther(deployerBalance), currencySymbol);

    if (deployerBalance < fundingAmount) {
        throw new Error(
            `Insufficient balance to fund ClaimPayout. Need ${ethers.formatEther(fundingAmount)} ${currencySymbol}, ` +
            `have ${ethers.formatEther(deployerBalance)} ${currencySymbol}. ` +
            `Set TEST_FUNDING_AMOUNT to a lower value or top up your account.`
        );
    }

    await claimPayout.fundContract({ value: fundingAmount });
    console.log(`💰 ClaimPayout funded with ${ethers.formatEther(fundingAmount)} ${currencySymbol}\n`);

    console.log("=".repeat(70));
    console.log("📖 SCENARIO: Rajesh's Insurance Journey");
    console.log("=".repeat(70) + "\n");

    // ========== DAY 1 MORNING: Buy Coverage ==========
    console.log("☀️  DAY 1 - 8:00 AM - Rajesh starts his first day");
    console.log("-".repeat(70));

    console.log("\n1️⃣  Rajesh buys daily coverage (25 MATIC)...");
    const buyTx1 = await insurancePolicy.connect(worker1).buyDailyCoverage({
        value: ethers.parseEther("25")
    });
    await buyTx1.wait();
    console.log("   ✅ Coverage purchased!");

    // Check coverage
    const [isActive1, coverage1, timeLeft1] = await insurancePolicy.connect(worker1).checkMyCoverage();
    console.log("\n   📊 Coverage Status:");
    console.log("      • Active:", isActive1);
    console.log("      • Coverage Amount:", ethers.formatEther(coverage1), "MATIC");
    console.log("      • Time Remaining:", Math.floor(Number(timeLeft1) / 3600), "hours");

    // Check reputation (should be default 100)
    const [score1, safeDays1, claims1, discount1] = await reputationScore.connect(worker1).getMyScore();
    console.log("\n   🏆 Reputation Status:");
    console.log("      • Score:", score1.toString());
    console.log("      • Safe Days:", safeDays1.toString());
    console.log("      • Claims:", claims1.toString());
    console.log("      • Discount:", discount1.toString() + "%");

    // ========== DAY 1 EVENING: Safe Day ==========
    console.log("\n\n🌙 DAY 1 - 8:00 PM - Rajesh completes a safe day");
    console.log("-".repeat(70));

    console.log("\n2️⃣  Owner rewards Rajesh for safe driving (+5 points)...");
    const safeDayTx1 = await reputationScore.connect(owner).addSafeDay(worker1.address);
    await safeDayTx1.wait();
    console.log("   ✅ Safe day bonus added!");

    const [score2] = await reputationScore.connect(worker1).getMyScore();
    console.log("\n   🏆 New Reputation Score:", score2.toString(), "(+5)");

    // ========== DAY 2 MORNING: Accident Happens! ==========
    console.log("\n\n⚠️  DAY 2 - 9:00 AM - ACCIDENT OCCURS");
    console.log("-".repeat(70));

    console.log("\n3️⃣  Rajesh renews coverage for day 2...");
    const buyTx2 = await insurancePolicy.connect(worker1).buyDailyCoverage({
        value: ethers.parseEther("25")
    });
    await buyTx2.wait();
    console.log("   ✅ Coverage renewed");

    console.log("\n4️⃣  Rajesh has an accident and files a claim...");
    const claimTx = await claimPayout.connect(worker1).fileClaim(
        "Two-wheeler accident on MG Road, Bangalore. Broken arm, hospitalized."
    );
    await claimTx.wait();
    console.log("   ✅ Claim filed!");

    // Check claim status
    const [claimStatus, requestedAmount, filedAt, notes] = await claimPayout.connect(worker1).getMyClaimStatus();
    console.log("\n   📋 Claim Status:");
    console.log("      • Status:", ["None", "Pending", "Approved", "Rejected"][claimStatus]);
    console.log("      • Requested Amount:", ethers.formatEther(requestedAmount), "MATIC");
    console.log("      • Notes:", notes);

    // ========== DAY 2 AFTERNOON: Claim Approved ==========
    console.log("\n\n✅ DAY 2 - 2:00 PM - Owner verifies and approves claim");
    console.log("-".repeat(70));

    console.log("\n5️⃣  Owner approves Rajesh's claim...");

    // Check balance before
    const balanceBefore = await ethers.provider.getBalance(worker1.address);
    console.log("   💰 Rajesh's balance before:", ethers.formatEther(balanceBefore), "MATIC");

    const approveTx = await claimPayout.connect(owner).approveClaim(worker1.address);
    await approveTx.wait();
    console.log("   ✅ Claim approved and payout sent!");

    // Check balance after
    const balanceAfter = await ethers.provider.getBalance(worker1.address);
    const payoutReceived = balanceAfter - balanceBefore;
    console.log("   💰 Rajesh's balance after:", ethers.formatEther(balanceAfter), "MATIC");
    console.log("   💸 Payout received:", ethers.formatEther(payoutReceived), "MATIC");

    // Check updated reputation
    const [score3, , claims2] = await reputationScore.connect(worker1).getMyScore();
    console.log("\n   🏆 Updated Reputation:");
    console.log("      • Score:", score3.toString(), "(-20 penalty)");
    console.log("      • Total Claims:", claims2.toString());

    // Check contract stats
    const totalClaims = await claimPayout.totalClaimsProcessed();
    const totalPaid = await claimPayout.totalClaimsPaid();
    console.log("\n   📊 System Stats:");
    console.log("      • Total Claims Processed:", totalClaims.toString());
    console.log("      • Total Payouts:", ethers.formatEther(totalPaid), "MATIC");

    // ========== DAY 10: Return to Work ==========
    console.log("\n\n🏥 DAY 10 - Rajesh recovers and returns to work");
    console.log("-".repeat(70));

    console.log("\n6️⃣  Owner rewards 7 safe days while Rajesh was recovering...");
    for (let i = 0; i < 7; i++) {
        await reputationScore.connect(owner).addSafeDay(worker1.address);
    }
    console.log("   ✅ 7 safe days added (+35 points)");

    const [score4, safeDays4, , discount4] = await reputationScore.connect(worker1).getMyScore();
    console.log("\n   🏆 Current Reputation:");
    console.log("      • Score:", score4.toString());
    console.log("      • Safe Days:", safeDays4.toString());
    console.log("      • Discount Eligible:", discount4.toString() + "%");

    // Calculate discounted premium
    if (discount4 > 0) {
        const basePremium = ethers.parseEther("25");
        const discountedPremium = await reputationScore.getDiscountedPremium(worker1.address, basePremium);
        console.log("\n   💰 Premium Pricing:");
        console.log("      • Standard Premium:", ethers.formatEther(basePremium), "MATIC");
        console.log("      • Discounted Premium:", ethers.formatEther(discountedPremium), "MATIC");
        console.log("      • Savings:", ethers.formatEther(basePremium - discountedPremium), "MATIC per day! 🎉");
    }

    // ========== BONUS: Worker 2 Test ==========
    console.log("\n\n" + "=".repeat(70));
    console.log("👤 BONUS TEST: Priya (Safe Driver)");
    console.log("=".repeat(70) + "\n");

    console.log("7️⃣  Priya buys coverage and completes 10 safe days...");
    await insurancePolicy.connect(worker2).buyDailyCoverage({
        value: ethers.parseEther("25")
    });

    // Add 10 safe days
    for (let i = 0; i < 10; i++) {
        await reputationScore.connect(owner).addSafeDay(worker2.address);
    }

    const [scoreP, safeDaysP, claimsP, discountP] = await reputationScore.connect(worker2).getMyScore();
    console.log("\n   🏆 Priya's Reputation (Perfect Record):");
    console.log("      • Score:", scoreP.toString());
    console.log("      • Safe Days:", safeDaysP.toString());
    console.log("      • Claims:", claimsP.toString());
    console.log("      • Discount:", discountP.toString() + "%");

    // ========== FINAL SUMMARY ==========
    console.log("\n\n" + "=".repeat(70));
    console.log("📊 FINAL SYSTEM SUMMARY");
    console.log("=".repeat(70) + "\n");

    const totalPremiums = await insurancePolicy.totalPremiumsCollected();
    const totalClaimsPaid = await claimPayout.totalClaimsPaid();
    const claimBalance = await ethers.provider.getBalance(await claimPayout.getAddress());

    console.log("💰 Financial Stats:");
    console.log("   • Total Premiums Collected:", ethers.formatEther(totalPremiums), "MATIC");
    console.log("   • Total Claims Paid:", ethers.formatEther(totalClaimsPaid), "MATIC");
    console.log("   • ClaimPayout Balance:", ethers.formatEther(claimBalance), "MATIC");
    console.log("   • Net Position:", ethers.formatEther(totalPremiums - totalClaimsPaid), "MATIC");

    console.log("\n👥 Worker Stats:");
    console.log("   Rajesh: Score", score4.toString(), "| Safe Days:", safeDays4.toString(), "| Claims: 1 | Discount:", discount4.toString() + "%");
    console.log("   Priya:  Score", scoreP.toString(), "| Safe Days:", safeDaysP.toString(), "| Claims: 0 | Discount:", discountP.toString() + "%");

    console.log("\n\n✨ TEST COMPLETE!");
    console.log("=".repeat(70) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test failed:");
        console.error(error);
        process.exit(1);
    });
