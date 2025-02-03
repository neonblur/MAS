// src/modules/CommunicationModule.ts
import logger from "../utils/Logger";
import { Agent } from "../core/Agent";
import { createLibp2p, Libp2p } from "libp2p";
import { Noise } from "@chainsafe/libp2p-noise";
import { TCP } from "@libp2p/tcp";
import { Mplex } from "@libp2p/mplex";
import { multiaddr } from "multiaddr";

/**
 * Handles peer-to-peer communications for an agent.
 */
export class CommunicationModule {
  private agent: Agent;
  private libp2pNode: Libp2p | null = null;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  /**
   * Initializes and starts the libp2p node.
   */
  public async start(): Promise<void> {
    try {
      this.libp2pNode = await createLibp2p({
        transports: [new TCP()],
        connectionEncryption: [new Noise()],
        streamMuxers: [new Mplex()]
      });

      this.libp2pNode.addEventListener("peer:connect", (evt: any) => {
        logger.info(`Agent ${this.agent.id} connected to peer: ${evt.detail.remotePeer.toString()}`);
      });

      await this.libp2pNode.start();
      const addrs = this.libp2pNode.getMultiaddrs().map(addr => addr.toString());
      logger.info(`Agent ${this.agent.id} communication module started. Listening on addresses: ${addrs.join(", ")}`);
    } catch (error) {
      logger.error(`Agent ${this.agent.id} failed to start communication module: ${error}`);
      throw error;
    }
  }

  /**
   * Sends a JSON message to a specific peer.
   * @param peerId The target peer identifier.
   * @param message The message payload.
   */
  public async sendMessage(peerId: string, message: Record<string, unknown>): Promise<void> {
    if (!this.libp2pNode) {
      logger.error("Libp2p node is not started");
      return;
    }
    try {
      const msgString = JSON.stringify({
        from: this.agent.id,
        timestamp: new Date().toISOString(),
        payload: message
      });
      logger.info(`Agent ${this.agent.id} sending message to ${peerId}: ${msgString}`);

      const protocol = "/aethermas/1.0.0";
      const peerAddr = multiaddr(`/ip4/127.0.0.1/tcp/15002/p2p/${peerId}`);
      const { stream } = await this.libp2pNode.dialProtocol(peerAddr, protocol);
      const data = Buffer.from(msgString);
      await stream.sink([data]);
    } catch (error) {
      logger.error(`Agent ${this.agent.id} failed to send message: ${error}`);
    }
  }
}
