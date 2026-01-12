const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
        console.error("❌ No signers found! Check your private key in .env file");
        console.error("   Make sure SHARDEUM_PRIVATE_KEY is set correctly");
        process.exit(1);
    }
    
    const deployer = signers[0];
    const currencySymbol = hre.network.name === "shardeum" ? "SHM" : "MATIC";
    
    console.log("\n" + "=".repeat(60));
    console.log("💰 WALLET BALANCE CHECK");
    console.log("=".repeat(60) + "\n");
    
    console.log("Network:", hre.network.name);
    console.log("Account:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceFormatted = ethers.formatEther(balance);
    
    console.log("Balance:", balanceFormatted, currencySymbol);
    
    // Estimate deployment costs
    console.log("\n📊 Estimated Costs:");
    console.log("   Contract Deployments: ~30", currencySymbol);
    console.log("   Contract Linking: ~2", currencySymbol);
    console.log("   Funding ClaimPayout: ~100", currencySymbol, "(configurable)");
    console.log("   Total Estimated: ~132", currencySymbol);
    
    if (parseFloat(balanceFormatted) < 150) {
        console.log("\n⚠️  Warning: Balance might be insufficient for deployment!");
    } else {
        console.log("\n✅ Balance looks good for deployment!");
    }
    
    console.log("\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Error:", error);
        process.exit(1);
    });

