import { ethers } from "ethers";
import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { MarketplaceListing, NFTMetadata } from "@/types/blockchain";
import { connectToEthereumNFTContract } from "@/config/scripts/scripts";

// Import ABIs
import AirNodeNFTAbi from "@/contracts/abis/AirNodeNFT.json";
import AirNodeMarketplaceAbi from "@/contracts/abis/AirNodeMarketplace.json";
import ANATokenAbi from "@/contracts/abis/ANAToken.json";

// Contract addresses
const CONTRACT_ADDRESSES = {
  NFT: "0xd8b927cf2a1628c087383274bff3b2a011ebaa04",
  MARKETPLACE: "0x04dfdc0a81b9aedeb2780ee1ba4723c88fb57ace", 
  TOKEN: "0xc2fdc83aea820f75dc1e89e8c92c3d451d90fca9",
};

export const useEthereumContracts = () => {
  const { web3State } = useWeb3();
  const [contracts, setContracts] = useState<{
    nft: ethers.Contract | null;
    marketplace: ethers.Contract | null;
    token: ethers.Contract | null;
  }>({
    nft: null,
    marketplace: null,
    token: null,
  });
  const [loading, setLoading] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);

  // Initialize contracts when wallet is connected
  useEffect(() => {
    const initContracts = async () => {
      if (!web3State.connected || !window.ethereum) {
        console.log("Not connected or no Ethereum provider");
        return;
      }

      try {
        console.log("Initializing contracts with account:", web3State.account);
        
        // Request accounts access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        console.log("Connected with signer address:", await signer.getAddress());

        const nftContract = new ethers.Contract(
          CONTRACT_ADDRESSES.NFT,
          AirNodeNFTAbi.abi,
          signer
        );

        const marketplaceContract = new ethers.Contract(
          CONTRACT_ADDRESSES.MARKETPLACE,
          AirNodeMarketplaceAbi.abi,
          signer
        );

        const tokenContract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN,
          ANATokenAbi.abi,
          signer
        );

        setContracts({
          nft: nftContract,
          marketplace: marketplaceContract,
          token: tokenContract,
        });
        
        console.log("Contracts initialized, setting up event listeners");
        
        // Listen for NFT minted event
        const nftMintedFilter = nftContract.filters.NFTMinted();
        
        nftContract.on(nftMintedFilter, (tokenId, airNodeId, fractions, event) => {
          console.log("NFT Minted event captured:", tokenId, airNodeId, fractions);
          const newNFT = {
            tokenId: tokenId.toString(),
            airNodeId,
            fractions: fractions.toString(),
            timestamp: Date.now() // Add timestamp for sorting
          };
          setMintedNFTs(prev => [...prev, newNFT]);
          toast.success("New NFT minted and added to marketplace!");
        });

        return () => {
          // Remove event listeners on cleanup
          if (nftContract) {
            nftContract.removeAllListeners("NFTMinted");
          }
        };
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        toast.error("Failed to connect to blockchain contracts");
      }
    };

    initContracts();
  }, [web3State.connected, web3State.account]);

  // Function to mint NFT directly using the contract
  const mintNFT = async (
    airNodeId: string,
    fractionCount: number,
    metadata: NFTMetadata
  ) => {
    if (!web3State.connected) {
      toast.error("Please connect your wallet first");
      return null;
    }

    setLoading(true);
    try {
      toast.info("Preparing mint transaction...");
      
      // Connect directly to the contract to ensure MetaMask popup
      const nftContract = await connectToEthereumNFTContract();
      
      if (!nftContract) {
        throw new Error("Could not connect to NFT contract");
      }
      
      const metadataJSON = JSON.stringify({
        airNodeId: metadata.airNodeId,
        location: metadata.location,
        performance: metadata.performance,
        totalFractions: fractionCount
      });
      
      const metadataURI = `data:application/json;base64,${btoa(metadataJSON)}`;
      
      // Convert metadata to contract format
      const metadataStruct = {
        airNodeId: metadata.airNodeId,
        location: metadata.location,
        performance: {
          uptime: metadata.performance.uptime,
          earnings: ethers.parseEther(metadata.performance.earnings.toString()),
          roi: metadata.performance.roi,
        },
        fractions: fractionCount,
      };
      
      toast.info("Please confirm the transaction in your wallet");
      
      // This will trigger the MetaMask popup
      const tx = await nftContract.mintNFT(
        metadata.airNodeId,
        fractionCount,
        metadataURI,
        metadataStruct
      );
      
      toast.info("Transaction submitted, waiting for confirmation...");
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      // Event will be handled by the listener
      return tx;
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast.error(error.message || "Failed to mint NFT");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to get active marketplace listings
  const getMarketplaceListings = useCallback(async (): Promise<MarketplaceListing[]> => {
    if (!contracts.marketplace) {
      console.warn("Marketplace contract not initialized");
      return [];
    }

    try {
      const listingIds = await contracts.marketplace.getActiveListings();
      console.log("Retrieved listing IDs:", listingIds);
      const listings: MarketplaceListing[] = [];

      for (const id of listingIds) {
        const listing = await contracts.marketplace.listings(id);
        listings.push({
          fractionId: listing.fractionId.toString(),
          seller: listing.seller,
          price: Number(ethers.formatEther(listing.price)),
          type: listing.listingType === 0 ? "sale" : "lease",
          leaseDuration: listing.leaseDuration ? Number(listing.leaseDuration) : undefined
        });
      }

      return listings;
    } catch (error) {
      console.error("Error getting marketplace listings:", error);
      toast.error("Failed to fetch marketplace listings");
      return [];
    }
  }, [contracts.marketplace]);

  // Fractionalize NFT (this is handled during mint in the AirNodeNFT contract)
  const fractionalizeNFT = async () => {
    // In our implementation, fractionalization happens at mint time
    // This function exists for API compatibility
    return true;
  };

  // List NFT fractions on marketplace
  const listNFTOnMarketplace = async (
    tokenId: number,
    fractionId: number,
    price: number,
    quantity: number,
    isAuction: boolean = false,
    duration: number = 0
  ) => {
    if (!contracts.marketplace || !contracts.nft) {
      toast.error("Contracts not initialized");
      return;
    }

    setLoading(true);
    try {
      // First, approve the marketplace to transfer the NFT
      toast.info("Approving marketplace to transfer NFT...");
      const approveTx = await contracts.nft.setApprovalForAll(
        CONTRACT_ADDRESSES.MARKETPLACE,
        true
      );
      await approveTx.wait();
      toast.info("Approval confirmed");

      // Convert price to wei
      const priceInWei = ethers.parseEther(price.toString());
      
      // Determine listing type (fixed price or auction)
      const listingType = isAuction ? 1 : 0; // 0 for Sale, 1 for Lease/Auction

      toast.info("Creating listing on marketplace...");
      const tx = await contracts.marketplace.createListing(
        tokenId,
        fractionId,
        priceInWei,
        listingType,
        duration * 86400 // Convert days to seconds
      );
      
      toast.info("Listing transaction submitted");
      await tx.wait();
      toast.success("Fractions listed on marketplace");
      return tx;
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast.error("Failed to list NFT fractions");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to get user's minted NFTs
  const getUserMintedNFTs = useCallback(async () => {
    if (!contracts.nft || !web3State.account) {
      return [];
    }

    try {
      // In a real app, you'd query events or have a more sophisticated way
      // to get the user's NFTs. Here we're just using our local state.
      return mintedNFTs;
    } catch (error) {
      console.error("Error getting user NFTs:", error);
      return [];
    }
  }, [contracts.nft, web3State.account, mintedNFTs]);

  return {
    contracts,
    loading,
    mintNFT,
    mintedNFTs,
    fractionalizeNFT,
    listNFTOnMarketplace,
    getMarketplaceListings,
    getUserMintedNFTs
  };
};
