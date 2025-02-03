// src/core/Agent.ts
import logger from "../utils/Logger";
import { CommunicationModule } from "../modules/CommunicationModule";
import { DecisionModule } from "../modules/DecisionModule";
import { OversightModule } from "../modules/OversightModule";
import { ConsensusEngine } from "../consensus/ConsensusEngine";
import { EconomicModule } from "../modules/EconomicModule";
import { WalletModule } from "../modules/WalletModule";

/**
 * Interface for pluggable agent modules.
 */
export interface AgentModule {
  init(agent: Agent): void;
}

/**
 * The main Agent class which instantiates and orchestrates all the modules.
 */
export class Agent {
  public id: string;
  public modules: { [key: string]: AgentModule } = {};

  public communication: CommunicationModule;
  public decision: DecisionModule;
  public oversight: OversightModule;
  public consensus: ConsensusEngine;
  public economic: EconomicModule;
  public wallet: WalletModule;

  constructor(id: string) {
    this.id = id;
    logger.info(`Initializing agent ${id}`);

    // Instantiate the wallet module first so it can be shared.
    this.wallet = new WalletModule();

    this.communication = new CommunicationModule(this);
    this.decision = new DecisionModule(this);
    this.oversight = new OversightModule(this);
    this.consensus = new ConsensusEngine(this, this.wallet);
    this.economic = new EconomicModule(this, this.wallet);
  }

  /**
   * Dynamically loads and initializes a custom module.
   * @param name Unique module name.
   * @param module The module instance implementing AgentModule.
   */
  public loadModule(name: string, module: AgentModule): void {
    try {
      module.init(this);
      this.modules[name] = module;
      logger.info(`Loaded module: ${name}`);
    } catch (error) {
      logger.error(`Failed to load module ${name}: ${error}`);
    }
  }

  /**
   * Starts the agent's processes: communication, consensus, and decision-making loop.
   */
  public async run(): Promise<void> {
    try {
      logger.info(`Agent ${this.id} starting...`);
      await Promise.all([this.communication.start(), this.consensus.start()]);

      // Main decision loop (runs every 5 seconds)
      setInterval(async () => {
        try {
          const decision = await this.decision.makeDecision();
          logger.info(`Agent ${this.id} made decision: ${decision}`);
  
          const approved = await this.oversight.checkPolicy(decision);
          if (approved) {
            logger.info(`Agent ${this.id} executing decision: ${decision}`);
            await this.economic.executeEconomicAction(decision);
          } else {
            logger.warn(`Agent ${this.id} decision rejected by oversight.`);
          }
        } catch (err) {
          logger.error(`Error in decision loop for agent ${this.id}: ${err}`);
        }
      }, 5000);
    } catch (error) {
      logger.error(`Agent ${this.id} failed to start: ${error}`);
    }
  }
}
