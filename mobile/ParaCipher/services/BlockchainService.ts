// Smart Contract Interaction Service
import { ethers } from 'ethers';
import {
    BLOCKCHAIN_CONFIG,
    CLAIM_PAYOUT_ABI,
    ClaimStatus,
    INSURANCE_POLICY_ABI,
    REPUTATION_SCORE_ABI
} from '../constants/Blockchain';

/**
 * Insurance Policy Contract Functions
 */
export class InsurancePolicyService {

    /**
     * Buy daily coverage (5 SHM for 6 hours)
     */
    static async buyCoverage(signer: ethers.Signer) {
        try {
            console.log("[InsurancePolicy] Creating contract instance...");
            console.log("[InsurancePolicy] Contract address:", BLOCKCHAIN_CONFIG.INSURANCE_POLICY_ADDRESS);
            console.log("[InsurancePolicy] Premium amount:", BLOCKCHAIN_CONFIG.PREMIUM_AMOUNT, "SHM");

            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.INSURANCE_POLICY_ADDRESS,
                INSURANCE_POLICY_ABI,
                signer
            );

            console.log("[InsurancePolicy] Sending transaction - CHECK YOUR WALLET APP TO APPROVE!");
            const tx = await contract.buyDailyCoverage({
                value: ethers.utils.parseEther(BLOCKCHAIN_CONFIG.PREMIUM_AMOUNT)
            });

            console.log("[InsurancePolicy] Transaction sent! Hash:", tx.hash);
            console.log("[InsurancePolicy] Waiting for confirmation...");
            await tx.wait();
            console.log("[InsurancePolicy] Transaction confirmed!");

            return { success: true, txHash: tx.hash };
        } catch (error: any) {
            console.error("[InsurancePolicy] Buy coverage failed:", error);
            console.error("[InsurancePolicy] Error code:", error?.code);
            console.error("[InsurancePolicy] Error reason:", error?.reason);
            return {
                success: false,
                error: error?.reason || error?.message || "Failed to buy coverage"
            };
        }
    }

    /**
     * Check current coverage status
     * Uses direct RPC with getPolicyDetails for faster, reliable reads
     */
    static async checkCoverageStatus(signerOrProvider: ethers.providers.Provider | ethers.Signer, address: string) {
        try {
            console.log("[InsurancePolicy] Checking coverage for:", address);

            // Use direct RPC provider for faster read calls
            const directProvider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);

            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.INSURANCE_POLICY_ADDRESS,
                INSURANCE_POLICY_ABI,
                directProvider
            );

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout checking coverage')), 8000)
            );

            // Use getPolicyDetails which takes an address parameter
            const resultPromise = contract.getPolicyDetails(address);

            const policy = await Promise.race([
                resultPromise,
                timeoutPromise
            ]) as any;

            console.log("[InsurancePolicy] Policy details:", {
                isActive: policy.isActive,
                endTime: policy.endTime?.toString(),
                hasClaimed: policy.hasClaimed
            });

            // Calculate time remaining
            const now = Math.floor(Date.now() / 1000);
            const endTime = Number(policy.endTime || 0);
            const timeRemaining = Math.max(0, endTime - now);
            const isActive = policy.isActive && timeRemaining > 0 && !policy.hasClaimed;

            const hoursLeft = Math.floor(timeRemaining / 3600);
            const minutesLeft = Math.floor((timeRemaining % 3600) / 60);

            console.log("[InsurancePolicy] Calculated:", { isActive, timeRemaining, hoursLeft, minutesLeft });

            return {
                isActive,
                coverageAmount: ethers.utils.formatEther(policy.coverageAmount || 0),
                timeRemaining,
                hoursLeft,
                minutesLeft,
                expiresAt: isActive ? new Date(endTime * 1000) : null
            };
        } catch (error: any) {
            console.error("[InsurancePolicy] Check status failed:", error.message);
            return {
                isActive: false,
                coverageAmount: "0",
                timeRemaining: 0,
                hoursLeft: 0,
                minutesLeft: 0,
                expiresAt: null
            };
        }
    }
}

/**
 * Claim Payout Contract Functions
 */
export class ClaimPayoutService {

