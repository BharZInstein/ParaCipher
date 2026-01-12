const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("🎯 HACKATHON DEMO TEST - ParaCipher");
    console.log("=".repeat(70) + "\n");

    // Contract addresses
    const INSURANCE_POLICY = "0x3A84E06554876A557b16249619247eF765C35407";
    const CLAIM_PAYOUT = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";

    const [owner] = await ethers.getSigners();
    const currencySymbol = "SHM";

    console.log("👤 Your Account:", owner.address);
    console.log("💰 Your Balance:", ethers.formatEther(await ethers.provider.getBalance(owner.address)), currencySymbol);
    console.log("");

    // Get contract instances
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = InsurancePolicy.attach(INSURANCE_POLICY);

    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT);

    // Check contract status
    console.log("📊 Contract Status:");
    console.log("   Premium Amount:", ethers.formatEther(await insurancePolicy.PREMIUM_AMOUNT()), currencySymbol);
    console.log("   Payout Amount:", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), currencySymbol);
    console.log("   ClaimPayout Balance:", ethers.formatEther(await ethers.provider.getBalance(CLAIM_PAYOUT)), currencySymbol);
    console.log("");

    // STEP 1: Buy Coverage
    console.log("📋 [STEP 1] Buying Coverage...");
    try {
        const premiumAmount = await insurancePolicy.PREMIUM_AMOUNT();
        const buyTx = await insurancePolicy.buyDailyCoverage({ value: premiumAmount });
        console.log("   ⏳ Transaction:", buyTx.hash);
        await buyTx.wait();
        console.log("   ✅ Coverage purchased for 5 SHM!");
    } catch (error) {
        console.log("   ⚠️ ", error.message.split('\n')[0]);
    }
    console.log("");

    // STEP 2: Check Coverage
    console.log("📋 [STEP 2] Checking Coverage...");
    const [isActive, coverageAmount, timeRemaining] = await insurancePolicy.checkMyCoverage();
    if (isActive) {
        const hoursLeft = Math.floor(Number(timeRemaining) / 3600);
        console.log("   ✅ Coverage Active:", ethers.formatEther(coverageAmount), currencySymbol);
        console.log("   ⏰ Time Remaining:", hoursLeft, "hours", Math.floor(Number(timeRemaining) % 3600 / 60), "minutes");
    } else {
        console.log("   ❌ No active coverage");
    }
    console.log("");

    // STEP 3: File Claim
    console.log("📋 [STEP 3] Filing Claim...");
    try {
        const claimTx = await claimPayout.fileClaim("Demo: Had accident while delivering food");
        console.log("   ⏳ Transaction:", claimTx.hash);
        await claimTx.wait();
        console.log("   ✅ Claim filed successfully!");
    } catch (error) {
        console.log("   ⚠️ ", error.message.split('\n')[0]);
    }
    console.log("");

    // STEP 4: Check Claim Status
    console.log("📋 [STEP 4] Checking Claim Status...");
    const [status, amount, filedAt, notes] = await claimPayout.getMyClaimStatus();
    const statusNames = ["None", "Pending", "Approved", "Rejected"];
    console.log("   Status:", statusNames[status]);
    if (status > 0) {
        console.log("   Amount:", ethers.formatEther(amount), currencySymbol);
        console.log("   Notes:", notes);
    }
    console.log("");

    // STEP 5: Approve Claim (as owner)
    if (status === 1) { // If pending
        console.log("📋 [STEP 5] Approving Claim (as owner)...");
        try {
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            const approveTx = await claimPayout.approveClaim(owner.address);
            console.log("   ⏳ Transaction:", approveTx.hash);
            await approveTx.wait();
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            console.log("   ✅ Claim approved! Payout sent!");
            console.log("   💰 Received:", ethers.formatEther(balanceAfter - balanceBefore + ethers.parseEther("0.01")), currencySymbol, "(approx, minus gas)");
        } catch (error) {
            console.log("   ⚠️ ", error.message.split('\n')[0]);
        }
    }
    console.log("");

    // Final Status
    console.log("=".repeat(70));
    console.log("🎉 DEMO TEST COMPLETE!");
    console.log("=".repeat(70));
    console.log("\n💡 For your mobile app, use the code in HACKATHON_GUIDE.md");
    console.log("🔗 View transactions: https://explorer-mezame.shardeum.org\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test failed:");
        console.error(error);
        process.exit(1);
    });
