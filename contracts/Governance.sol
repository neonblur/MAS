// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Governance
 * @notice A simple governance contract for agent consensus.
 */
contract Governance {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
    }
    
    Proposal[] public proposals;
    mapping(address => bool) public approvedAgents; // Agents allowed to vote

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address indexed voter);
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @notice Constructor that initializes the list of approved agents.
     * @param initialAgents An array of agent addresses that are allowed to participate.
     */
    constructor(address[] memory initialAgents) {
        for (uint i = 0; i < initialAgents.length; i++) {
            approvedAgents[initialAgents[i]] = true;
        }
    }
    
    /**
     * @notice Create a new proposal.
     * @param description A description of the proposal.
     * @return The proposal ID.
     */
    function createProposal(string memory description) public returns (uint256) {
        require(approvedAgents[msg.sender], "Not authorized to create proposals");
        proposals.push(Proposal(description, 0, false));
        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, description);
        return proposalId;
    }
    
    /**
     * @notice Vote on an existing proposal.
     * @param proposalId The ID of the proposal to vote on.
     */
    function vote(uint256 proposalId) public {
        require(approvedAgents[msg.sender], "Not authorized to vote");
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage prop = proposals[proposalId];
        require(!prop.executed, "Proposal already executed");
        prop.voteCount += 1;
        emit Voted(proposalId, msg.sender);
    }
    
    /**
     * @notice Execute a proposal if it has sufficient votes.
     * @param proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 proposalId) public {
        require(approvedAgents[msg.sender], "Not authorized to execute proposals");
        Proposal storage prop = proposals[proposalId];
        require(!prop.executed, "Already executed");
        // For demonstration, require at least 1 vote.
        require(prop.voteCount >= 1, "Not enough votes");
        prop.executed = true;
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @notice Retrieve details of a proposal.
     * @param proposalId The ID of the proposal.
     * @return description, voteCount, and executed status.
     */
    function getProposal(uint256 proposalId) public view returns (string memory, uint256, bool) {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal memory prop = proposals[proposalId];
        return (prop.description, prop.voteCount, prop.executed);
    }
}
