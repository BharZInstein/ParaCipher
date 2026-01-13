// Smart Contract Configuration for ParaCipher
// LOCALHOST - For Demo/Testing

export const BLOCKCHAIN_CONFIG = {
    // Contract Addresses (Deployed on Localhost)
    INSURANCE_POLICY_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    CLAIM_PAYOUT_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    REPUTATION_SCORE_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",

    // Network Config - LOCALHOST
    CHAIN_ID: 31337,  // Hardhat default
    CHAIN_ID_HEX: "0x7A69",
    CHAIN_NAME: "Hardhat Local",
    RPC_URL: "http://localhost:8545",  // Your local Hardhat node
    EXPLORER_URL: "http://localhost:8545",  // No explorer for localhost
    SYMBOL: "ETH",  // Localhost uses ETH

    // Amounts (in ETH/MATIC for localhost)
    PREMIUM_AMOUNT: "5",     // What user pays for coverage
    COVERAGE_AMOUNT: "15",   // What user is covered for
    PAYOUT_AMOUNT: "15",     // What user gets if claim approved
    COVERAGE_DURATION: 6    // Hours (6 hours as per contract)
};

// Contract ABIs (same as main config)
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

