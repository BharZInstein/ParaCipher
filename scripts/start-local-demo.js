const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

console.log("🚀 ParaCipher - Quick Local Demo Setup");
console.log("=".repeat(50));
console.log("");

// Start Hardhat node in background
console.log("📦 Starting Hardhat node...");
const hardhatNode = spawn('npx', ['hardhat', 'node', '--hostname', '0.0.0.0'], {
    stdio: 'pipe',
    shell: true,
    detached: true
});

hardhatNode.stdout.on('data', (data) => {
    if (data.toString().includes('Started HTTP')) {
        console.log("   ✅ Hardhat node ready!");
        console.log("");
        deployContracts();
    }
});

hardhatNode.stderr.on('data', (data) => {
    // Ignore stderr for cleaner output
});

// Wait a bit then deploy
setTimeout(() => {
    if (!deployed) {
        deployContracts();
    }
}, 5000);

let deployed = false;

function deployContracts() {
    if (deployed) return;
    deployed = true;

    console.log("📋 Deploying contracts...");
    console.log("");

    exec('FUNDING_AMOUNT=100 npx hardhat run scripts/deploy.js --network localhost', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Deployment error: ${error.message}`);
            return;
        }

        console.log(stdout);
        
        // Extract contract addresses
        const addresses = stdout.match(/0x[a-fA-F0-9]{40}/g);
        if (addresses) {
            console.log("=".repeat(50));
            console.log("✅ DEPLOYMENT COMPLETE!");
            console.log("=".repeat(50));
            console.log("");
            console.log("📌 Contract Addresses:");
            console.log("   InsurancePolicy:  " + addresses[0]);
            console.log("   ClaimPayout:      " + addresses[1]);
            console.log("   ReputationScore:  " + addresses[2]);
            console.log("");
            
            // Get IP address
            exec('hostname -I 2>/dev/null | awk \'{print $1}\' || echo localhost', (err, ip) => {
                const ipAddress = ip.trim();
                console.log("🌐 Network Info:");
                console.log("   RPC URL: http://" + ipAddress + ":8545");
                console.log("   Chain ID: 31337");
                console.log("");
                console.log("💡 To connect MetaMask:");
                console.log("   1. Add network: http://" + ipAddress + ":8545");
                console.log("   2. Chain ID: 31337");
                console.log("   3. Import test account (private key from Hardhat)");
                console.log("");
                console.log("🛑 To stop: Press Ctrl+C or run: pkill -f 'hardhat node'");
                console.log("");
            });
        }
    });
}

// Handle cleanup
process.on('SIGINT', () => {
    console.log("\n\n🛑 Shutting down...");
    process.kill(-hardhatNode.pid);
    process.exit();
});


