
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StakingRewards
 * @dev Allows staking AirNode fractions to earn rewards
 */
contract StakingRewards is ERC1155Holder, ReentrancyGuard, Ownable {
    // AirNode NFT contract interface
    IERC1155 public nftContract;
    
    // Reward token (could be ANA token or another ERC20)
    IERC20 public rewardToken;
    
    // Staking period options (in seconds)
    uint256 public constant PERIOD_30_DAYS = 30 days;
    uint256 public constant PERIOD_90_DAYS = 90 days;
    uint256 public constant PERIOD_180_DAYS = 180 days;
    uint256 public constant PERIOD_365_DAYS = 365 days;
    
    // Reward rate multipliers (basis points) based on staking period
    mapping(uint256 => uint256) public periodRewardMultiplier;
    
    // Base reward rate (tokens per day per fraction)
    uint256 public baseRewardRate = 100 * 10**18; // 100 tokens per day
    
    struct StakedFraction {
        uint256 tokenId;
        uint256 fractionId;
        address owner;
        uint256 stakingPeriod;
        uint256 stakedAt;
        uint256 lastRewardClaimTime;
        bool isStaked;
    }
    
    // Mapping from staking ID to staked fraction
    mapping(uint256 => StakedFraction) public stakedFractions;
    uint256 private nextStakingId = 1;
    
    // Mapping from token ID to airnode earnings
    mapping(uint256 => uint256) public airnodeEarnings;
    
    // Events
    event FractionStaked(
        uint256 stakingId,
        uint256 tokenId,
        uint256 fractionId,
        address owner,
        uint256 stakingPeriod,
        uint256 stakedAt
    );
    
    event FractionUnstaked(uint256 stakingId, address owner);
    event RewardsClaimed(uint256 stakingId, address owner, uint256 amount);
    event RewardsDeposited(uint256 tokenId, uint256 amount);
    
    constructor(address _nftContractAddress, address _rewardTokenAddress) Ownable(msg.sender) {
        nftContract = IERC1155(_nftContractAddress);
        rewardToken = IERC20(_rewardTokenAddress);
        
        // Set up reward multipliers
        periodRewardMultiplier[PERIOD_30_DAYS] = 10000; // 1x (base rate)
        periodRewardMultiplier[PERIOD_90_DAYS] = 11000; // 1.1x
        periodRewardMultiplier[PERIOD_180_DAYS] = 12500; // 1.25x
        periodRewardMultiplier[PERIOD_365_DAYS] = 15000; // 1.5x
    }
    
    /**
     * @dev Stakes an AirNode fraction
     * @param tokenId The token ID of the AirNode NFT
     * @param fractionId The fraction ID within the token
     * @param stakingPeriod The staking period in seconds (must be one of the predefined periods)
     */
    function stakeNFT(
        uint256 tokenId,
        uint256 fractionId,
        uint256 stakingPeriod
    ) external nonReentrant {
        require(
            stakingPeriod == PERIOD_30_DAYS ||
            stakingPeriod == PERIOD_90_DAYS ||
            stakingPeriod == PERIOD_180_DAYS ||
            stakingPeriod == PERIOD_365_DAYS,
            "Invalid staking period"
        );
        
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this token");
        
        uint256 stakingId = nextStakingId++;
        
        // Transfer the NFT to the staking contract
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        
        stakedFractions[stakingId] = StakedFraction({
            tokenId: tokenId,
            fractionId: fractionId,
            owner: msg.sender,
            stakingPeriod: stakingPeriod,
            stakedAt: block.timestamp,
            lastRewardClaimTime: block.timestamp,
            isStaked: true
        });
        
        emit FractionStaked(
            stakingId,
            tokenId,
            fractionId,
            msg.sender,
            stakingPeriod,
            block.timestamp
        );
    }
    
    /**
     * @dev Unstakes an AirNode fraction
     * @param stakingId The ID of the staking to end
     */
    function unstakeNFT(uint256 stakingId) external nonReentrant {
        StakedFraction storage fraction = stakedFractions[stakingId];
        
        require(fraction.isStaked, "Not staked");
        require(fraction.owner == msg.sender, "Not owner");
        require(
            block.timestamp >= fraction.stakedAt + fraction.stakingPeriod,
            "Staking period not over"
        );
        
        // Claim any pending rewards
        _claimRewards(stakingId);
        
        fraction.isStaked = false;
        
        // Return the NFT to the owner
        nftContract.safeTransferFrom(address(this), fraction.owner, fraction.tokenId, 1, "");
        
        emit FractionUnstaked(stakingId, msg.sender);
    }
    
    /**
     * @dev Claims rewards for a staked fraction
     * @param stakingId The ID of the staking
     */
    function claimRewards(uint256 stakingId) external nonReentrant {
        StakedFraction storage fraction = stakedFractions[stakingId];
        
        require(fraction.isStaked, "Not staked");
        require(fraction.owner == msg.sender, "Not owner");
        
        _claimRewards(stakingId);
    }
    
    /**
     * @dev Internal function to calculate and transfer rewards
     * @param stakingId The ID of the staking
     */
    function _claimRewards(uint256 stakingId) internal {
        StakedFraction storage fraction = stakedFractions[stakingId];
        
        uint256 rewardAmount = calculateRewards(stakingId);
        
        if (rewardAmount > 0) {
            fraction.lastRewardClaimTime = block.timestamp;
            
            // Transfer rewards to the staker
            require(rewardToken.transfer(fraction.owner, rewardAmount), "Reward transfer failed");
            
            emit RewardsClaimed(stakingId, fraction.owner, rewardAmount);
        }
    }
    
    /**
     * @dev Calculates pending rewards for a staked fraction
     * @param stakingId The ID of the staking
     * @return The amount of rewards
     */
    function calculateRewards(uint256 stakingId) public view returns (uint256) {
        StakedFraction storage fraction = stakedFractions[stakingId];
        
        if (!fraction.isStaked) {
            return 0;
        }
        
        // Get the time elapsed since last claim
        uint256 timeElapsed = block.timestamp - fraction.lastRewardClaimTime;
        
        // Calculate base rewards
        uint256 baseRewards = (baseRewardRate * timeElapsed) / 1 days;
        
        // Apply staking period multiplier
        uint256 adjustedRewards = (baseRewards * periodRewardMultiplier[fraction.stakingPeriod]) / 10000;
        
        // Apply airnode earnings multiplier
        if (airnodeEarnings[fraction.tokenId] > 0) {
            // Simplified: 1% of airnode earnings per day for each fraction
            uint256 earningsRewards = (airnodeEarnings[fraction.tokenId] * timeElapsed) / (100 days);
            adjustedRewards += earningsRewards;
        }
        
        return adjustedRewards;
    }
    
    /**
     * @dev Deposits rewards from airnode earnings
     * @param tokenId The token ID of the AirNode
     * @param amount The amount of earnings to deposit
     */
    function depositRewards(uint256 tokenId, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from caller to contract
        require(rewardToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update earnings for the airnode
        airnodeEarnings[tokenId] += amount;
        
        emit RewardsDeposited(tokenId, amount);
    }
    
    /**
     * @dev Returns the claimable rewards for a staked fraction
     * @param stakingId The ID of the staking
     * @return The amount of claimable rewards
     */
    function getClaimableRewards(uint256 stakingId) external view returns (uint256) {
        return calculateRewards(stakingId);
    }
    
    /**
     * @dev Updates the base reward rate
     * @param _baseRewardRate New base reward rate
     */
    function setBaseRewardRate(uint256 _baseRewardRate) external onlyOwner {
        baseRewardRate = _baseRewardRate;
    }
    
    /**
     * @dev Updates a reward multiplier for a specific period
     * @param period The staking period
     * @param multiplier The new multiplier (in basis points, 10000 = 1x)
     */
    function setRewardMultiplier(uint256 period, uint256 multiplier) external onlyOwner {
        require(
            period == PERIOD_30_DAYS ||
            period == PERIOD_90_DAYS ||
            period == PERIOD_180_DAYS ||
            period == PERIOD_365_DAYS,
            "Invalid staking period"
        );
        
        require(multiplier >= 10000, "Multiplier cannot be less than 1x");
        
        periodRewardMultiplier[period] = multiplier;
    }
    
    /**
     * @dev Updates the NFT contract address
     * @param _nftContractAddress New NFT contract address
     */
    function setNFTContract(address _nftContractAddress) external onlyOwner {
        nftContract = IERC1155(_nftContractAddress);
    }
    
    /**
     * @dev Updates the reward token address
     * @param _rewardTokenAddress New reward token address
     */
    function setRewardToken(address _rewardTokenAddress) external onlyOwner {
        rewardToken = IERC20(_rewardTokenAddress);
    }
}
