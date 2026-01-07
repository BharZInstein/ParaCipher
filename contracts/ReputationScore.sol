// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReputationScore
 * @dev Tracks worker safety records and calculates premium discounts
 * Good drivers (no claims) earn higher scores and discounts
 */
contract ReputationScore {
    
    // ========== STATE VARIABLES ==========
    
    address public owner;
    
    // Default starting score for new workers
    uint256 public constant DEFAULT_SCORE = 100;
    
    // Points added for completing a safe day
    uint256 public constant SAFE_DAY_BONUS = 5;
    
    // Points deducted when filing a claim
    uint256 public constant CLAIM_PENALTY = 20;
    
    
    // ========== SCORE STRUCTURE ==========
    
    /**
     * @dev Struct to track worker reputation
     */
    struct WorkerReputation {
        uint256 score;              // Current reputation score
        uint256 safeDaysCount;      // Total safe days completed
        uint256 claimsCount;        // Total claims filed
        uint256 lastUpdated;        // Last time score was updated
        bool isActive;              // Has worker ever used the system
    }
    
    
    // ========== MAPPINGS ==========
    
    // Maps worker address to their reputation
    mapping(address => WorkerReputation) public reputations;
    
    
    // ========== EVENTS ==========
    
    event ScoreUpdated(
        address indexed worker,
        uint256 newScore,
        int256 change,
        string reason
    );
    
    event SafeDayAdded(
        address indexed worker,
        uint256 newScore,
        uint256 totalSafeDays
    );
    
    event ClaimPenaltyApplied(
        address indexed worker,
        uint256 newScore,
        uint256 totalClaims
    );
    
    event DiscountCalculated(
        address indexed worker,
        uint256 score,
        int256 discountPercentage
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
    
    
    // ========== MAIN FUNCTIONS ==========
    
    /**
     * @dev Initialize a new worker's reputation (called automatically or by admin)
     * @param worker Address of worker to initialize
     */
    function initializeWorker(address worker) public {
        // Only initialize if not already active
        if (!reputations[worker].isActive) {
            reputations[worker] = WorkerReputation({
                score: DEFAULT_SCORE,
                safeDaysCount: 0,
                claimsCount: 0,
                lastUpdated: block.timestamp,
                isActive: true
            });
            
            emit ScoreUpdated(worker, DEFAULT_SCORE, 0, "Account initialized");
        }
    }
    
    
    /**
     * @dev Add points for completing a safe day without claims
     * @param worker Address of worker who completed safe day
     */
    function addSafeDay(address worker) external onlyOwner {
        // Initialize if needed
        if (!reputations[worker].isActive) {
            initializeWorker(worker);
        }
        
        WorkerReputation storage rep = reputations[worker];
        
        // Add safe day bonus
        rep.score += SAFE_DAY_BONUS;
        rep.safeDaysCount++;
        rep.lastUpdated = block.timestamp;
        
        emit SafeDayAdded(worker, rep.score, rep.safeDaysCount);
        emit ScoreUpdated(worker, rep.score, int256(SAFE_DAY_BONUS), "Safe day completed");
    }
    
    
    /**
     * @dev Deduct points when worker files a claim
     * @param worker Address of worker who filed claim
     */
    function deductForClaim(address worker) external {
        // In production, restrict this to only ClaimPayout contract
        // For MVP, allowing any caller
        
        // Initialize if needed
        if (!reputations[worker].isActive) {
            initializeWorker(worker);
        }
        
        WorkerReputation storage rep = reputations[worker];
        
        // Deduct penalty (but don't go below 0)
        if (rep.score >= CLAIM_PENALTY) {
            rep.score -= CLAIM_PENALTY;
        } else {
            rep.score = 0;
        }
        
        rep.claimsCount++;
        rep.lastUpdated = block.timestamp;
        
        emit ClaimPenaltyApplied(worker, rep.score, rep.claimsCount);
        emit ScoreUpdated(worker, rep.score, -int256(CLAIM_PENALTY), "Claim penalty applied");
    }
    
    
    /**
     * @dev Calculate premium discount based on reputation score
     * @param worker Address of worker
     * @return discountPercentage Positive = discount, Negative = surcharge
     * 
     * DISCOUNT TIERS:
     * - Score 150+:     20% discount
     * - Score 120-149:  10% discount
     * - Score 100-119:  0% (standard rate)
     * - Score < 100:    10% surcharge
     */
    function calculateDiscount(address worker) public view returns (int256 discountPercentage) {
        // Initialize if needed (in view function, just return 0)
        if (!reputations[worker].isActive) {
            return 0; // Standard rate for new workers
        }
        
        uint256 score = reputations[worker].score;
        
        if (score >= 150) {
            return 20;      // 20% discount
        } else if (score >= 120) {
            return 10;      // 10% discount
        } else if (score >= 100) {
            return 0;       // Standard rate
        } else {
            return -10;     // 10% surcharge
        }
    }
    
    
    /**
     * @dev Get discounted premium amount
     * @param worker Address of worker
     * @param basePremium Base premium amount (e.g., 25 MATIC)
     * @return discountedPremium Final premium after discount/surcharge
     */
    function getDiscountedPremium(address worker, uint256 basePremium) 
        external 
        view 
        returns (uint256 discountedPremium) 
    {
        int256 discount = calculateDiscount(worker);
        
        if (discount > 0) {
            // Apply discount
            uint256 discountAmount = (basePremium * uint256(discount)) / 100;
            return basePremium - discountAmount;
        } else if (discount < 0) {
            // Apply surcharge
            uint256 surchargeAmount = (basePremium * uint256(-discount)) / 100;
            return basePremium + surchargeAmount;
        } else {
            // No change
            return basePremium;
        }
    }
    
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @dev Get your current reputation score
     */
    function getMyScore() external view returns (
        uint256 currentScore,
        uint256 safeDays,
        uint256 totalClaims,
        int256 discount
    ) {
        if (!reputations[msg.sender].isActive) {
            // Return default values for new workers
            return (DEFAULT_SCORE, 0, 0, 0);
        }
        
        WorkerReputation memory rep = reputations[msg.sender];
        int256 discountPercent = calculateDiscount(msg.sender);
        
        return (
            rep.score,
            rep.safeDaysCount,
            rep.claimsCount,
            discountPercent
        );
    }
    
    
    /**
     * @dev Get complete reputation details for any worker
     * @param worker Address of worker to check
     */
    function getReputationDetails(address worker) external view returns (
        uint256 score,
        uint256 safeDays,
        uint256 claims,
        uint256 lastUpdated,
        bool isActive,
        int256 discountPercentage
    ) {
        WorkerReputation memory rep = reputations[worker];
        int256 discount = calculateDiscount(worker);
        
        return (
            rep.isActive ? rep.score : DEFAULT_SCORE,
            rep.safeDaysCount,
            rep.claimsCount,
            rep.lastUpdated,
            rep.isActive,
            discount
        );
    }
    
    
    /**
     * @dev Check if a worker qualifies for any discount
     * @param worker Address to check
     */
    function qualifiesForDiscount(address worker) external view returns (bool) {
        return calculateDiscount(worker) > 0;
    }
    
    
    /**
     * @dev Get a worker's score (public view)
     * @param worker Address of worker
     */
    function getScore(address worker) external view returns (uint256) {
        if (!reputations[worker].isActive) {
            return DEFAULT_SCORE;
        }
        return reputations[worker].score;
    }
    
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @dev Manually adjust score (emergency use only)
     * @param worker Address of worker
     * @param newScore New score value
     * @param reason Reason for manual adjustment
     */
    function manualScoreAdjustment(
        address worker,
        uint256 newScore,
        string memory reason
    ) external onlyOwner {
        if (!reputations[worker].isActive) {
            initializeWorker(worker);
        }
        
        uint256 oldScore = reputations[worker].score;
        reputations[worker].score = newScore;
        reputations[worker].lastUpdated = block.timestamp;
        
        int256 change = int256(newScore) - int256(oldScore);
        emit ScoreUpdated(worker, newScore, change, reason);
    }
    
    
    /**
     * @dev Batch add safe days for multiple workers
     * @param workers Array of worker addresses
     */
    function batchAddSafeDays(address[] calldata workers) external onlyOwner {
        for (uint256 i = 0; i < workers.length; i++) {
            if (!reputations[workers[i]].isActive) {
                initializeWorker(workers[i]);
            }
            
            WorkerReputation storage rep = reputations[workers[i]];
            rep.score += SAFE_DAY_BONUS;
            rep.safeDaysCount++;
            rep.lastUpdated = block.timestamp;
            
            emit SafeDayAdded(workers[i], rep.score, rep.safeDaysCount);
        }
    }
}
