
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AirNodeNFT
 * @dev ERC1155 token for representing fractionalized AirNodes
 * Each token ID represents a unique AirNode, and the amount represents the number of fractions
 */
contract AirNodeNFT is ERC1155, Ownable {
    using Strings for uint256;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping from token ID to AirNode ID
    mapping(uint256 => string) public airNodeIds;
    
    // Mapping from token ID to NFT metadata
    mapping(uint256 => NFTMetadata) public metadata;
    
    // Mapping from token ID to total supply
    mapping(uint256 => uint256) public totalSupply;
    
    // Next token ID
    uint256 private _nextTokenId = 1;
    
    // Struct to store AirNode metadata
    struct NFTMetadata {
        string airNodeId;
        string location;
        Performance performance;
        uint256 fractions;
    }
    
    struct Performance {
        uint256 uptime;
        uint256 earnings;
        uint256 roi;
    }
    
    event NFTMinted(uint256 tokenId, string airNodeId, uint256 fractions);
    event MetadataUpdated(uint256 tokenId, NFTMetadata metadata);
    
    constructor() ERC1155("") Ownable(msg.sender) {}
    
    /**
     * @dev Mints a new AirNode NFT
     * @param airNodeId The unique ID of the AirNode
     * @param fractionCount Total number of fractions to mint
     * @param metadataURI URI for the token metadata
     * @param _metadata AirNode metadata
     */
    function mintNFT(
        string memory airNodeId,
        uint256 fractionCount,
        string memory metadataURI,
        NFTMetadata memory _metadata
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _mint(msg.sender, tokenId, fractionCount, "");
        _setTokenURI(tokenId, metadataURI);
        
        airNodeIds[tokenId] = airNodeId;
        metadata[tokenId] = _metadata;
        totalSupply[tokenId] = fractionCount;
        
        emit NFTMinted(tokenId, airNodeId, fractionCount);
        
        return tokenId;
    }
    
    /**
     * @dev Updates metadata for an existing AirNode NFT
     * @param tokenId The ID of the token to update
     * @param _metadata New AirNode metadata
     */
    function updateMetadata(uint256 tokenId, NFTMetadata memory _metadata) external onlyOwner {
        require(totalSupply[tokenId] > 0, "Token does not exist");
        
        metadata[tokenId] = _metadata;
        
        emit MetadataUpdated(tokenId, _metadata);
    }
    
    /**
     * @dev Burns fractions of an AirNode NFT
     * @param tokenId The ID of the token to burn
     * @param amount The amount of fractions to burn
     */
    function burnNFT(uint256 tokenId, uint256 amount) external {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
        
        _burn(msg.sender, tokenId, amount);
        totalSupply[tokenId] -= amount;
    }
    
    /**
     * @dev Sets the URI for a token
     * @param tokenId The ID of the token
     * @param tokenURI The URI for the token metadata
     */
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }
    
    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId The ID of the token
     * @return The URI of the token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(totalSupply[tokenId] > 0, "URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        
        // If there's no specific URI, return the base URI
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }
        
        return super.uri(tokenId);
    }
    
    /**
     * @dev Returns the owner of a specific fraction NFT
     * This is a simplified version - in practice would need to track owners of specific fraction IDs
     */
    function getFractionOwner(uint256 tokenId, uint256 fractionId) external view returns (address) {
        require(fractionId < totalSupply[tokenId], "Fraction does not exist");
        // This is simplified. In a real implementation, we would track individual fraction ownership
        return balanceOf(msg.sender, tokenId) > 0 ? msg.sender : address(0);
    }
}
