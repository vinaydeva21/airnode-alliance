
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AirNodeNFT
 * @dev AirNode NFT contract for minting NFTs representing AirNodes
 */
contract AirNodeNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Struct to store AirNode metadata
    struct AirNodeMetadata {
        string airNodeId;
        string location;
        uint256 uptime;
        uint256 earnings;
        uint256 roi;
        bool fractionalized;
        uint256 totalFractions;
    }

    // Mapping from token ID to AirNode metadata
    mapping(uint256 => AirNodeMetadata) public airNodeMetadata;
    
    // Events
    event AirNodeMinted(uint256 indexed tokenId, string airNodeId, address owner, string metadataURI);
    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);

    constructor() ERC721("AirNode NFT", "ANFT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new AirNode NFT
     * @param to The address that will own the minted token
     * @param airNodeId Unique identifier for this AirNode
     * @param location Physical location of the AirNode
     * @param uptime Uptime percentage (scaled by 10)
     * @param earnings Daily earnings in USD (scaled by 100)
     * @param roi Return on investment percentage (scaled by 10)
     * @param totalFractions Number of fractions to create
     * @param metadataURI Token URI for off-chain metadata
     * @return The ID of the newly minted token
     */
    function mintAirNode(
        address to,
        string memory airNodeId,
        string memory location,
        uint256 uptime,
        uint256 earnings,
        uint256 roi,
        uint256 totalFractions,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store AirNode metadata
        airNodeMetadata[tokenId] = AirNodeMetadata({
            airNodeId: airNodeId,
            location: location,
            uptime: uptime,
            earnings: earnings,
            roi: roi,
            fractionalized: false,
            totalFractions: totalFractions
        });

        emit AirNodeMinted(tokenId, airNodeId, to, metadataURI);
        return tokenId;
    }

    /**
     * @dev Update metadata URI for a token
     * @param tokenId ID of the token to update
     * @param newMetadataURI New token URI
     */
    function updateMetadata(uint256 tokenId, string memory newMetadataURI) public onlyOwner {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        _setTokenURI(tokenId, newMetadataURI);
        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    /**
     * @dev Mark an AirNode as fractionalized
     * @param tokenId ID of the token to fractionalize
     */
    function markFractionalized(uint256 tokenId) external {
        require(msg.sender == owner() || msg.sender == address(0), "Not authorized");
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        airNodeMetadata[tokenId].fractionalized = true;
    }

    /**
     * @dev Check if a token exists
     * @param tokenId ID of the token to query
     * @return bool indicating if the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Get AirNode metadata
     * @param tokenId ID of the token to query
     * @return AirNodeMetadata struct
     */
    function getAirNodeMetadata(uint256 tokenId) public view returns (AirNodeMetadata memory) {
        require(_exists(tokenId), "AirNodeNFT: Token does not exist");
        return airNodeMetadata[tokenId];
    }
}
