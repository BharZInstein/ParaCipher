// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InsurancePolicy
 * @dev Manages daily coverage purchases for gig workers
 * Workers pay 5 SHM for 6-hour coverage of 15 SHM
 */
contract InsurancePolicy {
    
    // ========== STATE VARIABLES ==========
    
    address public owner;
    
    // Reference to ClaimPayout contract (the pool)
    address public claimPayoutContract;
    
    // Premium amount: 5 SHM (what customer pays)
    uint256 public constant PREMIUM_AMOUNT = 5 ether;
    
    // Coverage amount: 15 SHM (maximum insured amount)
    uint256 public constant COVERAGE_AMOUNT = 15 ether;
    
    // Coverage duration: 6 hours
    uint256 public constant COVERAGE_DURATION = 6 hours;
    
    // Total premiums collected by contract
    uint256 public totalPremiumsCollected;
    
    
    // ========== POLICY STRUCTURE ==========
    
    /**
     * @dev Struct to store individual policy information
     */
        struct Policy {
        address workerAddress;      // Address of the worker
        uint256 coverageAmount;     // Amount of coverage (15 SHM)
        uint256 startTime;          // When coverage started
        uint256 endTime;            // When coverage expires (startTime + 6hrs)
        bool isActive;              // Is the policy currently active
        bool hasClaimed;            // Has the worker claimed this policy (prevents double claims)
    }
    
    
    // ========== MAPPINGS ==========
    
    // Maps worker address to their current policy
    mapping(address => Policy) public policies;
    
    
    // ========== EVENTS ==========
    
    event PolicyPurchased(
        address indexed worker,
        uint256 coverageAmount,
        uint256 startTime,
        uint256 endTime
    );
    
    event PolicyExpired(
        address indexed worker,
        uint256 expiredAt
    );
    
    event PremiumsWithdrawn(
        address indexed owner,
        uint256 amount
    );
    
    
    // ========== MODIFIERS ==========
    
    /**
     * @dev Ensures only contract owner can call certain functions
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    
    // ========== CONSTRUCTOR ==========
    
    /**
     * @dev Sets the contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Set the ClaimPayout contract address (called after deployment)
     * Premiums will be forwarded to this contract (the pool)
     */
    function setClaimPayoutContract(address _claimPayoutAddress) external onlyOwner {
        require(_claimPayoutAddress != address(0), "Invalid claim payout address");
        claimPayoutContract = _claimPayoutAddress;
    }
    
    
    // ========== MAIN FUNCTIONS ==========
    
    /**
     * @dev Worker buys daily coverage by paying 5 SHM
     * Creates a 6-hour active policy with 15 SHM coverage
     */
    function buyDailyCoverage() external payable {
        // Check correct premium amount was sent
        require(
            msg.value == PREMIUM_AMOUNT,
            "Must send exactly 5 SHM for coverage"
        );
        
        // Check if worker already has an active policy
        Policy storage existingPolicy = policies[msg.sender];
        if (existingPolicy.isActive) {
            require(
                block.timestamp > existingPolicy.endTime,
                "You already have active coverage"
            );
            // If old policy expired, mark it inactive
            existingPolicy.isActive = false;
            emit PolicyExpired(msg.sender, existingPolicy.endTime);
        }
        
        // Create new policy
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + COVERAGE_DURATION;
        
        policies[msg.sender] = Policy({
            workerAddress: msg.sender,
            coverageAmount: COVERAGE_AMOUNT,
            startTime: startTime,
            endTime: endTime,
            isActive: true,
            hasClaimed: false
        });
        
        // Track total premiums
        totalPremiumsCollected += msg.value;
        
        // Forward premium to ClaimPayout contract (the pool) if set
        if (claimPayoutContract != address(0)) {
            (bool success, ) = claimPayoutContract.call{value: msg.value}("");
            require(success, "Failed to forward premium to pool");
        }
        
        emit PolicyPurchased(msg.sender, COVERAGE_AMOUNT, startTime, endTime);
    }
    
    
    /**
     * @dev Check if a worker currently has active coverage
     * @return isActive Whether the policy is currently active
     * @return coverageAmount How much coverage they have
     * @return timeRemaining Seconds until policy expires (0 if expired)
     */
    function checkMyCoverage() external view returns (
        bool isActive,
        uint256 coverageAmount,
        uint256 timeRemaining
    ) {
        Policy memory policy = policies[msg.sender];
        
        // Check if policy exists and hasn't expired
        if (policy.isActive && block.timestamp <= policy.endTime) {
            return (
                true,
                policy.coverageAmount,
                policy.endTime - block.timestamp
            );
        } else {
            return (false, 0, 0);
        }
    }
    
    
    /**
     * @dev Get policy details for any worker (used by other contracts)
     * @param worker Address of the worker to check
     * @return policy The full policy struct
     */
    function getPolicyDetails(address worker) external view returns (Policy memory) {
        return policies[worker];
    }
    
    
    /**
     * @dev Check if a worker has valid active coverage (used by ClaimPayout contract)
     * @param worker Address to check
     * @return bool Whether worker has active, unclaimed coverage
     */
    function hasValidCoverage(address worker) external view returns (bool) {
        Policy memory policy = policies[worker];
        
        // Must be active, not expired, and not already claimed
        return (
            policy.isActive &&
            block.timestamp <= policy.endTime &&
            !policy.hasClaimed
        );
    }
    
    
    /**
     * @dev Mark a policy as claimed (called by ClaimPayout contract)
     * @param worker Address of worker whose policy to mark as claimed
     */
    function markAsClaimed(address worker) external {
        // For MVP, allowing any address to call this
        // In production, you'd restrict this to only ClaimPayout contract
        require(policies[worker].isActive, "No active policy found");
        require(!policies[worker].hasClaimed, "Policy already claimed");
        
        policies[worker].hasClaimed = true;
        policies[worker].isActive = false;
    }
    
    
    /**
     * @dev Owner withdraws collected premiums
     * Leaves enough balance to cover potential claims
     */
    function withdrawPremiums() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No premiums to withdraw");
        
        // Transfer to owner
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit PremiumsWithdrawn(owner, balance);
    }
    
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    
    /**
     * @dev Check if a specific policy has expired
     * @param worker Address of worker to check
     */
    function isPolicyExpired(address worker) external view returns (bool) {
        Policy memory policy = policies[worker];
        return block.timestamp > policy.endTime;
    }
}
