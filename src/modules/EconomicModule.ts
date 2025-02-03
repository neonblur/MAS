// src/modules/EconomicModule.ts
import logger from "../utils/Logger";
import { Agent } from "../core/Agent";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { WalletModule } from "./WalletModule";

dotenv.config();

export class EconomicModule {
  private agent: Agent;
  private walletModule: WalletModule;
  private economicContract: ethers.Contract;

  private economicAbi = [
    {
      "inputs": [],
      "name": "stake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "decision", "type": "string" }
      ],
      "name": "executeEconomicAction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "name": "stakes",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  constructor(agent: Agent, walletModule: WalletModule) {
    this.agent = agent;
    this.walletModule = walletModule;
    const economicAddress = process.env.ECONOMIC_MODULE_ADDRESS as string;
    this.economicContract = new ethers.Contract(economicAddress, this.economicAbi, this.walletModule.wallet);
  }

  /**
   * Executes an economic action by calling the smart contract.
   * @param decision The decision string.
   */
  public async executeEconomicAction(decision: string): Promise<void> {
    try {
      logger.info(`EconomicModule: Agent ${this.agent.id} executing economic action for decision: ${decision}`);
      const tx = await this.economicContract.executeEconomicAction(decision, { gasLimit: 500000 });
      await tx.wait();
      logger.info(`EconomicModule: Economic action executed successfully.`);
    } catch (error) {
      logger.error(`EconomicModule encountered an error: ${error}`);
      throw error;
    }
  }
}
