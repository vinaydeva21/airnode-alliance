
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AirNodeNFT.sol";

/**
 * @title AirNodeFractionalization
 * @dev Contract for fractionalizing AirNode NFTs into ERC20 tokens
 */
contract AirNodeFractionalization is ERC721Holder, Ownable {
    // Struct to store fraction details
    struct FractionDetails {
        uint256 nftId;
        address fractionToken;
        uint256 totalFractions;
        uint256 availableFractions;
        uint256 pricePerFraction;
        bool isListed;
    }

    // NFT contract
    AirNodeNFT public airNodeNFT;
    
    // Mapping of fractionID to fraction details
    mapping(string => FractionDetails) public fractions;
    
    // Array to store all fraction IDs
    string[] public fractionIds;
    
    // Events
    event NFTFractionalized(string fractionId, uint256 nftId, address fractionToken, uint256 totalFractions, uint256 pricePerFraction);
    event FractionPriceUpdated(string fractionId, uint256 newPrice);
    event FractionsListed(string fractionId, bool isListed);

    constructor(address _airNodeNFTAddress) Ownable(msg.sender) {
        airNodeNFT = AirNodeNFT(_airNodeNFTAddress);
    }

    /**
     * @dev Fractionalize an AirNode NFT
     * @param nftId ID of the NFT to fractionalize
     * @param fractionCount Number of fractions to create
     * @param pricePerFraction Initial price per fraction
     * @return fractionId ID of the created fraction
     */
    function fractionalizeNFT(
        uint256 nftId,
        uint256 fractionCount,
        uint256 pricePerFraction
    ) public onlyOwner returns (string memory) {
        require(airNodeNFT.ownerOf(nftId) == msg.sender, "You don't own this NFT");
        
        // Get metadata
        AirNodeNFT.AirNodeMetadata memory metadata = airNodeNFT.getAirNodeMetadata(nftId);
        require(!metadata.fractionalized, "NFT already fractionalized");
        
        // Transfer NFT to this contract
        airNodeNFT.safeTransferFrom(msg.sender, address(this), nftId);
        
        // Mark as fractionalized
        airNodeNFT.markFractionalized(nftId);
        
        // Create fraction token
        string memory airNodeId = metadata.airNodeId;
        string memory fractionId = string(abi.encodePacked(airNodeId, "-fractions"));
        
        // Deploy new ERC20 token
        AirNodeFractionToken fractionToken = new AirNodeFractionToken(
            string(abi.encodePacked("AirNode ", airNodeId, " Fraction")),
            string(abi.encodePacked("ANF-", airNodeId)),
            fractionCount
        );
        
        // Store fraction details
        fractions[fractionId] = FractionDetails({
            nftId: nftId,
            fractionToken: address(fractionToken),
            totalFractions: fractionCount,
            availableFractions: fractionCount,
            pricePerFraction: pricePerFraction,
            isListed: false
        });
        
        fractionIds.push(fractionId);
        
        emit NFTFractionalized(fractionId, nftId, address(fractionToken), fractionCount, pricePerFraction);
        
        return fractionId;
    }

    /**
     * @dev Set price per fraction
     * @param fractionId ID of the fraction
     * @param newPrice New price per fraction
     */
    function setPricePerFraction(string memory fractionId, uint256 newPrice) public onlyOwner {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        
        fractions[fractionId].pricePerFraction = newPrice;
        
        emit FractionPriceUpdated(fractionId, newPrice);
    }

    /**
     * @dev List fractions on marketplace
     * @param fractionId ID of the fraction
     * @param isListed Whether the fraction is listed
     */
    function listFractions(string memory fractionId, bool isListed) public onlyOwner {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        
        fractions[fractionId].isListed = isListed;
        
        emit FractionsListed(fractionId, isListed);
    }

    /**
     * @dev Get all fraction IDs
     * @return Array of fraction IDs
     */
    function getAllFractionIds() public view returns (string[] memory) {
        return fractionIds;
    }

    /**
     * @dev Get fraction details
     * @param fractionId ID of the fraction
     * @return FractionDetails struct
     */
    function getFractionDetails(string memory fractionId) public view returns (FractionDetails memory) {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        return fractions[fractionId];
    }
}

/**
 * @title AirNodeFractionToken
 * @dev ERC20 token representing fractions of an AirNode NFT
 */
contract AirNodeFractionToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
}
