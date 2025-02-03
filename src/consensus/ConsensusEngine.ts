// src/consensus/ConsensusEngine.ts
import logger from "../utils/Logger";
import { Agent } from "../core/Agent";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { WalletModule } from "../modules/WalletModule";

dotenv.config();

export class ConsensusEngine {
  private agent: Agent;
  private walletModule: WalletModule;
  private governanceContract: ethers.Contract;
  private proposalId: number | null = null;

  private governanceAbi = [
    {
      "inputs": [
        { "internalType": "string", "name": "description", "type": "string" }
      ],
      "name": "createProposal",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
      ],
      "name": "executeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
      ],
      "name": "getProposal",
      "outputs": [
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "uint256", "name": "", "type": "uint256" },
        { "internalType": "bool", "name": "", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  constructor(agent: Agent, walletModule: WalletModule) {
    this.agent = agent;
    this.walletModule = walletModule;
    const governanceAddress = process.env.GOVERNANCE_CONTRACT_ADDRESS as string;
    this.governanceContract = new ethers.Contract(governanceAddress, this.governanceAbi, this.walletModule.wallet);
  }

  /**
   * Starts consensus participation: creates a proposal if needed and votes periodically.
   */
  public async start(): Promise<void> {
    try {
      logger.info(`ConsensusEngine: Agent ${this.agent.id} starting consensus participation.`);
      setInterval(async () => {
        try {
          if (this.proposalId === null) {
            const tx = await this.governanceContract.createProposal(`Consensus proposal by ${this.agent.id}`);
            await tx.wait();
            this.proposalId = Number(process.env.CONSENSUS_PROPOSAL_ID) || 0;
            logger.info(`ConsensusEngine: Created new proposal with ID ${this.proposalId}`);
          }
          const voteTx = await this.governanceContract.vote(this.proposalId);
          await voteTx.wait();
          logger.info(`ConsensusEngine: Agent ${this.agent.id} voted on proposal ${this.proposalId}`);
        } catch (err) {
          logger.error(`ConsensusEngine error: ${err}`);
        }
      }, 10000);
    } catch (error) {
      logger.error(`ConsensusEngine encountered an error: ${error}`);
      throw error;
    }
  }
}
