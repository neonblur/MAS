// src/modules/WalletModule.ts
import { ethers, Wallet, providers } from "ethers";
import dotenv from "dotenv";
import logger from "../utils/Logger";

dotenv.config();

export class WalletModule {
  public wallet: Wallet;
  public provider: providers.JsonRpcProvider;

  constructor() {
    const rpcUrl = process.env.RPC_URL as string;
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const privateKey = process.env.PRIVATE_KEY as string;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not set in the environment variables");
    }
    this.wallet = new Wallet(privateKey, this.provider);
    logger.info(`WalletModule: Wallet initialized for address ${this.wallet.address}`);
  }

  /**
   * Signs a given message.
   * @param message The message to sign.
   * @returns The signature.
   */
  public async signMessage(message: string): Promise<string> {
    try {
      const signature = await this.wallet.signMessage(message);
      logger.debug(`WalletModule: Message signed: ${signature}`);
      return signature;
    } catch (error) {
      logger.error(`WalletModule: Failed to sign message: ${error}`);
      throw error;
    }
  }

  /**
   * Returns the wallet's balance in Ether.
   */
  public async getBalance(): Promise<string> {
    try {
      const balance = await this.wallet.getBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      logger.error(`WalletModule: Failed to get balance: ${error}`);
      throw error;
    }
  }

  /**
   * Sends a signed transaction.
   * @param tx The transaction request.
   */
  public async sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse> {
    try {
      const response = await this.wallet.sendTransaction(tx);
      logger.info(`WalletModule: Transaction sent: ${response.hash}`);
      return response;
    } catch (error) {
      logger.error(`WalletModule: Failed to send transaction: ${error}`);
      throw error;
    }
  }
}
