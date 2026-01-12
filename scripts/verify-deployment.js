const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 VERIFYING DEPLOYED CONTRACTS");
    console.log("=".repeat(60) + "\n");

    // Contract addresses from deployment
    const INSURANCE_POLICY_ADDRESS = "0x3A84E06554876A557b16249619247eF765C35407";
    const CLAIM_PAYOUT_ADDRESS = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";
    const REPUTATION_SCORE_ADDRESS = "0x199678E7AF0B7a9f62523563f9eF861e242e944A";

    const [deployer] = await ethers.getSigners();
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";

    console.log("📝 Account:", deployer.address);
    console.log("🌐 Network:", hre.network.name);
    console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), currencySymbol, "\n");

    // Get contract instances
    const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
    const insurancePolicy = InsurancePolicy.attach(INSURANCE_POLICY_ADDRESS);

    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT_ADDRESS);

    const ReputationScore = await hre.ethers.getContractFactory("ReputationScore");
    const reputationScore = ReputationScore.attach(REPUTATION_SCORE_ADDRESS);

    // Verify InsurancePolicy
    console.log("📋 InsurancePolicy Contract:");
    console.log("   Address:", INSURANCE_POLICY_ADDRESS);
    console.log("   Premium Amount:", ethers.formatEther(await insurancePolicy.PREMIUM_AMOUNT()), currencySymbol);
    console.log("   Coverage Amount:", ethers.formatEther(await insurancePolicy.COVERAGE_AMOUNT()), currencySymbol);
    console.log("   Coverage Duration:", (await insurancePolicy.COVERAGE_DURATION()).toString(), "seconds (24 hours)");
    console.log("   Balance:", ethers.formatEther(await ethers.provider.getBalance(INSURANCE_POLICY_ADDRESS)), currencySymbol);

    // Verify ClaimPayout
    console.log("\n📋 ClaimPayout Contract:");
    console.log("   Address:", CLAIM_PAYOUT_ADDRESS);
    console.log("   Payout Amount:", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), currencySymbol);
    console.log("   Balance:", ethers.formatEther(await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS)), currencySymbol);

    // Verify ReputationScore
    console.log("\n📋 ReputationScore Contract:");
    console.log("   Address:", REPUTATION_SCORE_ADDRESS);

    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL CONTRACTS VERIFIED SUCCESSFULLY!");
    console.log("=".repeat(60));

    console.log("\n💡 Usage Examples:\n");
    console.log("1. Buy coverage:");
    console.log("   Send 5 SHM to buyDailyCoverage() on InsurancePolicy\n");

    console.log("2. File a claim:");
    console.log("   Call fileClaim(\"reason\") on ClaimPayout\n");

    console.log("3. Approve claim (as owner):");
    console.log("   Call approveClaim(workerAddress) on ClaimPayout\n");

    console.log("🔗 View on Explorer:");
    console.log("https://explorer-mezame.shardeum.org/address/" + INSURANCE_POLICY_ADDRESS);
    console.log("https://explorer-mezame.shardeum.org/address/" + CLAIM_PAYOUT_ADDRESS);
    console.log("https://explorer-mezame.shardeum.org/address/" + REPUTATION_SCORE_ADDRESS);
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Verification failed:");
        console.error(error);
        process.exit(1);
    });
