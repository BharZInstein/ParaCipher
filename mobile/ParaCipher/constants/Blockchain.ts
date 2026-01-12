// Smart Contract Configuration for ParaCipher
// Shardeum Testnet - Deployed and Ready

export const BLOCKCHAIN_CONFIG = {
    // Contract Addresses (Deployed on Shardeum)
    // NEW: InsurancePolicy with 6 hours coverage
    INSURANCE_POLICY_ADDRESS: "0x0d66497f87B9D13dB37fd71BDdaf345A6c315492",
    // Using old ClaimPayout (has 200 SHM ready) - new one not deployed yet
    CLAIM_PAYOUT_ADDRESS: "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D",
    // Using old ReputationScore - new one not deployed yet
    REPUTATION_SCORE_ADDRESS: "0x199678E7AF0B7a9f62523563f9eF861e242e944A",

    // Network Config
    CHAIN_ID: 8119,
    CHAIN_ID_HEX: "0x1FB7",
    CHAIN_NAME: "Shardeum Testnet",
    RPC_URL: "https://api-mezame.shardeum.org",
    EXPLORER_URL: "https://explorer-mezame.shardeum.org",
    SYMBOL: "SHM",

    // Amounts (in SHM) - MATCHING DEPLOYED CONTRACTS
    PREMIUM_AMOUNT: "5",     // What user pays for coverage
    COVERAGE_AMOUNT: "15",   // What user is covered for (NEW contract: 15 SHM, OLD: 150 SHM)
    PAYOUT_AMOUNT: "150",    // What user gets if claim approved (OLD ClaimPayout: 150 SHM)
    COVERAGE_DURATION: 6    // Hours (NEW InsurancePolicy: 6 hours ✅)
};

// Contract ABIs
export const INSURANCE_POLICY_ABI = [
    "function buyDailyCoverage() external payable",
    "function checkMyCoverage() external view returns (bool isActive, uint256 coverageAmount, uint256 timeRemaining)",
    "function PREMIUM_AMOUNT() external view returns (uint256)",
    "function COVERAGE_AMOUNT() external view returns (uint256)",
    "function COVERAGE_DURATION() external view returns (uint256)"
];

export const CLAIM_PAYOUT_ABI = [
    "function fileClaim(string memory notes) external",
    "function getMyClaimStatus() external view returns (uint8 status, uint256 requestedAmount, uint256 filedAt, string memory notes)",
    "function getClaimDetails(address worker) external view returns (tuple(address worker, uint256 requestedAmount, uint256 filedAt, uint256 processedAt, uint8 status, string notes))",
    "function PAYOUT_AMOUNT() external view returns (uint256)",
    "function approveClaim(address worker) external",  // Owner only
    "function rejectClaim(address worker, string reason) external"  // Owner only
];

export const REPUTATION_SCORE_ABI = [
    "function getMyScore() external view returns (uint256)",
    "function getScore(address user) external view returns (uint256)"
];

// Claim Status Enum
export enum ClaimStatus {
    None = 0,
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

export const CLAIM_STATUS_TEXT = {
    [ClaimStatus.None]: "No Claim",
    [ClaimStatus.Pending]: "Pending Approval",
    [ClaimStatus.Approved]: "Approved & Paid",
    [ClaimStatus.Rejected]: "Rejected"
};