    /**
     * File a new claim
     */
    static async fileClaim(signer: ethers.Signer, accidentDescription: string) {
        try {
            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.CLAIM_PAYOUT_ADDRESS,
                CLAIM_PAYOUT_ABI,
                signer
            );

            const tx = await contract.fileClaim(accidentDescription);

            console.log("[ClaimPayout] File claim tx:", tx.hash);
            await tx.wait();

            return { success: true, txHash: tx.hash };
        } catch (error: any) {
            console.error("[ClaimPayout] File claim failed:", error);
            return {
                success: false,
                error: error?.reason || error?.message || "Failed to file claim"
            };
        }
    }

    /**
     * Check claim status for current user
     */
    static async checkClaimStatus(provider: ethers.providers.Provider | ethers.Signer) {
        try {
            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.CLAIM_PAYOUT_ADDRESS,
                CLAIM_PAYOUT_ABI,
                provider
            );

            const [status, requestedAmount, filedAt, notes] = await contract.getMyClaimStatus();

            return {
                status: Number(status) as ClaimStatus,
                requestedAmount: ethers.utils.formatEther(requestedAmount),
                filedAt: Number(filedAt),
                notes,
                hasClaim: Number(status) !== ClaimStatus.None
            };
        } catch (error: any) {
            console.error("[ClaimPayout] Check claim status failed:", error);
            return {
                status: ClaimStatus.None,
                requestedAmount: "0",
                filedAt: 0,
                notes: "",
                hasClaim: false
            };
        }
    }

    /**
     * Approve a claim (OWNER ONLY)
     */
    static async approveClaim(ownerSigner: ethers.Signer, workerAddress: string) {
        try {
            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.CLAIM_PAYOUT_ADDRESS,
                CLAIM_PAYOUT_ABI,
                ownerSigner
            );

            const tx = await contract.approveClaim(workerAddress);

            console.log("[ClaimPayout] Approve claim tx:", tx.hash);
            await tx.wait();

            return { success: true, txHash: tx.hash };
        } catch (error: any) {
            console.error("[ClaimPayout] Approve claim failed:", error);
            return {
                success: false,
                error: error?.reason || error?.message || "Failed to approve claim"
            };
        }
    }
}

/**
 * Reputation Score Contract Functions
 */
export class ReputationScoreService {

    /**
     * Get reputation score for current user
     */
    static async getMyScore(provider: ethers.providers.Provider | ethers.Signer) {
        try {
            const contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.REPUTATION_SCORE_ADDRESS,
                REPUTATION_SCORE_ABI,
                provider
            );

            const score = await contract.getMyScore();

            return {
                score: Number(score),
                tier: this.getScoreTier(Number(score))
            };
        } catch (error: any) {
            console.error("[ReputationScore] Get score failed:", error);
            return { score: 0, tier: "Unknown" };
        }
    }

    /**
     * Get score tier based on number
     */
    private static getScoreTier(score: number): string {
        if (score >= 900) return "Platinum";
        if (score >= 750) return "Gold";
        if (score >= 500) return "Silver";
        return "Bronze";
    }
}

/**
 * Network switching helper
 */
export class NetworkService {

    /**
     * Add/Switch to Shardeum network
     * Works with any EIP-1193 provider (MetaMask, WalletConnect, etc)
     */
    static async switchToShardeum(provider: any) {
        try {
            // Check if provider supports wallet_switchEthereumChain
            if (provider.request) {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: BLOCKCHAIN_CONFIG.CHAIN_ID_HEX }],
                });
                return { success: true };
            }

            // If using ethers provider directly
            if (provider.send) {
                await provider.send('wallet_switchEthereumChain', [{ chainId: BLOCKCHAIN_CONFIG.CHAIN_ID_HEX }]);
                return { success: true };
            }

            return { success: false, error: "Provider doesn't support network switching" };
        } catch (error: any) {
            // Network not added, try adding it
            if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
                try {
                    const addParams = [{
                        chainId: BLOCKCHAIN_CONFIG.CHAIN_ID_HEX,
                        chainName: BLOCKCHAIN_CONFIG.CHAIN_NAME,
                        nativeCurrency: {
                            name: 'Shardeum',
                            symbol: BLOCKCHAIN_CONFIG.SYMBOL,
                            decimals: 18
                        },
                        rpcUrls: [BLOCKCHAIN_CONFIG.RPC_URL],
                        blockExplorerUrls: [BLOCKCHAIN_CONFIG.EXPLORER_URL]
                    }];

                    if (provider.request) {
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: addParams
                        });
                    } else if (provider.send) {
                        await provider.send('wallet_addEthereumChain', addParams);
                    }

                    return { success: true };
                } catch (addError: any) {
                    return { success: false, error: addError.message };
                }
            }
            return { success: false, error: error.message };
        }
    }
}
