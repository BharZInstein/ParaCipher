# 🚀 Quick Local Demo - One Command

## Fastest Way:

```bash
./scripts/quick-local-setup.sh
```

That's it! This will:
1. ✅ Start Hardhat node (if not running)
2. ✅ Deploy all contracts
3. ✅ Fund the ClaimPayout pool
4. ✅ Show you the contract addresses

## Or use Node.js version:

```bash
node scripts/start-local-demo.js
```

## Contract Addresses (Just Deployed):

- **InsurancePolicy**: `0x0165878A594ca255338adfa4d48449f69242Eb8F`
- **ClaimPayout**: `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`
- **ReputationScore**: `0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6`

## Network Info:

- **RPC URL**: `http://172.16.44.115:8545` (or `http://localhost:8545`)
- **Chain ID**: `31337`
- **Symbol**: `ETH` (local testnet)

## Stop Hardhat Node:

```bash
pkill -f 'hardhat node'
```

## Test Contracts:

```bash
npx hardhat run scripts/test-contracts.js --network localhost
```


