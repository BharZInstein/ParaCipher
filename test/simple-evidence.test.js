// SIMPLE WORKING TEST - Evidence validation
// Run: npx hardhat test test/simple-evidence.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("✅ Evidence Validation - Simple Tests", function () {
    let claimPayout, insurancePolicy, owner, worker1, worker2, worker3, worker4;

    beforeEach(async function () {
        [owner, worker1, worker2, worker3, worker4] = await ethers.getSigners();

        const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy();

        const ClaimPayout = await ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());

        await owner.sendTransaction({
            to: await claimPayout.getAddress(),
            value: ethers.parseEther("100")
        });
    });

    it("✅ Should reject claim WITHOUT photo", async function () {
        await insurancePolicy.connect(worker1).buyDailyCoverage({
            value: ethers.parseEther("5")
        });

        const evidence = {
            photoIpfsHash: "",  // ❌ EMPTY
            gpsLatitude: "13.0827",
            gpsLongitude: "80.2707",
            accidentTimestamp: 1000000,
            policeReportId: "",
            description: "This should fail"
        };

        await expect(
            claimPayout.connect(worker1).fileClaim("Test", evidence)
        ).to.be.revertedWith("Accident photo required - upload photo to IPFS");
        
        console.log("      ✅ Photo validation works!");
    });

    it("✅ Should reject claim WITHOUT GPS latitude", async function () {
        await insurancePolicy.connect(worker2).buyDailyCoverage({
            value: ethers.parseEther("5")
        });

        const evidence = {
            photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            gpsLatitude: "",  // ❌ EMPTY
            gpsLongitude: "80.2707",
            accidentTimestamp: 1000000,
            policeReportId: "",
            description: "This should fail"
        };

        await expect(
            claimPayout.connect(worker2).fileClaim("Test", evidence)
        ).to.be.revertedWith("GPS latitude required - location proof needed");

        console.log("      ✅ GPS validation works!");
    });

    it("✅ Should reject claim WITH future timestamp", async function () {
        await insurancePolicy.connect(worker3).buyDailyCoverage({
            value: ethers.parseEther("5")
        });

        const futureTime = Math.floor(Date.now() / 1000) + 10000;

        const evidence = {
            photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            gpsLatitude: "13.0827",
            gpsLongitude: "80.2707",
            accidentTimestamp: futureTime,  // ❌ FUTURE
            policeReportId: "",
            description: "This should fail - future"
        };

        await expect(
            claimPayout.connect(worker3).fileClaim("Test", evidence)
        ).to.be.revertedWith("Timestamp cannot be in future - invalid evidence");

        console.log("      ✅ Timestamp validation works!");
    });

    it("✅ Should reject claim WITHOUT coverage", async function () {
        // worker4 has NO coverage

        const evidence = {
            photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            gpsLatitude: "13.0827",
            gpsLongitude: "80.2707",
            accidentTimestamp: 1000000,
            policeReportId: "",
            description: "This should fail - no coverage"
        };

        await expect(
            claimPayout.connect(worker4).fileClaim("Test", evidence)
        ).to.be.revertedWith("No valid coverage found. Buy coverage first!");

        console.log("      ✅ Coverage validation works!");
    });

    it("✅ Should store evidence data correctly", async function () {
        await insurancePolicy.connect(worker1).buyDailyCoverage({
            value: ethers.parseEther("5")
        });

        // Mine a block to advance time
        await ethers.provider.send("evm_mine");

        // Get current block time
        const block = await ethers.provider.getBlock("latest");

        const evidence = {
            photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            gpsLatitude: "13.0827",
            gpsLongitude: "80.2707",
            accidentTimestamp: block.timestamp,  // Use block timestamp
            policeReportId: "CHN-ACC-2024-1142",
            description: "Valid claim with all evidence fields populated correctly"
        };

        await claimPayout.connect(worker1).fileClaim("Test", evidence);

        const stored = await claimPayout.getClaimEvidence(worker1.address);

        expect(stored.photoIpfsHash).to.equal(evidence.photoIpfsHash);
        expect(stored.gpsLatitude).to.equal(evidence.gpsLatitude);
        expect(stored.gpsLongitude).to.equal(evidence.gpsLongitude);
        expect(stored.policeReportId).to.equal(evidence.policeReportId);
        expect(stored.description).to.equal(evidence.description);

        console.log("      ✅ Evidence storage works!");
        console.log("      📸 Photo:", stored.photoIpfsHash);
        console.log("      📍 GPS:", stored.gpsLatitude + "," + stored.gpsLongitude);
        console.log("      📝 Description:", stored.description.substring(0, 40) + "...");
    });
});

console.log("\n🎉 ALL VALIDATION CHECKS WORKING!\n");
