// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AirNodeNFT.sol";

/**
 * @title AirNodeFractionalization
 * @dev Enhanced contract for fractionalizing AirNode NFTs with marketplace integration
 */
contract AirNodeFractionalization is ERC721Holder, Ownable, ReentrancyGuard {
    // Struct to store fraction details
    struct FractionDetails {
        uint256 nftId;
        address fractionToken;
        uint256 totalFractions;
        uint256 availableFractions;
        uint256 pricePerFraction;
        bool isListed;
        string name;
        string location;
        string imageUrl;
        uint256 uptime;
        uint256 earnings;
        uint256 roi;
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
    event FractionsSold(string fractionId, address buyer, uint256 quantity);

    constructor(address _airNodeNFTAddress) Ownable(msg.sender) {
        airNodeNFT = AirNodeNFT(_airNodeNFTAddress);
    }

    /**
     * @dev Fractionalize an AirNode NFT with enhanced metadata
     */
    function fractionalizeNFT(
        uint256 nftId,
        uint256 fractionCount,
        uint256 pricePerFraction
    ) public onlyOwner nonReentrant returns (string memory) {
        require(airNodeNFT.ownerOf(nftId) == msg.sender, "You don't own this NFT");
        
        // Get metadata
        AirNodeNFT.AirNodeMetadata memory metadata = airNodeNFT.getAirNodeMetadata(nftId);
        require(!metadata.fractionalized, "NFT already fractionalized");
        
        // Transfer NFT to this contract
        airNodeNFT.safeTransferFrom(msg.sender, address(this), nftId);
        
        // Mark as fractionalized
        airNodeNFT.markFractionalized(nftId);
        
        // Create fraction token
        string memory fractionId = string(abi.encodePacked(metadata.airNodeId, "-fractions"));
        
        // Deploy new ERC20 token
        AirNodeFractionToken fractionToken = new AirNodeFractionToken(
            string(abi.encodePacked("AirNode ", metadata.name, " Fraction")),
            string(abi.encodePacked("ANF-", metadata.airNodeId)),
            fractionCount
        );
        
        // Store enhanced fraction details
        fractions[fractionId] = FractionDetails({
            nftId: nftId,
            fractionToken: address(fractionToken),
            totalFractions: fractionCount,
            availableFractions: fractionCount,
            pricePerFraction: pricePerFraction,
            isListed: false,
            name: metadata.name,
            location: metadata.location,
            imageUrl: metadata.imageUrl,
            uptime: metadata.uptime,
            earnings: metadata.earnings,
            roi: metadata.roi
        });
        
        fractionIds.push(fractionId);
        
        emit NFTFractionalized(fractionId, nftId, address(fractionToken), fractionCount, pricePerFraction);
        
        return fractionId;
    }

    /**
     * @dev Set price per fraction
     */
    function setPricePerFraction(string memory fractionId, uint256 newPrice) public onlyOwner {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        
        fractions[fractionId].pricePerFraction = newPrice;
        
        emit FractionPriceUpdated(fractionId, newPrice);
    }

    /**
     * @dev List fractions on marketplace
     */
    function listFractions(string memory fractionId, bool isListed) public onlyOwner {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        
        fractions[fractionId].isListed = isListed;
        
        emit FractionsListed(fractionId, isListed);
    }

    /**
     * @dev Get all fraction IDs
     */
    function getAllFractionIds() public view returns (string[] memory) {
        return fractionIds;
    }

    /**
     * @dev Get all listed fractions for marketplace
     */
    function getListedFractions() public view returns (string[] memory) {
        uint256 listedCount = 0;
        
        // Count listed fractions
        for (uint256 i = 0; i < fractionIds.length; i++) {
            if (fractions[fractionIds[i]].isListed && fractions[fractionIds[i]].availableFractions > 0) {
                listedCount++;
            }
        }
        
        // Create array of listed fraction IDs
        string[] memory listedFractions = new string[](listedCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < fractionIds.length; i++) {
            if (fractions[fractionIds[i]].isListed && fractions[fractionIds[i]].availableFractions > 0) {
                listedFractions[currentIndex] = fractionIds[i];
                currentIndex++;
            }
        }
        
        return listedFractions;
    }

    /**
     * @dev Get fraction details
     */
    function getFractionDetails(string memory fractionId) public view returns (FractionDetails memory) {
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        return fractions[fractionId];
    }

    /**
     * @dev Update available fractions after purchase
     */
    function updateAvailableFractions(string memory fractionId, uint256 soldQuantity) external {
        require(msg.sender == owner(), "Not authorized");
        require(fractions[fractionId].fractionToken != address(0), "Fraction does not exist");
        require(fractions[fractionId].availableFractions >= soldQuantity, "Not enough fractions available");
        
        fractions[fractionId].availableFractions -= soldQuantity;
        
        emit FractionsSold(fractionId, msg.sender, soldQuantity);
    }
}

/**
 * @title AirNodeFractionToken
 * @dev Enhanced ERC20 token representing fractions of an AirNode NFT
 */
contract AirNodeFractionToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Mint additional tokens (for admin use)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from specific address (with approval)
     */
    function burnFrom(address account, uint256 amount) public {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }
}