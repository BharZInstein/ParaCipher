# 🧪 TESTING EVIDENCE-BASED VERIFICATION

## Quick Test Checklist

### ✅ TEST 1: Valid Claim (Should Pass)

**Description:** File a claim with all valid evidence

**Steps:**
1. Open mobile app
2. Buy coverage (5 SHM)
3. File claim with description
4. Evidence is auto-generated with valid data

**Expected Result:**
- ✅ Transaction succeeds
- ✅ Claim is approved automatically
- ✅ 15 SHM payout sent
- ✅ All 8 validation checks pass

**Evidence Used:**
```javascript
{
  photoIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  gpsLatitude: "13.0827",
  gpsLongitude: "80.2707",
  accidentTimestamp: now - 1 hour,
  policeReportId: "CHN-ACC-2024-XXXX",
  description: "Detailed accident description..."
}
```

---

### ❌ TEST 2: Missing Photo (Should Fail)

**How to Test:**
Edit `/mobile/ParaCipher/services/BlockchainService.ts`:
```typescript
const demoEvidence = {
    photoIpfsHash: "",  // ❌ Make this empty
    gpsLatitude: "13.0827",
    // ...
};
```

**Expected Result:**
- ❌ Transaction fails
- ❌ Error: "Accident photo required - upload photo to IPFS"

---

### ❌ TEST 3: Future Timestamp (Should Fail)

**How to Test:**
Edit timestamp in BlockchainService.ts:
```typescript
accidentTimestamp: Math.floor(Date.now() / 1000) + 1000, // ❌ Future
```

**Expected Result:**
- ❌ Transaction fails
- ❌ Error: "Timestamp cannot be in future - invalid evidence"

---

### ❌ TEST 4: Old Accident (Should Fail)

**How to Test:**
Edit timestamp in BlockchainService.ts:
```typescript
accidentTimestamp: Math.floor(Date.now() / 1000) - (2 * 24 * 3600), // ❌ 2 days ago
```

**Expected Result:**
- ❌ Transaction fails
- ❌ Error: "Accident too old - must file within 24 hours"

---

### ❌ TEST 5: Short Description (Should Fail)

**How to Test:**
Edit description in BlockchainService.ts:
```typescript
description: "Short" // ❌ Less than 10 characters
```

**Expected Result:**
- ❌ Transaction fails
- ❌ Error: "Description too short - minimum 10 characters required"

---

## 🎯 Admin Dashboard Tests

### TEST 1: View Evidence

**Steps:**
1. Open admin dashboard (`/web/paracipher-admin`)
2. Navigate to Claims page
3. Click on a pending claim

**Verify:**
- ✅ Smart contract validation section shows green checkmarks
- ✅ Photo IPFS link works
- ✅ Google Maps link works
- ✅ Timestamp is formatted correctly
- ✅ Police report ID is displayed
- ✅ Description is readable

### TEST 2: IPFS Photo Link

**Steps:**
1. Click "View on IPFS →" link
2. Should open `https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`

**Verify:**
- ✅ IPFS page loads (may take few seconds)
- ✅ Image is displayed (it's a random demo image)

### TEST 3: Google Maps Link

**Steps:**
1. Click "View on Google Maps →" link
2. Should open Google Maps with coordinates

**Verify:**
- ✅ Maps opens to correct location (Chennai, India)
- ✅ Coordinates match evidence

---

## 🚀 Deployment Testing

### After Deploying Updated Contract:

1. **Verify contract on Shardeum Explorer:**
   - Go to https://explorer-sphinx.shardeum.org/
   - Paste ClaimPayout contract address
   - Check contract is verified

2. **Test claim filing:**
   - File a claim from mobile app
   - Check transaction on explorer
   - Verify ClaimFiled event includes evidence

3. **Verify evidence storage:**
   - Call `getClaimEvidence(workerAddress)` from console
   - Verify all evidence fields are populated

---

## 📊 Expected Gas Costs

**With Evidence (New):**
- `fileClaim()`: ~350,000 gas (increased due to evidence storage)

**Without Evidence (Old):**
- `fileClaim()`: ~200,000 gas

**Increase:** ~75% more gas (worth it for fraud prevention!)

---

## 🔍 Debugging Tips

### If claim fails:

1. **Check wallet has enough SHM** for gas
2. **Check you have active coverage** (call `hasValidCoverage()`)
3. **Check contract has enough balance** (call `getContractBalance()`)
4. **Look at revert reason** in transaction

### If evidence doesn't display:

1. Check claim has evidence field populated
2. Call `getClaimEvidence(address)` directly
3. Verify IPFS hash is valid
4. Check GPS coordinates are strings, not numbers

---

## ✅ Success Criteria

Your implementation is working if:

✅ Valid claims are approved automatically  
✅ Invalid claims are rejected with clear error messages  
✅ Admin dashboard displays all evidence correctly  
✅ IPFS links work  
✅ Google Maps links work  
✅ Smart contract validation checks all show green  
✅ Contract compiles without errors  
✅ All 8 validation checks are enforced  

---

## 🎮 Demo Script for Judges

**"Let me show you our evidence-based verification system..."**

1. **"First, on mobile, a worker files a claim"**
   - Show claim screen
   - Point out demo notice
   - Submit claim

2. **"The smart contract validates 8 checks automatically"**
   - Show transaction on explorer
   - Point out gas cost
   - Show ClaimFiled event

3. **"Now let's see the admin dashboard"**
   - Open claims page
   - Click on the claim
   - Show validation checkmarks

4. **"Admin can verify the evidence"**
   - Click IPFS link
   - Click Maps link
   - Read description

5. **"Evidence validation prevents fraud"**
   - Explain 24-hour window
   - Explain coverage period check
   - Explain GPS verification

6. **"This is parametric insurance - automatic payout"**
   - Show approved claim
   - Show payout transaction
   - Emphasize no middleman

---

**Good luck with your hackathon! 🚀**
