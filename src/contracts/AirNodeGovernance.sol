
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AirNodeGovernance
 * @dev Governance system for AirNode Alliance
 */
contract AirNodeGovernance is ReentrancyGuard, Ownable {
    // AirNode NFT contract interface
    IERC1155 public nftContract;
    
    // Minimum voting time (in seconds)
    uint256 public minVotingPeriod = 3 days;
    
    // Maximum voting time (in seconds)
    uint256 public maxVotingPeriod = 14 days;
    
    // Quorum percentage required for proposal to pass (in basis points, e.g., 3000 = 30%)
    uint256 public quorumPercentage = 3000;
    
    // Execution delay after proposal passes (in seconds)
    uint256 public executionDelay = 2 days;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votingDeadline;
        uint256 executionTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool cancelled;
        mapping(address => mapping(uint256 => bool)) hasVoted; // voter -> tokenId -> hasVoted
    }
    
    // Mapping from proposal ID to proposal
    mapping(uint256 => Proposal) public proposals;
    uint256 private nextProposalId = 1;
    
    // Total voting power across all fractions
    uint256 public totalVotingPower;
    
    // Events
    event ProposalCreated(uint256 proposalId, address proposer, string description, uint256 votingDeadline);
    event VoteCast(uint256 proposalId, address voter, uint256 tokenId, bool inFavor, uint256 votingPower);
    event ProposalExecuted(uint256 proposalId);
    event ProposalCancelled(uint256 proposalId);
    
    constructor(address _nftContractAddress) Ownable(msg.sender) {
        nftContract = IERC1155(_nftContractAddress);
    }
    
    /**
     * @dev Creates a new proposal
     * @param description Description of the proposal
     * @param votingPeriod Voting period in seconds
     */
    function submitProposal(string memory description, uint256 votingPeriod) external returns (uint256) {
        require(votingPeriod >= minVotingPeriod && votingPeriod <= maxVotingPeriod, "Invalid voting period");
        
        uint256 proposalId = nextProposalId++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.votingDeadline = block.timestamp + votingPeriod;
        proposal.executionTime = 0;
        
        emit ProposalCreated(proposalId, msg.sender, description, proposal.votingDeadline);
        
        return proposalId;
    }
    
    /**
     * @dev Casts a vote on a proposal using an AirNode fraction
     * @param proposalId ID of the proposal
     * @param tokenId The token ID representing the AirNode
     * @param inFavor Whether the vote is in favor of the proposal
     */
    function vote(uint256 proposalId, uint256 tokenId, bool inFavor) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp < proposal.votingDeadline, "Voting has ended");
        require(!proposal.cancelled, "Proposal has been cancelled");
        require(!proposal.executed, "Proposal has been executed");
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this token");
        require(!proposal.hasVoted[msg.sender][tokenId], "Already voted with this token");
        
        // Mark as voted
        proposal.hasVoted[msg.sender][tokenId] = true;
        
        // Calculate voting power based on token
        uint256 votingPower = getVotingPower(tokenId);
        
        // Record vote
        if (inFavor) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, tokenId, inFavor, votingPower);
    }
    
    /**
     * @dev Executes a proposal if it has passed
     * @param proposalId ID of the proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Proposal has already been executed");
        require(!proposal.cancelled, "Proposal has been cancelled");
        require(block.timestamp > proposal.votingDeadline, "Voting has not ended");
        
        // Check if proposal meets quorum
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        bool quorumReached = (totalVotes * 10000) / totalVotingPower >= quorumPercentage;
        
        require(quorumReached, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");
        
        if (proposal.executionTime == 0) {
            // Set execution time if not already set
            proposal.executionTime = block.timestamp + executionDelay;
            return;
        }
        
        require(block.timestamp >= proposal.executionTime, "Execution delay not met");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
        
        // In a real implementation, this would execute the proposed action
        // For example, it could call a function on another contract
    }
    
    /**
     * @dev Cancels a proposal
     * @param proposalId ID of the proposal
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Proposal has already been executed");
        require(!proposal.cancelled, "Proposal has already been cancelled");
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Only proposer or owner can cancel"
        );
        
        proposal.cancelled = true;
        
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Returns the voting power for a token
     * @param tokenId The token ID
     * @return The voting power
     */
    function getVotingPower(uint256 tokenId) public view returns (uint256) {
        // In a real implementation, voting power could be derived from token properties
        // For simplicity, we'll say each token has 1 vote
        uint256 balance = nftContract.balanceOf(msg.sender, tokenId);
        return balance > 0 ? 1 : 0;
    }
    
    /**
     * @dev Updates the NFT contract address
     * @param _nftContractAddress New NFT contract address
     */
    function setNFTContract(address _nftContractAddress) external onlyOwner {
        nftContract = IERC1155(_nftContractAddress);
    }
    
    /**
     * @dev Updates governance parameters
     * @param _minVotingPeriod New minimum voting period
     * @param _maxVotingPeriod New maximum voting period
     * @param _quorumPercentage New quorum percentage (in basis points)
     * @param _executionDelay New execution delay
     */
    function updateGovernanceParams(
        uint256 _minVotingPeriod,
        uint256 _maxVotingPeriod,
        uint256 _quorumPercentage,
        uint256 _executionDelay
    ) external onlyOwner {
        require(_minVotingPeriod <= _maxVotingPeriod, "Min period must be <= max period");
        require(_quorumPercentage <= 10000, "Quorum cannot exceed 100%");
        
        minVotingPeriod = _minVotingPeriod;
        maxVotingPeriod = _maxVotingPeriod;
        quorumPercentage = _quorumPercentage;
        executionDelay = _executionDelay;
    }
    
    /**
     * @dev Updates the total voting power
     * @param _totalVotingPower New total voting power
     */
    function setTotalVotingPower(uint256 _totalVotingPower) external onlyOwner {
        totalVotingPower = _totalVotingPower;
    }
}
