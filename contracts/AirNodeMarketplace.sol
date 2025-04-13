
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AirNodeFractionalization.sol";

/**
 * @title AirNodeMarketplace
 * @dev Marketplace for buying and selling AirNode fractions
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
     * @dev List fractions for sale
     * @param fractionId ID of the fraction to list
     * @param price Price per fraction
     * @param quantity Number of fractions to list
     * @return listingId ID of the created listing
     */
    function listFractionForSale(
        string memory fractionId,
        uint256 price,
        uint256 quantity
    ) public nonReentrant returns (uint256) {
        AirNodeFractionalization.FractionDetails memory details = fractionalization.getFractionDetails(fractionId);
        require(details.isListed, "Fraction not available for listing");
        
        IERC20 fractionToken = IERC20(details.fractionToken);
        require(fractionToken.balanceOf(msg.sender) >= quantity, "Insufficient fractions");
        
        // Transfer tokens to this contract
        require(fractionToken.transferFrom(msg.sender, address(this), quantity), "Transfer failed");
        
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
     * @dev Buy fractions
     * @param listingId ID of the listing
     * @param quantity Number of fractions to buy
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
        
        // Transfer fractions to buyer
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
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) public nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender || msg.sender == owner(), "Not authorized");
        require(listing.isActive, "Listing already inactive");
        
        // Mark as inactive
        listing.isActive = false;
        
        // Return fractions to seller
        AirNodeFractionalization.FractionDetails memory details = fractionalization.getFractionDetails(listing.fractionId);
        IERC20 fractionToken = IERC20(details.fractionToken);
        require(fractionToken.transfer(listing.seller, listing.quantity), "Transfer failed");
        
        emit ListingCancelled(listingId);
    }

    /**
     * @dev Set platform fee percentage
     * @param newFeePercent New fee percentage (in basis points)
     */
    function setPlatformFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }

    /**
     * @dev Withdraw platform fees
     * @param to Address to send fees to
     */
    function withdrawFees(address payable to) public onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        to.transfer(balance);
    }

    /**
     * @dev Get active listings count
     * @return Number of active listings
     */
    function getActiveListingsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].isActive) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Get all listings
     * @return Array of listings
     */
    function getAllListings() public view returns (Listing[] memory) {
        return listings;
    }
}
