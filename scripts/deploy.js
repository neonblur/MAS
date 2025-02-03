// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    const agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.deployed();
    console.log("AgentRegistry deployed to:", agentRegistry.address);
  
    const EconomicModule = await ethers.getContractFactory("EconomicModule");
    const economicModule = await EconomicModule.deploy();
    await economicModule.deployed();
    console.log("EconomicModule deployed to:", economicModule.address);
  
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy([deployer.address]);
    await governance.deployed();
    console.log("Governance deployed to:", governance.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  