// src/index.ts
import express from "express";
import { Agent } from "./core/Agent";
import logger from "./utils/Logger";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Observability dashboard endpoints
app.get("/", (_req, res) => {
  res.send("AetherMAS Observability Dashboard is running.");
});

app.get("/status", (_req, res) => {
  res.json({ status: "running", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  logger.info(`Observability dashboard listening at http://localhost:${PORT}`);
});

// Create and run an agent instance.
const agent = new Agent("agent-001");

// Optionally, load additional custom modules using agent.loadModule(...)

agent.run().catch((error) => {
  logger.error(`Error running agent: ${error}`);
});
