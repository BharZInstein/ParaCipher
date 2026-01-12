const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("💸 EMERGENCY WITHDRAW FROM CLAIMPAYOUT");
    console.log("=".repeat(60) + "\n");

    const CLAIM_PAYOUT_ADDRESS = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";

    const [deployer] = await ethers.getSigners();
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";

    console.log("📝 Account:", deployer.address);
    console.log("🌐 Network:", hre.network.name);

    // Get contract instance
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT_ADDRESS);

    // Check current balances
    const contractBalance = await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS);
    const yourBalance = await ethers.provider.getBalance(deployer.address);

    console.log("\n📊 Current Balances:");
    console.log("   Your Wallet:", ethers.formatEther(yourBalance), currencySymbol);
    console.log("   ClaimPayout Contract:", ethers.formatEther(contractBalance), currencySymbol);

    if (contractBalance === 0n) {
        console.log("\n❌ Contract balance is 0, nothing to withdraw!");
        process.exit(0);
    }

    console.log("\n🚀 Withdrawing all funds...");
    const tx = await claimPayout.emergencyWithdraw();
    console.log("   Transaction Hash:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    await tx.wait();

    // Check new balances
    const newContractBalance = await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS);
    const newYourBalance = await ethers.provider.getBalance(deployer.address);

    console.log("\n" + "=".repeat(60));
    console.log("✅ WITHDRAWAL SUCCESSFUL!");
    console.log("=".repeat(60));

    console.log("\n📊 New Balances:");
    console.log("   Your Wallet:", ethers.formatEther(newYourBalance), currencySymbol);
    console.log("   ClaimPayout Contract:", ethers.formatEther(newContractBalance), currencySymbol);
    console.log("\n💰 You recovered:", ethers.formatEther(contractBalance), currencySymbol);

    console.log("\n🔗 View Transaction:");
    console.log("https://explorer-mezame.shardeum.org/tx/" + tx.hash);
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Withdrawal failed:");
        console.error(error);
        process.exit(1);
    });
