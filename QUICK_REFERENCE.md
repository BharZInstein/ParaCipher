# 🚀 ParaCipher - Quick Reference

## 📍 Deployed Contracts (Shardeum Testnet)

```
InsurancePolicy:  0x3A84E06554876A557b16249619247eF765C35407
ClaimPayout:      0xf678B23d7887d9c9dbc49C2170902d5c88075c2D
ReputationScore:  0x199678E7AF0B7a9f62523563f9eF861e242e944A
```

## 💵 Amounts

- **Premium (Fee):** 5 SHM
- **Coverage:** 150 SHM  
- **Payout:** 150 SHM
- **Duration:** 24 hours

## ⚡ Quick Commands

### Check Deployment
```bash
npx hardhat run scripts/verify-deployment.js --network shardeum
```

### Fund ClaimPayout (IMPORTANT - DO THIS FIRST!)
```bash
# Default: adds 400 SHM
npx hardhat run scripts/fund-claimpayout.js --network shardeum

# Custom amount: adds 500 SHM
ADDITIONAL_FUNDING=500 npx hardhat run scripts/fund-claimpayout.js --network shardeum
```

### Check Your Balance
```bash
npx hardhat run scripts/check-balance.js --network shardeum
```

## ⚠️ IMPORTANT: Fund ClaimPayout First!

The contract currently has **100 SHM** but needs **150 SHM per payout**.

**Run this now:**
```bash
npx hardhat run scripts/fund-claimpayout.js --network shardeum
```

This will add 400 SHM, giving you enough for 3+ claims.

## 🔗 Blockchain Explorer

View all contracts and transactions:
- **Explorer:** https://explorer-mezame.shardeum.org
- **InsurancePolicy:** https://explorer-mezame.shardeum.org/address/0x3A84E06554876A557b16249619247eF765C35407
- **ClaimPayout:** https://explorer-mezame.shardeum.org/address/0xf678B23d7887d9c9dbc49C2170902d5c88075c2D
- **ReputationScore:** https://explorer-mezame.shardeum.org/address/0x199678E7AF0B7a9f62523563f9eF861e242e944A

## 📱 For Your Mobile App

Update your config with:
```typescript
const SHARDEUM_CONTRACTS = {
  insurancePolicy: "0x3A84E06554876A557b16249619247eF765C35407",
  claimPayout: "0xf678B23d7887d9c9dbc49C2170902d5c88075c2D",
  reputationScore: "0x199678E7AF0B7a9f62523563f9eF861e242e944A",
  chainId: 8119,
  rpcUrl: "https://api-mezame.shardeum.org",
  explorer: "https://explorer-mezame.shardeum.org"
};

const AMOUNTS = {
  premium: "5",      // SHM
  coverage: "150",   // SHM
  payout: "150"      // SHM
};
```

## 🎯 What Changed

| Item | Before | After |
|------|--------|-------|
| Premium | 25 MATIC | **5 SHM** |
| Coverage | 50 MATIC | **150 SHM** |
| Payout | 50 MATIC | **150 SHM** |
| Network | Polygon Mumbai | **Shardeum** |

## ✅ Next Steps

1. ⚠️ **Fund ClaimPayout** - Run `fund-claimpayout.js` 
2. Update mobile app with contract addresses
3. Test buying coverage (5 SHM)
4. Test filing and approving claims (150 SHM payout)

---

**Last Updated:** January 12, 2026  
**Network:** Shardeum EVM Testnet (Mezame)
