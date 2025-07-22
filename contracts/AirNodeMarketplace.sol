// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AirNodeFractionalization.sol";

/**
 * @title AirNodeMarketplace
 * @dev Enhanced marketplace for buying and selling AirNode fractions with real-time updates
 */
contract AirNodeMarketplace is Ownable, ReentrancyGuard {
    // Struct to store listing details
    struct Listing {
        string fractionId;
        address seller;
        uint256 price;
        uint256 quantity;
        uint256 listingTime;
        bool isActive;
    }

    // Fractionalization contract
    AirNodeFractionalization public fractionalization;
    
    // Array to store all listings
    Listing[] public listings;
    
    // Mapping to track user purchases
    mapping(address => mapping(string => uint256)) public userFractionBalances;
    
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeePercent = 250;
    
    // Events
    event FractionListed(uint256 indexed listingId, string fractionId, address seller, uint256 price, uint256 quantity);
    event FractionSold(uint256 indexed listingId, string fractionId, address buyer, address seller, uint256 quantity, uint256 price);
    event ListingCancelled(uint256 indexed listingId);
    event PlatformFeeUpdated(uint256 newFeePercent);

    constructor(address _fractionalizationAddress) Ownable(msg.sender) {
        fractionalization = AirNodeFractionalization(_fractionalizationAddress);
    }

    /**
     * @dev List fractions for sale (Admin only - for initial listing)
     */
    function listFractionForSale(
        string memory fractionId,
        uint256 price,
        uint256 quantity
    ) public onlyOwner nonReentrant returns (uint256) {
        AirNodeFractionalization.FractionDetails memory details = fractionalization.getFractionDetails(fractionId);
        require(details.isListed, "Fraction not available for listing");
        require(details.availableFractions >= quantity, "Not enough fractions available");
        
        // Create listing
        uint256 listingId = listings.length;
        listings.push(Listing({
            fractionId: fractionId,
            seller: msg.sender,
            price: price,
            quantity: quantity,
            listingTime: block.timestamp,
            isActive: true
        }));
        
        emit FractionListed(listingId, fractionId, msg.sender, price, quantity);
        
        return listingId;
    }

    /**
     * @dev Buy fractions with real-time updates
     */
    function buyFractions(uint256 listingId, uint256 quantity) public payable nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(quantity <= listing.quantity, "Not enough fractions available");
        
        uint256 totalPrice = listing.price * quantity;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Calculate fees
        uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
        uint256 sellerProceeds = totalPrice - platformFee;
        
        // Update listing
        listing.quantity -= quantity;
        if (listing.quantity == 0) {
            listing.isActive = false;
        }
        
        // Update user balance
        userFractionBalances[msg.sender][listing.fractionId] += quantity;
        
        // Update available fractions in fractionalization contract
        fractionalization.updateAvailableFractions(listing.fractionId, quantity);
        
        // Transfer fraction tokens to buyer
        AirNodeFractionalization.FractionDetails memory details = fractionalization.getFractionDetails(listing.fractionId);
        IERC20 fractionToken = IERC20(details.fractionToken);
        require(fractionToken.transfer(msg.sender, quantity), "Transfer failed");
        
        // Transfer funds
        payable(listing.seller).transfer(sellerProceeds);
        
        // Refund excess ETH
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit FractionSold(listingId, listing.fractionId, msg.sender, listing.seller, quantity, listing.price);
    }

    /**
     * @dev Get all available listings for marketplace
     */
    function getMarketplaceListings() public view returns (Listing[] memory) {
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive && listings[i].quantity > 0) {
                activeCount++;
            }
        }
        
        // Create array of active listings
        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive && listings[i].quantity > 0) {
                activeListings[currentIndex] = listings[i];
                currentIndex++;
            }
        }
        
        return activeListings;
    }

    /**
     * @dev Get user's fraction balances
     */
    function getUserFractionBalance(address user, string memory fractionId) public view returns (uint256) {
        return userFractionBalances[user][fractionId];
    }

    /**
     * @dev Get all user's fractions
     */
    function getUserAllFractions(address user) public view returns (string[] memory, uint256[] memory) {
        string[] memory allFractionIds = fractionalization.getAllFractionIds();
        uint256 ownedCount = 0;
        
        // Count owned fractions
        for (uint256 i = 0; i < allFractionIds.length; i++) {
            if (userFractionBalances[user][allFractionIds[i]] > 0) {
                ownedCount++;
            }
        }
        
        // Create arrays of owned fractions
        string[] memory ownedFractionIds = new string[](ownedCount);
        uint256[] memory ownedQuantities = new uint256[](ownedCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allFractionIds.length; i++) {
            uint256 balance = userFractionBalances[user][allFractionIds[i]];
            if (balance > 0) {
                ownedFractionIds[currentIndex] = allFractionIds[i];
                ownedQuantities[currentIndex] = balance;
                currentIndex++;
            }
        }
        
        return (ownedFractionIds, ownedQuantities);
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 listingId) public nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender || msg.sender == owner(), "Not authorized");
        require(listing.isActive, "Listing already inactive");
        
        // Mark as inactive
        listing.isActive = false;
        
        emit ListingCancelled(listingId);
    }

    /**
     * @dev Set platform fee percentage
     */
    function setPlatformFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }

    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees(address payable to) public onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        to.transfer(balance);
    }

    /**
     * @dev Get active listings count
     */
    function getActiveListingsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive && listings[i].quantity > 0) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Get all listings
     */
    function getAllListings() public view returns (Listing[] memory) {
        return listings;
    }
}