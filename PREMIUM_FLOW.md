# 💰 Premium Flow Documentation

## How Money Flows in ParaCipher

### Overview
```
Worker → InsurancePolicy → ClaimPayout → Worker (if claim valid)
 5 SHM      (receives)        (pool)        15 SHM payout
```

---

## Detailed Flow

### Step 1: Worker Buys Coverage
```solidity
// Worker calls buyDailyCoverage() with 5 SHM
insurancePolicy.buyDailyCoverage{ value: 5 ether }()
```

**What happens:**
1. Worker sends 5 SHM transaction to `InsurancePolicy` contract
2. Contract receives 5 SHM
3. Contract creates policy record for worker
4. **Premium stays in InsurancePolicy contract** (for now)

**Contract:** InsurancePolicy.sol
**Lines:** 54-91

---

### Step 2: Premium Pooling (Current Behavior)

**Current Implementation:**
The 5 SHM premium currently **stays in the InsurancePolicy contract**. It is NOT automatically forwarded to ClaimPayout pool.

**To verify:**
```bash
# Check InsurancePolicy balance (will show accumulated premiums)
cast balance $INSURANCE_POLICY_ADDRESS --rpc-url $RPC_URL

# Check ClaimPayout balance (will only show what owner manually funded)
cast balance $CLAIM_PAYOUT_ADDRESS --rpc-url $RPC_URL
```

**Owner can withdraw premiums:**
```solidity
insurancePolicy.withdrawPremiums()  // Sends all collected premiums to owner
```

---

### Step 3: Pool Funding (Manual)

**Current Process:**
ClaimPayout contract must be **manually funded** by owner:

```solidity
claimPayout.fundContract{ value: 100 ether }()
```

**Or via direct transfer:**
```bash
cast send $CLAIM_PAYOUT_ADDRESS --value 100ether --private-key $PRIVATE_KEY
```

---

### Step 4: Claim Payout

When valid claim is filed and approved:

```solidity
// Worker files claim with evidence
claimPayout.fileClaim("notes", evidence)

// Contract validates 8 checks
// If all pass → automatic payout from ClaimPayout pool
```

**What happens:**
1. Smart contract runs 8 validation checks
2. If all pass → marks policy as claimed
3. Sends 15 SHM from ClaimPayout contract to worker
4. Deducts reputation score

**Contract:** ClaimPayout.sol
**Lines:** 334-338 (payout transfer)

---

## Money Flow Diagram

```
┌─────────────┐
│   Worker    │
└──────┬──────┘
       │ 5 SHM (premium)
       ▼
┌─────────────────────┐
│ InsurancePolicy     │
│ Contract            │
│                     │
│ Balance: 5 SHM      │◄─── (Premiums accumulate here)
└─────────────────────┘
       │
       │ (Owner can withdraw)
       ▼
┌─────────────────────┐
│   Owner Wallet      │
└─────────────────────┘



SEPARATE FLOW (Manual Funding):

┌─────────────────────┐
│   Owner Wallet      │
└──────┬──────────────┘
       │ 100 SHM (manual funding)
       ▼
┌─────────────────────┐
│  ClaimPayout        │
│  Contract (Pool)    │
│                     │
│  Balance: 100 SHM   │◄─── (Holds payout funds)
└──────┬──────────────┘
       │ 15 SHM (claim payout)
       ▼
┌─────────────────────┐
│   Worker (claim)    │
└─────────────────────┘
```

---

## Why This Design?

### Current (MVP) Approach:
- ✅ **Simple** - Clear separation of concerns
- ✅ **Flexible** - Owner controls pool funding
- ✅ **Safe** - Premiums secured in InsurancePolicy
- ❌ **Manual** - Requires owner to fund pool
- ❌ **Not Automated** - Premiums don't automatically go to pool

### For Production (Recommended):
Auto-forward premiums to pool:

```solidity
// In InsurancePolicy.buyDailyCoverage()
function buyDailyCoverage() external payable {
    require(msg.value >= PREMIUM, "Insufficient premium");
    
    // Create policy...
    
    // Forward premium to ClaimPayout pool
    (bool success, ) = address(claimPayoutContract).call{value: msg.value}("");
    require(success, "Transfer to pool failed");
}
```

**Benefits:**
- ✅ Automated pooling
- ✅ Self-sustaining system
- ✅ More like traditional insurance
- ✅ Transparent on-chain

---

## Current Smart Contract Status

### InsurancePolicy.sol
```solidity
// Line 54-91: buyDailyCoverage()
// Premium is received but NOT forwarded
// Stays in contract balance
```

**Check if forwarding is implemented:**
```bash
# Search for ClaimPayout reference in InsurancePolicy
grep -n "claimPayout\|ClaimPayout" contracts/InsurancePolicy.sol
```

If NO results → Premium forwarding is NOT implemented

---

## Hackathon Demo Explanation

**For judges, explain:**

> "Currently, the 5 SHM premium goes to the InsurancePolicy contract. The ClaimPayout pool is manually funded by us (the insurance provider) to ensure there's always liquidity for claims.
> 
> In production, we'd implement automatic premium forwarding - every 5 SHM premium would flow directly to the pool, creating a self-sustaining insurance system.
> 
> The separation of contracts allows us to:
> 1. Track policies separately from claims
> 2. Maintain clean accounting
> 3. Easily upgrade the system later
> 
> This is similar to how traditional insurance companies maintain separate reserves for policies versus claims."

---

## Verify on Blockchain

### Check Premium Collection:
```bash
# View InsurancePolicy balance (should have accumulated premiums)
cast balance 0x... --rpc-url https://api-mezame.shardeum.org

# View recent transactions
cast tx <tx_hash> --rpc-url https://api-mezame.shardeum.org
```

### Check Pool Balance:
```bash
# View ClaimPayout balance
cast balance 0x... --rpc-url https://api-mezame.shardeum.org

# Should match manual funding amount
```

### Track Claim Payouts:
```bash
# Check PayoutSent events
cast logs --address $CLAIM_PAYOUT_ADDRESS \
  --event "PayoutSent(address,uint256,uint256)" \
  --rpc-url https://api-mezame.shardeum.org
```

---

## Summary

**Current State:**
- 5 SHM premium → InsurancePolicy contract (stays there)
- ClaimPayout pool → Manually funded by owner
- 15 SHM payout → From ClaimPayout pool to worker

**For Hackathon:**
- This works fine for demo
- Shows understanding of insurance pooling concept
- Owner acts as "insurance company" funding the pool

**For Production:**
- Implement automatic premium forwarding
- Pool becomes self-sustaining
- More decentralized and autonomous
