// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AirNodeNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BatchMinter
 * @dev Utility contract to mint 4 AirNode NFTs with predefined metadata.
 * The owner can call mintFour to mint four NFTs to a recipient address.
 */
contract BatchMinter is Ownable {
    AirNodeNFT public immutable airNodeNFT;

    constructor(address _airNodeNFT) Ownable(msg.sender) {
        require(_airNodeNFT != address(0), "Invalid NFT address");
        airNodeNFT = AirNodeNFT(_airNodeNFT);
    }

    /**
     * @dev Mint 4 NFTs to the `to` address. Adjust metadata as needed.
     * Returns the minted token IDs.
     */
    function mintFour(address to) external onlyOwner returns (uint256[4] memory ids) {
        ids[0] = airNodeNFT.mintAirNode(
            to,
            "AN-001",
            "AirNode Alpha",
            "Location A",
            "https://example.com/images/airnode-alpha.png",
            9999,
            0,
            15,
            1000,
            1 ether,
            "ipfs://QmAlphaMetadataUri"
        );

        ids[1] = airNodeNFT.mintAirNode(
            to,
            "AN-002",
            "AirNode Beta",
            "Location B",
            "https://example.com/images/airnode-beta.png",
            9998,
            0,
            14,
            1000,
            1 ether,
            "ipfs://QmBetaMetadataUri"
        );

        ids[2] = airNodeNFT.mintAirNode(
            to,
            "AN-003",
            "AirNode Gamma",
            "Location C",
            "https://example.com/images/airnode-gamma.png",
            9997,
            0,
            13,
            1000,
            1 ether,
            "ipfs://QmGammaMetadataUri"
        );

        ids[3] = airNodeNFT.mintAirNode(
            to,
            "AN-004",
            "AirNode Delta",
            "Location D",
            "https://example.com/images/airnode-delta.png",
            9996,
            0,
            12,
            1000,
            1 ether,
            "ipfs://QmDeltaMetadataUri"
        );

        return ids;
    }
}
