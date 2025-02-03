// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title AgentRegistry
 * @notice This contract allows agents to register and update their reputation.
 */
contract AgentRegistry {
    struct AgentInfo {
        address agentAddress;
        uint256 reputation;
        bool registered;
    }
    
    mapping(string => AgentInfo) public agents;

    event AgentRegistered(string indexed agentId, address indexed agentAddress);
    event ReputationUpdated(string indexed agentId, uint256 newReputation);

    /**
     * @notice Register a new agent.
     * @param agentId A unique identifier for the agent.
     */
    function registerAgent(string memory agentId) public {
        require(!agents[agentId].registered, "Agent already registered");
        agents[agentId] = AgentInfo(msg.sender, 0, true);
        emit AgentRegistered(agentId, msg.sender);
    }
    
    /**
     * @notice Update the reputation of a registered agent.
     * @param agentId The unique identifier for the agent.
     * @param newReputation The new reputation score.
     */
    function updateReputation(string memory agentId, uint256 newReputation) public {
        require(agents[agentId].registered, "Agent not registered");
        require(msg.sender == agents[agentId].agentAddress, "Unauthorized");
        agents[agentId].reputation = newReputation;
        emit ReputationUpdated(agentId, newReputation);
    }
    
    /**
     * @notice Retrieve the information for a given agent.
     * @param agentId The unique identifier for the agent.
     * @return agentAddress, reputation, and registration status.
     */
    function getAgentInfo(string memory agentId) public view returns (address, uint256, bool) {
        AgentInfo memory info = agents[agentId];
        return (info.agentAddress, info.reputation, info.registered);
    }
}
