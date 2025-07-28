// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AirNodeNFT
 * @dev Enhanced AirNode NFT contract with additional features for marketplace integration
 */
contract AirNodeNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    // Struct to store AirNode metadata
    struct AirNodeMetadata {
        string airNodeId;
        string name;
        string location;
        string imageUrl;
        uint256 uptime;
        uint256 earnings;
        uint256 roi;
        bool fractionalized;
        uint256 totalFractions;
        uint256 pricePerShare;
        bool isActive;
    }

    // Mapping from token ID to AirNode metadata
    mapping(uint256 => AirNodeMetadata) public airNodeMetadata;
    
    // Array to track all minted token IDs
    uint256[] public allTokenIds;
    
    // Events
    event AirNodeMinted(uint256 indexed tokenId, string airNodeId, string name, address owner, string metadataURI);
    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);

    constructor() ERC721("AirNode NFT", "ANFT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new AirNode NFT with enhanced metadata
     */
    function mintAirNode(
        address to,
        string memory airNodeId,
        string memory name,
        string memory location,
        string memory imageUrl,
        uint256 uptime,
        uint256 earnings,
        uint256 roi,
        uint256 totalFractions,
        uint256 pricePerShare,
        string memory metadataURI
    ) public onlyOwner nonReentrant returns (uint256) {
        require(to != address(0), "AirNodeNFT: mint to zero address");
        require(bytes(airNodeId).length > 0, "AirNodeNFT: airNodeId cannot be empty");
        require(bytes(name).length > 0, "AirNodeNFT: name cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store enhanced AirNode metadata
        airNodeMetadata[tokenId] = AirNodeMetadata({
            airNodeId: airNodeId,
            name: name,
            location: location,
            imageUrl: imageUrl,
            uptime: uptime,
            earnings: earnings,
            roi: roi,
            fractionalized: false,
            totalFractions: totalFractions,
            pricePerShare: pricePerShare,
            isActive: true
        });

        allTokenIds.push(tokenId);
        emit AirNodeMinted(tokenId, airNodeId, name, to, metadataURI);
        return tokenId;
    }

    /**
     * @dev Update NFT price per share
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) public onlyOwner {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        airNodeMetadata[tokenId].pricePerShare = newPrice;
        emit PriceUpdated(tokenId, newPrice);
    }

    /**
     * @dev Mark an AirNode as fractionalized
     */
    function markFractionalized(uint256 tokenId) external {
        require(msg.sender == owner(), "AirNodeNFT: Not authorized");
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        airNodeMetadata[tokenId].fractionalized = true;
    }

    /**
     * @dev Get all minted NFTs
     */
    function getAllMintedNFTs() public view returns (uint256[] memory) {
        return allTokenIds;
    }

    /**
     * @dev Get all active NFTs (that can be fractionalized/listed)
     */
    function getActiveNFTs() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active NFTs
        for (uint256 i = 0; i < allTokenIds.length; i++) {
            if (airNodeMetadata[allTokenIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active token IDs
        uint256[] memory activeTokens = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allTokenIds.length; i++) {
            if (airNodeMetadata[allTokenIds[i]].isActive) {
                activeTokens[currentIndex] = allTokenIds[i];
                currentIndex++;
            }
        }
        
        return activeTokens;
    }

    /**
     * @dev Get total number of minted NFTs
     */
    function getTotalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if a token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Set active status for an AirNode
     */
    function setActiveStatus(uint256 tokenId, bool status) external onlyOwner {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        airNodeMetadata[tokenId].isActive = status;
    }

    /**
     * @dev Update AirNode performance metrics
     */
    function updatePerformance(
        uint256 tokenId,
        uint256 uptime,
        uint256 earnings,
        uint256 roi
    ) external onlyOwner {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        airNodeMetadata[tokenId].uptime = uptime;
        airNodeMetadata[tokenId].earnings = earnings;
        airNodeMetadata[tokenId].roi = roi;
    }

    /**
     * @dev Get AirNode metadata
     */
    function getAirNodeMetadata(uint256 tokenId) public view returns (AirNodeMetadata memory) {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        return airNodeMetadata[tokenId];
    }

    /**
     * @dev Update metadata URI for a token
     */
    function updateMetadata(uint256 tokenId, string memory newMetadataURI) public onlyOwner {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        _setTokenURI(tokenId, newMetadataURI);
        emit MetadataUpdated(tokenId, newMetadataURI);
    }
}