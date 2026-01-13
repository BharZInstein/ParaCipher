#!/bin/bash

# Quick Local Setup - ParaCipher Contracts
# This script starts Hardhat node and deploys contracts automatically

echo "🚀 ParaCipher - Quick Local Setup"
echo "=================================="
echo ""

# Check if Hardhat node is already running
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Hardhat node already running on port 8545"
    echo "   Skipping node start..."
else
    echo "📦 Starting Hardhat node..."
    npx hardhat node --hostname 0.0.0.0 > /tmp/hardhat-node.log 2>&1 &
    HARDHAT_PID=$!
    echo "   ✅ Hardhat node started (PID: $HARDHAT_PID)"
    echo "   ⏳ Waiting for node to be ready..."
    sleep 5
fi

echo ""
echo "📋 Deploying contracts..."
FUNDING_AMOUNT=100 npx hardhat run scripts/deploy.js --network localhost

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📌 Contract Addresses:"
cat deployment-addresses.json | grep -A 3 '"contracts"' | head -4
echo ""
echo "💡 Your IP: $(hostname -I 2>/dev/null | awk '{print $1}' || echo 'localhost')"
echo "   RPC URL: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'localhost'):8545"
echo ""
echo "🔗 To stop Hardhat node: pkill -f 'hardhat node'"
echo ""


