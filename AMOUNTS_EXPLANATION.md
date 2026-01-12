# 💰 ParaCipher Amounts Explained

## 📖 What is "Coverage"?

**Coverage** = The maximum amount of money you're insured for.

Think of it like this:
- **Premium** (5 SHM) = What you PAY to get insurance
- **Coverage** (15 SHM) = The maximum amount you're PROTECTED for
- **Payout** (15 SHM) = What you RECEIVE if you file a claim

In your case, **Coverage and Payout are the same** (15 SHM). This means:
- Customer pays **5 SHM** to buy insurance
- They get **15 SHM of coverage** (protection)
- If they have an accident and file a claim, they receive **15 SHM** (payout)

---

## 🔧 What I Fixed

### Before (Deployed Contracts - WRONG):
- ❌ Premium: 5 SHM ✅ (this was correct)
- ❌ Coverage: **150 SHM** ❌ (should be 15 SHM)
- ❌ Payout: **150 SHM** ❌ (should be 15 SHM)

### After (Source Code - CORRECT):
- ✅ Premium: **5 SHM** (what customer pays)
- ✅ Coverage: **15 SHM** (maximum insured amount)
- ✅ Payout: **15 SHM** (what customer receives)

---

## 📝 Changes Made

I updated the contract source code:

1. **InsurancePolicy.sol:**
   - `PREMIUM_AMOUNT`: 2 ether → **5 ether** (5 SHM)
   - `COVERAGE_AMOUNT`: 10 ether → **15 ether** (15 SHM)

2. **ClaimPayout.sol:**
   - `PAYOUT_AMOUNT`: 10 ether → **15 ether** (15 SHM)

3. **deploy.js:**
   - Updated deployment summary to show correct amounts

---

## ⚠️ IMPORTANT: You Need to Redeploy!

The **deployed contracts on Shardeum still have the wrong values** (150 SHM). 

You have two options:

### Option 1: Redeploy New Contracts (Recommended)
```bash
# Compile the updated contracts
npx hardhat compile

# Deploy new contracts with correct amounts
npx hardhat run scripts/deploy.js --network shardeum
```

This will create **new contract addresses** with the correct amounts (5 SHM premium, 15 SHM payout).

### Option 2: Keep Current Contracts
If you want to keep using the current deployed contracts (with 150 SHM), you'll need to:
- Update your mobile app to use 150 SHM instead of 15 SHM
- Fund ClaimPayout with more SHM (it needs 150 SHM per claim)

---

## 💡 Why the Mismatch?

The deployed contracts show 150 SHM because:
1. Someone modified the contracts before deploying (changed 15 to 150)
2. OR the contracts were deployed from a different version of the code
3. OR there was a typo during deployment

The source code I just fixed now matches what you want: **5 SHM premium, 15 SHM payout**.

---

## 📊 Summary

| Term | Amount | Meaning |
|------|--------|---------|
| **Premium** | 5 SHM | What customer pays to buy insurance |
| **Coverage** | 15 SHM | Maximum amount they're insured for |
| **Payout** | 15 SHM | What they receive when claim is approved |

**Coverage = Payout** in your system (both are 15 SHM).

---

## 🚀 Next Steps

1. ✅ Source code is now correct (5 SHM premium, 15 SHM payout)
2. ⚠️ You need to **redeploy** to get contracts with correct amounts
3. 📱 Update your mobile app with new contract addresses after redeployment

---

**Questions?** The key point: **Coverage** is just the insurance amount limit. In your case, it equals the payout amount (15 SHM).

