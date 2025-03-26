
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AirNodeMarketplace
 * @dev A marketplace for buying, selling, and leasing AirNode fractions
 */
contract AirNodeMarketplace is ERC1155Holder, ReentrancyGuard, Ownable {
    // AirNode NFT contract interface
    IERC1155 public nftContract;
    
    // Fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public feePercentage = 250;
    
    // Listing types
    enum ListingType { Sale, Lease }
    
    struct Listing {
        uint256 tokenId;
        uint256 fractionId;
        address seller;
        uint256 price;
        ListingType listingType;
        uint256 leaseDuration; // Duration in seconds, only for lease listings
        uint256 timestamp;
        bool active;
    }
    
    struct Lease {
        address lessor;
        address lessee;
        uint256 tokenId;
        uint256 fractionId;
        uint256 price;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }
    
    // Listings by ID
    mapping(uint256 => Listing) public listings;
    uint256 private nextListingId = 1;
    
    // Active leases by ID
    mapping(uint256 => Lease) public leases;
    uint256 private nextLeaseId = 1;
    
    // Events
    event ListingCreated(
        uint256 listingId,
        uint256 tokenId,
        uint256 fractionId,
        address seller,
        uint256 price,
        ListingType listingType,
        uint256 leaseDuration
    );
    
    event ListingCancelled(uint256 listingId);
    event ListingSold(uint256 listingId, address buyer);
    event LeaseCreated(
        uint256 leaseId,
        uint256 tokenId,
        uint256 fractionId,
        address lessor,
        address lessee,
        uint256 price,
        uint256 startTime,
        uint256 endTime
    );
    event LeaseEnded(uint256 leaseId);
    
    constructor(address _nftContractAddress) Ownable(msg.sender) {
        nftContract = IERC1155(_nftContractAddress);
    }
    
    /**
     * @dev Lists an AirNode fraction for sale or lease
     * @param tokenId The token ID of the AirNode NFT
     * @param fractionId The fraction ID within the token
     * @param price The price in Ether
     * @param listingType The type of listing (Sale or Lease)
     * @param leaseDuration The duration of the lease in seconds (0 for sales)
     */
    function createListing(
        uint256 tokenId,
        uint256 fractionId,
        uint256 price,
        ListingType listingType,
        uint256 leaseDuration
    ) external nonReentrant {
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this token");
        require(price > 0, "Price must be greater than 0");
        
        if (listingType == ListingType.Lease) {
            require(leaseDuration > 0, "Lease duration must be greater than 0");
        }
        
        uint256 listingId = nextListingId++;
        
        listings[listingId] = Listing({
            tokenId: tokenId,
            fractionId: fractionId,
            seller: msg.sender,
            price: price,
            listingType: listingType,
            leaseDuration: leaseDuration,
            timestamp: block.timestamp,
            active: true
        });
        
        emit ListingCreated(
            listingId,
            tokenId,
            fractionId,
            msg.sender,
            price,
            listingType,
            leaseDuration
        );
        
        // Transfer the NFT to the marketplace contract
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
    }
    
    /**
     * @dev Cancels an active listing
     * @param listingId The ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        
        // Return the NFT to the seller
        nftContract.safeTransferFrom(address(this), listing.seller, listing.tokenId, 1, "");
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Buys a listed AirNode fraction
     * @param listingId The ID of the listing to buy
     */
    function buyFraction(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(listing.listingType == ListingType.Sale, "Listing is not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        listing.active = false;
        
        // Calculate fee
        uint256 fee = (listing.price * feePercentage) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);
        
        // Transfer NFT to buyer
        nftContract.safeTransferFrom(address(this), msg.sender, listing.tokenId, 1, "");
        
        emit ListingSold(listingId, msg.sender);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }
    
    /**
     * @dev Leases a listed AirNode fraction
     * @param listingId The ID of the listing to lease
     */
    function leaseFraction(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(listing.listingType == ListingType.Lease, "Listing is not for lease");
        require(msg.value >= listing.price, "Insufficient payment");
        
        listing.active = false;
        
        // Calculate fee
        uint256 fee = (listing.price * feePercentage) / 10000;
        uint256 lessorAmount = listing.price - fee;
        
        // Transfer payment to lessor
        payable(listing.seller).transfer(lessorAmount);
        
        // Create new lease
        uint256 leaseId = nextLeaseId++;
        leases[leaseId] = Lease({
            lessor: listing.seller,
            lessee: msg.sender,
            tokenId: listing.tokenId,
            fractionId: listing.fractionId,
            price: listing.price,
            startTime: block.timestamp,
            endTime: block.timestamp + listing.leaseDuration,
            active: true
        });
        
        emit LeaseCreated(
            leaseId,
            listing.tokenId,
            listing.fractionId,
            listing.seller,
            msg.sender,
            listing.price,
            block.timestamp,
            block.timestamp + listing.leaseDuration
        );
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }
    
    /**
     * @dev Ends an active lease
     * @param leaseId The ID of the lease to end
     */
    function endLease(uint256 leaseId) external nonReentrant {
        Lease storage lease = leases[leaseId];
        
        require(lease.active, "Lease not active");
        require(
            msg.sender == lease.lessor || 
            msg.sender == lease.lessee || 
            block.timestamp >= lease.endTime, 
            "Not authorized or lease not expired"
        );
        
        lease.active = false;
        
        // Return the NFT to the lessor
        nftContract.safeTransferFrom(address(this), lease.lessor, lease.tokenId, 1, "");
        
        emit LeaseEnded(leaseId);
    }
    
    /**
     * @dev Returns all active listings
     * @return Array of active listing IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }
        
        // Create and populate array
        uint256[] memory activeListings = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].active) {
                activeListings[index] = i;
                index++;
            }
        }
        
        return activeListings;
    }
    
    /**
     * @dev Updates the marketplace fee percentage
     * @param _feePercentage New fee percentage (in basis points)
     */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
    }
    
    /**
     * @dev Withdraws accumulated fees to the owner
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Updates the NFT contract address
     * @param _nftContractAddress New NFT contract address
     */
    function setNFTContract(address _nftContractAddress) external onlyOwner {
        nftContract = IERC1155(_nftContractAddress);
    }
}
