// src/modules/OversightModule.ts
import logger from "../utils/Logger";
import { Agent } from "../core/Agent";

/**
 * Checks if a decision complies with established policies.
 */
export class OversightModule {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  /**
   * Evaluates whether the decision is approved.
   * For demonstration, "actionA" is approved automatically; others are randomized.
   * @param decision The decision to evaluate.
   * @returns True if approved.
   */
  public async checkPolicy(decision: string): Promise<boolean> {
    try {
      if (decision === "actionA") {
        logger.debug("OversightModule: actionA approved by default");
        return true;
      } else {
        const approved = Math.random() > 0.5;
        logger.debug(`OversightModule: ${decision} ${approved ? "approved" : "rejected"}`);
        return approved;
      }
    } catch (error) {
      logger.error(`OversightModule encountered an error: ${error}`);
      return false;
    }
  }
}
