// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the InsurancePolicy interface
interface IInsurancePolicy {
    function hasValidCoverage(address worker) external view returns (bool);
    function markAsClaimed(address worker) external;
    function getPolicyDetails(address worker) external view returns (
        address workerAddress,
        uint256 coverageAmount,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool hasClaimed
    );
}

// Import the ReputationScore interface
interface IReputationScore {
    function deductForClaim(address worker) external;
}

/**
 * @title ClaimPayout
 * @dev Handles accident claims and sends payouts to workers
 * For MVP: Manual approval by owner (later: Chainlink oracle automation)
 */
contract ClaimPayout {
    
    // ========== STATE VARIABLES ==========
    
    address public owner;
    
    // Reference to InsurancePolicy contract
    IInsurancePolicy public insurancePolicy;
    
    // Reference to ReputationScore contract
    IReputationScore public reputationScore;
    
    // Payout amount: 50,000 MATIC
    uint256 public constant PAYOUT_AMOUNT = 50000 ether;
    
    // Total claims paid out
    uint256 public totalClaimsPaid;
    
    // Number of claims processed
    uint256 public totalClaimsProcessed;
    
    
    // ========== CLAIM STATUS ==========
    
    enum ClaimStatus {
        None,           // No claim filed
        Pending,        // Claim filed, waiting approval
        Approved,       // Claim approved, payout sent
        Rejected        // Claim rejected
    }
    
    
    // ========== CLAIM STRUCTURE ==========
    
    /**
     * @dev Struct to track claim information
     */
    struct Claim {
        address worker;             // Worker who filed claim
        uint256 requestedAmount;    // Amount requested (always 50,000 MATIC)
        uint256 filedAt;            // Timestamp when claim was filed
        uint256 processedAt;        // Timestamp when claim was approved/rejected
        ClaimStatus status;         // Current status of claim
        string notes;               // Optional notes from worker
    }
    
    
    // ========== MAPPINGS ==========
    
    // Maps worker address to their claim
    mapping(address => Claim) public claims;
    
    
    // ========== EVENTS ==========
    
    event ClaimFiled(
        address indexed worker,
        uint256 requestedAmount,
        uint256 filedAt,
        string notes
    );
    
    event ClaimApproved(
        address indexed worker,
        uint256 payoutAmount,
        uint256 approvedAt
    );
    
    event ClaimRejected(
        address indexed worker,
        uint256 rejectedAt,
        string reason
    );
    
    event PayoutSent(
        address indexed worker,
        uint256 amount,
        uint256 sentAt
    );
    
    
    // ========== MODIFIERS ==========
    
    /**
     * @dev Ensures only contract owner can call certain functions
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    
    /**
     * @dev Prevent reentrancy attacks
     */
    bool private locked;
    modifier noReentrant() {
        require(!locked, "No reentrancy allowed");
        locked = true;
        _;
        locked = false;
    }
    
    
    // ========== CONSTRUCTOR ==========
    
    /**
     * @dev Initialize with InsurancePolicy contract address
     * @param _insurancePolicyAddress Address of deployed InsurancePolicy contract
     */
    constructor(address _insurancePolicyAddress) {
        require(_insurancePolicyAddress != address(0), "Invalid policy contract address");
        owner = msg.sender;
        insurancePolicy = IInsurancePolicy(_insurancePolicyAddress);
    }
    
    
    // ========== SETUP FUNCTIONS ==========
    
    /**
     * @dev Set the ReputationScore contract address (called after deployment)
     * @param _reputationScoreAddress Address of deployed ReputationScore contract
     */
    function setReputationContract(address _reputationScoreAddress) external onlyOwner {
        require(_reputationScoreAddress != address(0), "Invalid reputation contract address");
        reputationScore = IReputationScore(_reputationScoreAddress);
    }
    
    
    // ========== MAIN FUNCTIONS ==========
    
    /**
     * @dev Worker files a claim for accident coverage
     * @param notes Optional description of the accident
     */
    function fileClaim(string memory notes) external {
        address worker = msg.sender;
        
        // Check if worker has valid active coverage
        require(
            insurancePolicy.hasValidCoverage(worker),
            "No valid coverage found. Buy coverage first!"
        );
        
        // Check if worker already has a pending/approved claim
        require(
            claims[worker].status == ClaimStatus.None ||
            claims[worker].status == ClaimStatus.Rejected,
            "You already have a pending or approved claim"
        );
        
        // Create new claim
        claims[worker] = Claim({
            worker: worker,
            requestedAmount: PAYOUT_AMOUNT,
            filedAt: block.timestamp,
            processedAt: 0,
            status: ClaimStatus.Pending,
            notes: notes
        });
        
        emit ClaimFiled(worker, PAYOUT_AMOUNT, block.timestamp, notes);
    }
    
    
    /**
     * @dev Owner approves a claim and sends payout
     * @param worker Address of worker whose claim to approve
     */
    function approveClaim(address worker) external onlyOwner noReentrant {
        // Get the claim
        Claim storage claim = claims[worker];
        
        // Verify claim exists and is pending
        require(claim.status == ClaimStatus.Pending, "No pending claim for this worker");
        
        // Double-check worker still has valid coverage
        require(
            insurancePolicy.hasValidCoverage(worker),
            "Worker's coverage is no longer valid"
        );
        
        // Check contract has enough balance
        require(
            address(this).balance >= PAYOUT_AMOUNT,
            "Insufficient funds for payout"
        );
        
        // Mark policy as claimed in InsurancePolicy contract
        insurancePolicy.markAsClaimed(worker);
        
        // Update claim status
        claim.status = ClaimStatus.Approved;
        claim.processedAt = block.timestamp;
        
        // Update stats
        totalClaimsPaid += PAYOUT_AMOUNT;
        totalClaimsProcessed++;
        
        // Deduct reputation score if reputation contract is set
        if (address(reputationScore) != address(0)) {
            reputationScore.deductForClaim(worker);
        }
        
        emit ClaimApproved(worker, PAYOUT_AMOUNT, block.timestamp);
        
        // Send payout to worker
        (bool success, ) = worker.call{value: PAYOUT_AMOUNT}("");
        require(success, "Payout transfer failed");
        
        emit PayoutSent(worker, PAYOUT_AMOUNT, block.timestamp);
    }
    
    
    /**
     * @dev Owner rejects a claim (if fraud detected, etc.)
     * @param worker Address of worker whose claim to reject
     * @param reason Reason for rejection
     */
    function rejectClaim(address worker, string memory reason) external onlyOwner {
        Claim storage claim = claims[worker];
        
        require(claim.status == ClaimStatus.Pending, "No pending claim for this worker");
        
        // Update claim status
        claim.status = ClaimStatus.Rejected;
        claim.processedAt = block.timestamp;
        
        emit ClaimRejected(worker, block.timestamp, reason);
    }
    
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @dev Get claim details for a specific worker
     * @param worker Address of worker
     * @return claim Full claim struct
     */
    function getClaimDetails(address worker) external view returns (Claim memory) {
        return claims[worker];
    }
    
    
    /**
     * @dev Check claim status for a worker
     * @param worker Address of worker
     * @return status Current claim status
     */
    function getClaimStatus(address worker) external view returns (ClaimStatus) {
        return claims[worker].status;
    }
    
    
    /**
     * @dev Get my claim status (for worker to check)
     */
    function getMyClaimStatus() external view returns (
        ClaimStatus status,
        uint256 requestedAmount,
        uint256 filedAt,
        string memory notes
    ) {
        Claim memory claim = claims[msg.sender];
        return (
            claim.status,
            claim.requestedAmount,
            claim.filedAt,
            claim.notes
        );
    }
    
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    
    // ========== FUNDING ==========
    
    /**
     * @dev Allow contract to receive funds for payouts
     */
    receive() external payable {}
    
    
    /**
     * @dev Owner can fund the contract for payouts
     */
    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Must send some MATIC");
    }
    
    
    /**
     * @dev Emergency withdraw (in case of issues)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
