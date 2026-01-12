const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const CLAIM_PAYOUT_ADDRESS = "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D";
    const FUNDING_AMOUNT = "200"; // 200 SHM for testing

    console.log("\n💰 Funding ClaimPayout with", FUNDING_AMOUNT, "SHM for hackathon demo...\n");

    const [deployer] = await ethers.getSigners();
    const ClaimPayout = await hre.ethers.getContractFactory("ClaimPayout");
    const claimPayout = ClaimPayout.attach(CLAIM_PAYOUT_ADDRESS);

    const tx = await claimPayout.fundContract({
        value: ethers.parseEther(FUNDING_AMOUNT)
    });

    console.log("⏳ Transaction:", tx.hash);
    await tx.wait();

    const balance = await ethers.provider.getBalance(CLAIM_PAYOUT_ADDRESS);
    console.log("✅ Contract Balance:", ethers.formatEther(balance), "SHM");
    console.log("🎯 Can handle", Math.floor(Number(balance / ethers.parseEther("150"))), "claims\n");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
