require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        // Local Hardhat network
        hardhat: {
            chainId: 31337,
            // Optionally set a higher gas limit for testing
            gas: 12000000,
            blockGasLimit: 12000000,
            // Give test accounts more MATIC
            accounts: {
                count: 10,
                accountsBalance: "10000000000000000000000" // 10,000 MATIC
            }
        },

        // Localhost (for running against `npx hardhat node`)
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        },

        // Polygon Mumbai Testnet
        polygon_mumbai: {
            url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
            chainId: 80001,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            gasPrice: 20000000000 // 20 gwei
        },

        // Polygon Mainnet (be careful!)
        polygon: {
            url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
            chainId: 137,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            gasPrice: 50000000000 // 50 gwei
        },

        // Shardeum EVM Testnet (Mezame)
        shardeum: {
            url: process.env.SHARDEUM_RPC_URL || "https://api-mezame.shardeum.org",
            chainId: 8119,
            accounts: process.env.SHARDEUM_PRIVATE_KEY
                ? [process.env.SHARDEUM_PRIVATE_KEY]
                : process.env.PRIVATE_KEY
                    ? [process.env.PRIVATE_KEY]
                    : [],
            // Let the network suggest gas price; override here if needed
        }
    },

    // Etherscan/Polygonscan verification
    etherscan: {
        apiKey: {
            polygon: process.env.POLYGONSCAN_API_KEY || "",
            polygonMumbai: process.env.POLYGONSCAN_API_KEY || ""
        }
    },

    // Path configuration
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },

    // Mocha test configuration
    mocha: {
        timeout: 40000
    }
};
