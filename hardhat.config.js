require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: process.env.RPC_URL || "http://127.0.0.1:8545"
    },
    // Add testnet or mainnet configurations as needed.
  },
  solidity: "0.8.28"
};
