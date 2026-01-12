const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("💰 FUNDING CLAIMPAYOUT CONTRACT");
    console.log("=".repeat(60) + "\n");

    const CLAIM_PAYOUT_ADDRESS = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";

    const [deployer] = await ethers.getSigners();
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";

    console.log("📝 Account:", deployer.address);
    console.log("🌐 Network:", hre.network.name);
    console.log("💰 Current Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), currencySymbol);

    // Get contract instance
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT_ADDRESS);

    // Check current contract balance
    const currentBalance = await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS);
    console.log("\n📊 ClaimPayout Contract:");
    console.log("   Address:", CLAIM_PAYOUT_ADDRESS);
    console.log("   Current Balance:", ethers.formatEther(currentBalance), currencySymbol);
    console.log("   Payout Amount:", ethers.formatEther(await claimPayout.PAYOUT_AMOUNT()), currencySymbol);

    // Get funding amount from environment or use default
    const fundingAmountEnv = process.env.ADDITIONAL_FUNDING || "400";
    const fundingAmount = ethers.parseEther(fundingAmountEnv);

    console.log("\n💸 Funding Details:");
    console.log("   Amount to Add:", ethers.formatEther(fundingAmount), currencySymbol);
    console.log("   New Balance:", ethers.formatEther(currentBalance + fundingAmount), currencySymbol);

    const payoutAmount = await claimPayout.PAYOUT_AMOUNT();
    const claimsAfterFunding = (currentBalance + fundingAmount) / payoutAmount;
    console.log("   Claims Possible:", Math.floor(Number(claimsAfterFunding.toString())), "claims");

    // Check if sender has enough balance
    const senderBalance = await ethers.provider.getBalance(deployer.address);
    if (senderBalance < fundingAmount) {
        console.log("\n❌ ERROR: Insufficient balance!");
        console.log("   Your Balance:", ethers.formatEther(senderBalance), currencySymbol);
        console.log("   Required:", ethers.formatEther(fundingAmount), currencySymbol);
        console.log("\n💡 Tip: Set ADDITIONAL_FUNDING env var to a lower amount");
        process.exit(1);
    }

    console.log("\n🚀 Sending funds...");
    const tx = await claimPayout.fundContract({ value: fundingAmount });
    console.log("   Transaction Hash:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    await tx.wait();

    // Check new balance
    const newBalance = await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS);
    const newSenderBalance = await ethers.provider.getBalance(deployer.address);

    console.log("\n" + "=".repeat(60));
    console.log("✅ FUNDING SUCCESSFUL!");
    console.log("=".repeat(60));

    console.log("\n📊 Updated Balances:");
    console.log("   ClaimPayout Contract:", ethers.formatEther(newBalance), currencySymbol);
    console.log("   Your Account:", ethers.formatEther(newSenderBalance), currencySymbol);
    console.log("   Claims Now Possible:", Math.floor(Number(newBalance / payoutAmount)), "claims");

    console.log("\n🔗 View Transaction:");
    console.log("https://explorer-mezame.shardeum.org/tx/" + tx.hash);
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Funding failed:");
        console.error(error);
        process.exit(1);
    });
