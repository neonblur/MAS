// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title EconomicModule
 * @notice This contract manages staking and records economic actions from agents.
 */
contract EconomicModule {
    // Staked balances for each agent.
    mapping(address => uint256) public stakes;
    
    event Staked(address indexed agent, uint256 amount);
    event Unstaked(address indexed agent, uint256 amount);
    event EconomicActionExecuted(address indexed agent, string decision);

    /**
     * @notice Allow an agent to stake Ether.
     */
    function stake() public payable {
        require(msg.value > 0, "Stake must be greater than 0");
        stakes[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }
    
    /**
     * @notice Allow an agent to withdraw staked Ether.
     * @param amount The amount to withdraw.
     */
    function unstake(uint256 amount) public {
        require(stakes[msg.sender] >= amount, "Insufficient stake");
        stakes[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @notice Record an economic action.
     * @param decision The decision string that triggered this action.
     */
    function executeEconomicAction(string memory decision) public {
        require(stakes[msg.sender] > 0, "No stake deposited");
        emit EconomicActionExecuted(msg.sender, decision);
    }
}
