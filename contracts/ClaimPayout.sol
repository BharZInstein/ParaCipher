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
 * AUTO-APPROVES claims if coverage is valid (automated validation)
 */
contract ClaimPayout {
    
    // ========== STATE VARIABLES ==========
    
    address public owner;
    
    // Reference to InsurancePolicy contract
    IInsurancePolicy public insurancePolicy;
    
    // Reference to ReputationScore contract
    IReputationScore public reputationScore;
    
    // Payout amount: 15 SHM (what customer receives when claim approved)
    uint256 public constant PAYOUT_AMOUNT = 15 ether;
    
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
    
    
    // ========== EVIDENCE STRUCTURE ==========
    
    /**
     * @dev Struct to store accident evidence for claim verification
     * This ensures claims are backed by real evidence (photos, GPS, timestamps)
     */
    struct ClaimEvidence {
        string photoIpfsHash;        // IPFS hash of accident photo (REQUIRED)
        string gpsLatitude;          // Accident GPS latitude (REQUIRED)
        string gpsLongitude;         // Accident GPS longitude (REQUIRED)
        uint256 accidentTimestamp;   // Unix timestamp when accident occurred (REQUIRED)
        string policeReportId;       // Police report number (optional)
        string description;          // Detailed accident description (REQUIRED, min 10 chars)
    }
    
    
    // ========== CLAIM STRUCTURE ==========
    
    /**
     * @dev Struct to track claim information
     */
        struct Claim {
        address worker;             // Worker who filed claim
        uint256 requestedAmount;    // Amount requested (always 15 SHM)
        uint256 filedAt;            // Timestamp when claim was filed
        uint256 processedAt;        // Timestamp when claim was approved/rejected
        ClaimStatus status;         // Current status of claim
        string notes;               // Optional notes from worker
        ClaimEvidence evidence;     // Accident evidence (photos, GPS, timestamp, etc)
    }

    
    
    // ========== MAPPINGS ==========
    
    // Maps worker address to their claim
    mapping(address => Claim) public claims;
    
    
    // ========== EVENTS ==========
    
    event ClaimFiled(
        address indexed worker,
        uint256 requestedAmount,
        uint256 filedAt,
        string notes,
        string photoIpfsHash,
        string gpsCoordinates
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
     * @dev Worker files a claim for accident coverage WITH EVIDENCE
     * REQUIRES: Accident photo, GPS coordinates, timestamp, and description
     * VALIDATES: All evidence is present and valid before approving claim
     * @param notes Optional notes from worker
     * @param evidence ClaimEvidence struct with photo, GPS, timestamp, police report, description
     */
    function fileClaim(
        string memory notes,
        ClaimEvidence memory evidence
    ) external noReentrant {
        address worker = msg.sender;
        
        // ========== VALIDATION CHECK 1: COVERAGE ==========
        // Check if worker has valid active coverage
        require(
            insurancePolicy.hasValidCoverage(worker),
            "No valid coverage found. Buy coverage first!"
        );
        
        // Get policy details to validate accident timing
        (
            ,
            ,
            uint256 policyStartTime,
            uint256 policyEndTime,
            bool isActive,
            bool hasClaimed
        ) = insurancePolicy.getPolicyDetails(worker);
        
        require(isActive, "Policy is not active");
        require(!hasClaimed, "Policy already claimed");
        
        
        // ========== VALIDATION CHECK 2: NO DUPLICATE CLAIMS ==========
        // Check if worker already has a pending/approved claim
        require(
            claims[worker].status == ClaimStatus.None ||
            claims[worker].status == ClaimStatus.Rejected,
            "You already have a pending or approved claim"
        );
        
        
        // ========== VALIDATION CHECK 3: PHOTO EVIDENCE REQUIRED ==========
        // Accident photo is MANDATORY proof
        require(
            bytes(evidence.photoIpfsHash).length > 0,
            "Accident photo required - upload photo to IPFS"
        );
        
        
        // ========== VALIDATION CHECK 4: GPS COORDINATES REQUIRED ==========
        // Location proof is MANDATORY
        require(
            bytes(evidence.gpsLatitude).length > 0,
            "GPS latitude required - location proof needed"
        );
        require(
            bytes(evidence.gpsLongitude).length > 0,
            "GPS longitude required - location proof needed"
        );
        
        
        // ========== VALIDATION CHECK 5: TIMESTAMP VALIDATION ==========
        // Accident timestamp is MANDATORY and must be reasonable
        require(
            evidence.accidentTimestamp > 0,
            "Accident timestamp required"
        );
        
        // Timestamp cannot be in the future
        require(
            evidence.accidentTimestamp <= block.timestamp,
            "Timestamp cannot be in future - invalid evidence"
        );
        
        // Must file claim within 24 hours of accident (parametric insurance rule)
        require(
            evidence.accidentTimestamp >= block.timestamp - 24 hours,
            "Accident too old - must file within 24 hours"
        );
        
        
        // ========== VALIDATION CHECK 6: ACCIDENT DURING COVERAGE ==========
        // Accident MUST have occurred while coverage was active
        require(
            evidence.accidentTimestamp >= policyStartTime,
            "Accident before coverage started - invalid claim"
        );
        require(
            evidence.accidentTimestamp <= policyEndTime,
            "Accident after coverage expired - invalid claim"
        );
        
        
        // ========== VALIDATION CHECK 7: DESCRIPTION REQUIRED ==========
        // Detailed description is MANDATORY (helps prevent fraud)
        require(
            bytes(evidence.description).length >= 10,
            "Description too short - minimum 10 characters required"
        );
        
        
        // ========== VALIDATION CHECK 8: SUFFICIENT FUNDS ==========
        // Check contract has enough balance for payout
        require(
            address(this).balance >= PAYOUT_AMOUNT,
            "Insufficient funds in pool for payout"
        );
        
        
        // ========== ALL CHECKS PASSED - AUTO-APPROVE ==========
        // Since ALL evidence is valid, automatically approve and payout
        
        // Mark policy as claimed in InsurancePolicy contract
        insurancePolicy.markAsClaimed(worker);
        
        // Create claim and immediately approve it
        claims[worker] = Claim({
            worker: worker,
            requestedAmount: PAYOUT_AMOUNT,
            filedAt: block.timestamp,
            processedAt: block.timestamp,
            status: ClaimStatus.Approved,
            notes: notes,
            evidence: evidence  // Store all evidence on-chain
        });
        
        // Update stats
        totalClaimsPaid += PAYOUT_AMOUNT;
        totalClaimsProcessed++;
        
        // Deduct reputation score if reputation contract is set
        if (address(reputationScore) != address(0)) {
            reputationScore.deductForClaim(worker);
        }
        
        // Emit events with evidence details
        string memory gpsCoords = string(abi.encodePacked(
            evidence.gpsLatitude,
            ",",
            evidence.gpsLongitude
        ));
        
        emit ClaimFiled(
            worker,
            PAYOUT_AMOUNT,
            block.timestamp,
            notes,
            evidence.photoIpfsHash,
            gpsCoords
        );
        emit ClaimApproved(worker, PAYOUT_AMOUNT, block.timestamp);
        
        // Send payout to worker immediately
        (bool success, ) = worker.call{value: PAYOUT_AMOUNT}("");
        require(success, "Payout transfer failed");
        
        emit PayoutSent(worker, PAYOUT_AMOUNT, block.timestamp);
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
     * @dev Get claim evidence for a specific worker
     * Used by admin dashboard to view submitted evidence
     * @param worker Address of worker whose evidence to retrieve
     * @return evidence Complete evidence struct (photo, GPS, timestamp, description)
     */
    function getClaimEvidence(address worker) 
        external 
        view 
        returns (ClaimEvidence memory) 
    {
        return claims[worker].evidence;
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
        require(msg.value > 0, "Must send some SHM");
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
