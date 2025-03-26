
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DelegationPool
 * @dev Allows users to delegate their fractions to operators who run AirNodes
 */
contract DelegationPool is ReentrancyGuard, Ownable {
    // AirNode NFT contract
    IERC1155 public nftContract;
    
    // Reward token
    IERC20 public rewardToken;
    
    // Minimum delegation period
    uint256 public minDelegationPeriod = 30 days;
    
    // Registered operators
    mapping(address => bool) public registeredOperators;
    
    // Operator performance metrics
    mapping(address => OperatorPerformance) public operatorPerformance;
    
    struct OperatorPerformance {
        uint256 totalDelegated;
        uint256 uptime;      // Percentage in basis points (10000 = 100%)
        uint256 earnings;    // Total earnings generated
        uint256 roi;         // Return on investment in basis points
    }
    
    struct Delegation {
        uint256 tokenId;
        uint256 fractionId;
        address delegator;
        address operator;
        uint256 startTime;
        uint256 endTime;
        uint256 lastRewardTime;
        bool active;
    }
    
    // Mapping from delegation ID to delegation
    mapping(uint256 => Delegation) public delegations;
    uint256 private nextDelegationId = 1;
    
    // Events
    event OperatorRegistered(address operator);
    event OperatorRemoved(address operator);
    event FractionDelegated(
        uint256 delegationId,
        uint256 tokenId,
        uint256 fractionId,
        address delegator,
        address operator,
        uint256 startTime,
        uint256 endTime
    );
    event DelegationEnded(uint256 delegationId);
    event RewardsClaimed(uint256 delegationId, address delegator, uint256 amount);
    event PerformanceUpdated(address operator, uint256 uptime, uint256 earnings, uint256 roi);
    
    constructor(address _nftContractAddress, address _rewardTokenAddress) Ownable(msg.sender) {
        nftContract = IERC1155(_nftContractAddress);
        rewardToken = IERC20(_rewardTokenAddress);
    }
    
    /**
     * @dev Registers an operator
     */
    function registerOperator() external {
        require(!registeredOperators[msg.sender], "Already registered");
        
        registeredOperators[msg.sender] = true;
        
        emit OperatorRegistered(msg.sender);
    }
    
    /**
     * @dev Removes an operator
     * @param operator Address of the operator to remove
     */
    function removeOperator(address operator) external onlyOwner {
        require(registeredOperators[operator], "Not registered");
        
        registeredOperators[operator] = false;
        
        emit OperatorRemoved(operator);
    }
    
    /**
     * @dev Delegates a fraction to an operator
     * @param tokenId The token ID of the AirNode NFT
     * @param fractionId The fraction ID within the token
     * @param operator The address of the operator
     * @param delegationPeriod The period of delegation in seconds
     */
    function delegateFraction(
        uint256 tokenId,
        uint256 fractionId,
        address operator,
        uint256 delegationPeriod
    ) external nonReentrant {
        require(registeredOperators[operator], "Not a registered operator");
        require(delegationPeriod >= minDelegationPeriod, "Delegation period too short");
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this token");
        
        uint256 delegationId = nextDelegationId++;
        
        // Transfer the NFT to the delegation contract
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        
        delegations[delegationId] = Delegation({
            tokenId: tokenId,
            fractionId: fractionId,
            delegator: msg.sender,
            operator: operator,
            startTime: block.timestamp,
            endTime: block.timestamp + delegationPeriod,
            lastRewardTime: block.timestamp,
            active: true
        });
        
        // Update operator performance
        operatorPerformance[operator].totalDelegated++;
        
        emit FractionDelegated(
            delegationId,
            tokenId,
            fractionId,
            msg.sender,
            operator,
            block.timestamp,
            block.timestamp + delegationPeriod
        );
    }
    
    /**
     * @dev Ends a delegation
     * @param delegationId The ID of the delegation to end
     */
    function endDelegation(uint256 delegationId) external nonReentrant {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.active, "Not active");
        require(
            msg.sender == delegation.delegator || 
            block.timestamp >= delegation.endTime, 
            "Not authorized or period not over"
        );
        
        // Claim any pending rewards
        _claimRewards(delegationId);
        
        delegation.active = false;
        
        // Return the NFT to the delegator
        nftContract.safeTransferFrom(address(this), delegation.delegator, delegation.tokenId, 1, "");
        
        emit DelegationEnded(delegationId);
    }
    
    /**
     * @dev Claims rewards for a delegation
     * @param delegationId The ID of the delegation
     */
    function claimRewards(uint256 delegationId) external nonReentrant {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.active, "Not active");
        require(delegation.delegator == msg.sender, "Not delegator");
        
        _claimRewards(delegationId);
    }
    
    /**
     * @dev Internal function to calculate and transfer rewards
     * @param delegationId The ID of the delegation
     */
    function _claimRewards(uint256 delegationId) internal {
        Delegation storage delegation = delegations[delegationId];
        
        if (!delegation.active) {
            return;
        }
        
        OperatorPerformance storage performance = operatorPerformance[delegation.operator];
        
        // Calculate rewards based on operator performance
        uint256 timeElapsed = block.timestamp - delegation.lastRewardTime;
        
        // Apply operator performance metrics to calculate rewards
        // This is a simplified calculation; in reality, it would depend on actual performance
        uint256 baseReward = 100 * 10**18; // Base reward rate (100 tokens per day)
        uint256 performanceMultiplier = performance.roi > 0 ? performance.roi : 10000; // 1x multiplier if no ROI
        
        uint256 rewardAmount = (baseReward * timeElapsed * performanceMultiplier) / (1 days * 10000);
        
        if (rewardAmount > 0) {
            delegation.lastRewardTime = block.timestamp;
            
            // Transfer rewards to the delegator
            require(rewardToken.transfer(delegation.delegator, rewardAmount), "Reward transfer failed");
            
            emit RewardsClaimed(delegationId, delegation.delegator, rewardAmount);
        }
    }
    
    /**
     * @dev Updates operator performance metrics
     * @param operator The address of the operator
     * @param uptime The uptime percentage (in basis points)
     * @param earnings The earnings amount
     * @param roi The ROI percentage (in basis points)
     */
    function updateOperatorPerformance(
        address operator,
        uint256 uptime,
        uint256 earnings,
        uint256 roi
    ) external onlyOwner {
        require(registeredOperators[operator], "Not a registered operator");
        require(uptime <= 10000, "Uptime cannot exceed 100%");
        
        operatorPerformance[operator].uptime = uptime;
        operatorPerformance[operator].earnings = earnings;
        operatorPerformance[operator].roi = roi;
        
        emit PerformanceUpdated(operator, uptime, earnings, roi);
    }
    
    /**
     * @dev Gets all active delegations for an operator
     * @param operator The address of the operator
     * @return Array of delegation IDs
     */
    function getOperatorDelegations(address operator) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count delegations for this operator
        for (uint256 i = 1; i < nextDelegationId; i++) {
            if (delegations[i].active && delegations[i].operator == operator) {
                count++;
            }
        }
        
        // Create and populate array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i < nextDelegationId; i++) {
            if (delegations[i].active && delegations[i].operator == operator) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Updates contract parameters
     * @param _minDelegationPeriod New minimum delegation period
     */
    function setMinDelegationPeriod(uint256 _minDelegationPeriod) external onlyOwner {
        minDelegationPeriod = _minDelegationPeriod;
    }
}
