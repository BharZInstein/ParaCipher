# 🚀 Run Contracts Locally - Simple Commands

## Option 1: Two Commands (Recommended)

**Terminal 1** - Start Hardhat node:
```bash
npm run local
```
or
```bash
npx hardhat node --hostname 0.0.0.0
```

**Terminal 2** - Deploy contracts:
```bash
npm run local:deploy
```
or
```bash
FUNDING_AMOUNT=100 npx hardhat run scripts/deploy.js --network localhost
```

---

## Option 2: One Command (Background)

```bash
npx hardhat node --hostname 0.0.0.0 & sleep 5 && FUNDING_AMOUNT=100 npx hardhat run scripts/deploy.js --network localhost
```

---

## Option 3: Use the Setup Script

```bash
./scripts/quick-local-setup.sh
```

---

## Quick Test

After deployment, test the contracts:
```bash
npx hardhat run scripts/test-contracts.js --network localhost
```

---

## Network Info

- **RPC URL**: `http://localhost:8545` (or `http://YOUR_IP:8545`)
- **Chain ID**: `31337`
- **Symbol**: `ETH` (test tokens)

## Stop Node

```bash
pkill -f 'hardhat node'
```


