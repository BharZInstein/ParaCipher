const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ClaimPayout - Evidence Verification Tests", function () {
    let claimPayout;
    let insurancePolicy;
    let owner;
    let worker;
    let worker2;

    // Valid evidence template
    const validEvidence = {
        photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        gpsLatitude: "13.0827",
        gpsLongitude: "80.2707",
        accidentTimestamp: 0, // Will be set in tests
        policeReportId: "CHN-ACC-2024-1142",
        description: "Rear-ended by car at traffic signal on Mount Road. Minor damage to bumper and taillight."
    };

    beforeEach(async function () {
        [owner, worker, worker2] = await ethers.getSigners();

        // Deploy InsurancePolicy
        const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy();

        // Deploy ClaimPayout
        const ClaimPayout = await ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());

        // Fund ClaimPayout contract
        await owner.sendTransaction({
            to: await claimPayout.getAddress(),
            value: ethers.parseEther("100")
        });

        console.log("✅ Contracts deployed and funded");
    });

    describe("✅ Valid Claims (Should Pass)", function () {
        it("Should approve claim with all valid evidence", async function () {
            // Worker buys coverage
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            // Get current block timestamp
            const latestBlock = await ethers.provider.getBlock('latest');
            const now = latestBlock.timestamp;

            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600 // 1 hour ago
            };

            // File claim
            const tx = await claimPayout.connect(worker).fileClaim(
                "Accident claim",
                evidence
            );

            // Check claim was approved
            const claim = await claimPayout.getClaimDetails(worker.address);
            expect(claim.status).to.equal(2); // Approved

            console.log("✅ TEST PASSED: Valid claim approved");
        });

        it("Should store evidence correctly on-chain", async function () {
            // Worker buys coverage
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600
            };

            // File claim
            await claimPayout.connect(worker).fileClaim("Test", evidence);

            // Retrieve evidence
            const storedEvidence = await claimPayout.getClaimEvidence(worker.address);

            expect(storedEvidence.photoIpfsHash).to.equal(evidence.photoIpfsHash);
            expect(storedEvidence.gpsLatitude).to.equal(evidence.gpsLatitude);
            expect(storedEvidence.gpsLongitude).to.equal(evidence.gpsLongitude);
            expect(storedEvidence.policeReportId).to.equal(evidence.policeReportId);
            expect(storedEvidence.description).to.equal(evidence.description);

            console.log("✅ TEST PASSED: Evidence stored correctly");
        });

        it("Should emit ClaimFiled event with evidence", async function () {
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600
            };

            const tx = await claimPayout.connect(worker).fileClaim("Test", evidence);

            // Check event was emitted
            await expect(tx).to.emit(claimPayout, "ClaimFiled");

            console.log("✅ TEST PASSED: Event emitted with evidence");
        });
    });

    describe("❌ Invalid Claims (Should Fail)", function () {
        beforeEach(async function () {
            // Worker buys coverage before each test
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });
        });

        it("Should reject claim without photo", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                photoIpfsHash: "", // ❌ Empty photo
                accidentTimestamp: now - 3600
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("Accident photo required - upload photo to IPFS");

            console.log("✅ TEST PASSED: Rejected claim without photo");
        });

        it("Should reject claim without GPS latitude", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                gpsLatitude: "", // ❌ Empty GPS
                accidentTimestamp: now - 3600
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("GPS latitude required - location proof needed");

            console.log("✅ TEST PASSED: Rejected claim without GPS latitude");
        });

        it("Should reject claim without GPS longitude", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                gpsLongitude: "", // ❌ Empty GPS
                accidentTimestamp: now - 3600
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("GPS longitude required - location proof needed");

            console.log("✅ TEST PASSED: Rejected claim without GPS longitude");
        });

        it("Should reject claim with zero timestamp", async function () {
            const evidence = {
                ...validEvidence,
                accidentTimestamp: 0 // ❌ Zero timestamp
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("Accident timestamp required");

            console.log("✅ TEST PASSED: Rejected claim with zero timestamp");
        });

        it("Should reject claim with future timestamp", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now + 1000 // ❌ Future timestamp
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("Timestamp cannot be in future - invalid evidence");

            console.log("✅ TEST PASSED: Rejected claim with future timestamp");
        });

        it("Should reject claim older than 24 hours", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - (25 * 3600) // ❌ 25 hours ago
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("Accident too old - must file within 24 hours");

            console.log("✅ TEST PASSED: Rejected old claim (>24 hours)");
        });

        it("Should reject claim with short description", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                description: "Short", // ❌ Less than 10 characters
                accidentTimestamp: now - 3600
            };

            await expect(
                claimPayout.connect(worker).fileClaim("Test", evidence)
            ).to.be.revertedWith("Description too short - minimum 10 characters required");

            console.log("✅ TEST PASSED: Rejected claim with short description");
        });

        it("Should reject claim without coverage", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600
            };

            // Worker2 has no coverage
            await expect(
                claimPayout.connect(worker2).fileClaim("Test", evidence)
            ).to.be.revertedWith("No valid coverage found. Buy coverage first!");

            console.log("✅ TEST PASSED: Rejected claim without coverage");
        });

        it("Should reject duplicate claims", async function () {
            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600
            };

            // File first claim
            await claimPayout.connect(worker).fileClaim("Test", evidence);

            // Try to file second claim
            await expect(
                claimPayout.connect(worker).fileClaim("Test 2", evidence)
            ).to.be.revertedWith("You already have a pending or approved claim");

            console.log("✅ TEST PASSED: Rejected duplicate claim");
        });
    });

    describe("📊 Edge Cases", function () {
        it("Should accept claim filed exactly at 24-hour limit", async function () {
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - (24 * 3600) // Exactly 24 hours ago
            };

            // Should NOT revert
            await claimPayout.connect(worker).fileClaim("Test", evidence);

            const claim = await claimPayout.getClaimDetails(worker.address);
            expect(claim.status).to.equal(2); // Approved

            console.log("✅ TEST PASSED: Accepted claim at 24-hour limit");
        });

        it("Should accept claim with minimum description length", async function () {
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                description: "1234567890", // Exactly 10 characters
                accidentTimestamp: now - 3600
            };

            await claimPayout.connect(worker).fileClaim("Test", evidence);

            const claim = await claimPayout.getClaimDetails(worker.address);
            expect(claim.status).to.equal(2); // Approved

            console.log("✅ TEST PASSED: Accepted claim with 10-char description");
        });

        it("Should accept claim without police report (optional)", async function () {
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                policeReportId: "", // Empty police report (optional)
                accidentTimestamp: now - 3600
            };

            await claimPayout.connect(worker).fileClaim("Test", evidence);

            const claim = await claimPayout.getClaimDetails(worker.address);
            expect(claim.status).to.equal(2); // Approved

            console.log("✅ TEST PASSED: Accepted claim without police report");
        });
    });

    describe("💰 Payout Tests", function () {
        it("Should send 15 SHM payout on valid claim", async function () {
            await insurancePolicy.connect(worker).buyDailyCoverage({
                value: ethers.parseEther("5")
            });

            const balanceBefore = await ethers.provider.getBalance(worker.address);

            const latestBlock = await ethers.provider.getBlock('latest'); const now = latestBlock.timestamp;
            const evidence = {
                ...validEvidence,
                accidentTimestamp: now - 3600
            };

            const tx = await claimPayout.connect(worker).fileClaim("Test", evidence);
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const balanceAfter = await ethers.provider.getBalance(worker.address);

            // Balance should increase by 15 SHM minus gas
            const expectedIncrease = ethers.parseEther("15") - gasUsed;
            const actualIncrease = balanceAfter - balanceBefore;

            expect(actualIncrease).to.be.closeTo(expectedIncrease, ethers.parseEther("0.01"));

            console.log("✅ TEST PASSED: 15 SHM payout sent");
        });
    });
});
