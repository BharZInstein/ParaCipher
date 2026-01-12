const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ParaCipher E2E Tests", function () {
    let insurancePolicy, claimPayout, reputationScore;
    let owner, worker1, worker2;

    beforeEach(async function () {
        // Get signers
        [owner, worker1, worker2] = await ethers.getSigners();

        // Deploy InsurancePolicy
        const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
        insurancePolicy = await InsurancePolicy.deploy();
        await insurancePolicy.waitForDeployment();

        // Deploy ClaimPayout
        const ClaimPayout = await ethers.getContractFactory("ClaimPayout");
        claimPayout = await ClaimPayout.deploy(await insurancePolicy.getAddress());
        await claimPayout.waitForDeployment();

        // Deploy ReputationScore
        const ReputationScore = await ethers.getContractFactory("ReputationScore");
        reputationScore = await ReputationScore.deploy();
        await reputationScore.waitForDeployment();

        // Connect contracts
        await claimPayout.setReputationContract(await reputationScore.getAddress());

        // Fund ClaimPayout directly (NOT using fundContract function)
        await owner.sendTransaction({
            to: await claimPayout.getAddress(),
            value: ethers.parseEther("100") // 200k MATIC for tests
        });
    });

    describe("InsurancePolicy", function () {
        it("Should allow worker to buy coverage", async function () {
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });

            const [isActive, coverage] = await insurancePolicy.connect(worker1).checkMyCoverage();
            expect(isActive).to.be.true;
            expect(coverage).to.equal(ethers.parseEther("50"));
        });

        it("Should reject incorrect premium amount", async function () {
            await expect(
                insurancePolicy.connect(worker1).buyDailyCoverage({
                    value: ethers.parseEther("20")
                })
            ).to.be.revertedWith("Must send exactly 25 MATIC for coverage");
        });

        it("Should prevent buying coverage if already active", async function () {
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });

            await expect(
                insurancePolicy.connect(worker1).buyDailyCoverage({
                    value: ethers.parseEther("25")
                })
            ).to.be.revertedWith("You already have active coverage");
        });

        it("Should allow owner to withdraw premiums", async function () {
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });

            const balanceBefore = await ethers.provider.getBalance(owner.address);
            const tx = await insurancePolicy.connect(owner).withdrawPremiums();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            const balanceAfter = await ethers.provider.getBalance(owner.address);

            expect(balanceAfter + gasUsed - balanceBefore).to.equal(ethers.parseEther("25"));
        });
    });

    describe("ClaimPayout", function () {
        beforeEach(async function () {
            // Worker buys coverage before each test
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });
        });

        it("Should allow worker to file claim", async function () {
            await claimPayout.connect(worker1).fileClaim("Test accident");

            const [status, amount, , notes] = await claimPayout.connect(worker1).getMyClaimStatus();
            expect(status).to.equal(1); // Pending
            expect(amount).to.equal(ethers.parseEther("50"));
            expect(notes).to.equal("Test accident");
        });

        it("Should reject claim if no coverage", async function () {
            await expect(
                claimPayout.connect(worker2).fileClaim("Test accident")
            ).to.be.revertedWith("No valid coverage found. Buy coverage first!");
        });

        it("Should send payout when claim approved", async function () {
            await claimPayout.connect(worker1).fileClaim("Test accident");

            const balanceBefore = await ethers.provider.getBalance(worker1.address);
            await claimPayout.connect(owner).approveClaim(worker1.address);
            const balanceAfter = await ethers.provider.getBalance(worker1.address);

            expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("50"));
        });

        it("Should prevent double claims", async function () {
            await claimPayout.connect(worker1).fileClaim("Test accident");
            await claimPayout.connect(owner).approveClaim(worker1.address);

            // Try to file another claim without buying new coverage
            await expect(
                claimPayout.connect(worker1).fileClaim("Another accident")
            ).to.be.revertedWith("No valid coverage found. Buy coverage first!");
        });

        it("Should reject claims", async function () {
            await claimPayout.connect(worker1).fileClaim("Test accident");
            await claimPayout.connect(owner).rejectClaim(worker1.address, "Fraud detected");

            const [status] = await claimPayout.connect(worker1).getMyClaimStatus();
            expect(status).to.equal(3); // Rejected
        });
    });

    describe("ReputationScore", function () {
        it("Should start with default score of 100", async function () {
            const [score] = await reputationScore.connect(worker1).getMyScore();
            expect(score).to.equal(100);
        });

        it("Should add points for safe day", async function () {
            await reputationScore.connect(owner).addSafeDay(worker1.address);
            const [score, safeDays] = await reputationScore.connect(worker1).getMyScore();
            expect(score).to.equal(105);
            expect(safeDays).to.equal(1);
        });

        it("Should deduct points for claim", async function () {
            await reputationScore.connect(owner).deductForClaim(worker1.address);
            const [score, , claims] = await reputationScore.connect(worker1).getMyScore();
            expect(score).to.equal(80); // 100 - 20
            expect(claims).to.equal(1);
        });

        it("Should calculate correct discount (20% at 150+ score)", async function () {
            // Add 10 safe days to get to 150 score
            for (let i = 0; i < 10; i++) {
                await reputationScore.connect(owner).addSafeDay(worker1.address);
            }

            const discount = await reputationScore.calculateDiscount(worker1.address);
            expect(discount).to.equal(20);
        });

        it("Should calculate correct discount (10% at 120-149 score)", async function () {
            // Add 4 safe days to get to 120 score
            for (let i = 0; i < 4; i++) {
                await reputationScore.connect(owner).addSafeDay(worker1.address);
            }

            const discount = await reputationScore.calculateDiscount(worker1.address);
            expect(discount).to.equal(10);
        });

        it("Should calculate surcharge (-10% below 100 score)", async function () {
            // Deduct for claim to get below 100
            await reputationScore.connect(owner).deductForClaim(worker1.address);

            const discount = await reputationScore.calculateDiscount(worker1.address);
            expect(discount).to.equal(-10);
        });

        it("Should calculate discounted premium correctly", async function () {
            // Get to 150 score (20% discount)
            for (let i = 0; i < 10; i++) {
                await reputationScore.connect(owner).addSafeDay(worker1.address);
            }

            const basePremium = ethers.parseEther("25");
            const discountedPremium = await reputationScore.getDiscountedPremium(
                worker1.address,
                basePremium
            );

            expect(discountedPremium).to.equal(ethers.parseEther("20")); // 20% off
        });
    });

    describe("Integration: Full Flow", function () {
        it("Should complete full workflow: buy → claim → payout → reputation", async function () {
            // 1. Buy coverage
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });

            // 2. Check coverage is active
            const [isActive, coverage] = await insurancePolicy.connect(worker1).checkMyCoverage();
            expect(isActive).to.be.true;
            expect(coverage).to.equal(ethers.parseEther("50"));

            // 3. File claim
            await claimPayout.connect(worker1).fileClaim("Accident on highway");

            // 4. Approve claim
            const balanceBefore = await ethers.provider.getBalance(worker1.address);
            await claimPayout.connect(owner).approveClaim(worker1.address);
            const balanceAfter = await ethers.provider.getBalance(worker1.address);

            // 5. Verify payout received
            expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("50"));

            // 6. Verify reputation decreased
            const [score] = await reputationScore.connect(worker1).getMyScore();
            expect(score).to.equal(80); // 100 - 20

            // 7. Verify policy marked as claimed
            const policy = await insurancePolicy.getPolicyDetails(worker1.address);
            expect(policy.hasClaimed).to.be.true;
            expect(policy.isActive).to.be.false;
        });

        it("Should track multiple workers correctly", async function () {
            // Worker 1 has accident
            await insurancePolicy.connect(worker1).buyDailyCoverage({
                value: ethers.parseEther("25")
            });
            await claimPayout.connect(worker1).fileClaim("Accident");
            await claimPayout.connect(owner).approveClaim(worker1.address);

            // Worker 2 is safe driver
            await insurancePolicy.connect(worker2).buyDailyCoverage({
                value: ethers.parseEther("25")
            });
            for (let i = 0; i < 5; i++) {
                await reputationScore.connect(owner).addSafeDay(worker2.address);
            }

            // Check reputations
            const [score1] = await reputationScore.connect(worker1).getMyScore();
            const [score2] = await reputationScore.connect(worker2).getMyScore();

            expect(score1).to.equal(80); // Lost 20 points
            expect(score2).to.equal(125); // Gained 25 points
        });
    });
});
