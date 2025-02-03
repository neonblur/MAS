// src/modules/DecisionModule.ts
import logger from "../utils/Logger";
import { Agent } from "../core/Agent";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

export class DecisionModule {
  private agent: Agent;
  private openai: OpenAIApi;

  constructor(agent: Agent) {
    this.agent = agent;
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  /**
   * Uses the OpenAI API to generate a decision for the agent.
   */
  public async makeDecision(): Promise<string> {
    try {
      const prompt = `Agent ${this.agent.id} is deciding on its next action.
Available actions: actionA, actionB, actionC.
Please provide the best action choice along with a short explanation.`;
      
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a decision-making assistant for an autonomous agent." },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
        temperature: 0.7,
      });
      
      const decisionText = response.data.choices[0].message?.content?.trim();
      logger.debug(`DecisionModule (LLM): Received decision: ${decisionText}`);
      
      return decisionText || "actionA";
    } catch (error) {
      logger.error(`DecisionModule encountered an error calling OpenAI API: ${error}`);
      return "actionA";
    }
  }
}
