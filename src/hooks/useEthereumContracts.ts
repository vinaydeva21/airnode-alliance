
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { MarketplaceListing, NFTMetadata } from "@/types/blockchain";

// Import ABIs
import AirNodeNFTAbi from "@/contracts/abis/AirNodeNFT.json";
import AirNodeMarketplaceAbi from "@/contracts/abis/AirNodeMarketplace.json";
import ANATokenAbi from "@/contracts/abis/ANAToken.json";

// Contract addresses - using the deployed contract addresses
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
      if (!web3State.connected || !window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

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
        
        // Listen for NFT minted event
        nftContract.on("NFTMinted", (tokenId, airNodeId, fractions, event) => {
          console.log("NFT Minted event:", tokenId, airNodeId, fractions);
          const newNFT = {
            tokenId: tokenId.toString(),
            airNodeId,
            fractions: fractions.toString()
          };
          setMintedNFTs(prev => [...prev, newNFT]);
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
  }, [web3State.connected]);

  // Mint NFT function
  const mintNFT = async (
    airNodeId: string,
    fractionCount: number,
    metadata: NFTMetadata
  ) => {
    if (!contracts.nft) {
      toast.error("NFT contract not initialized");
      return;
    }

    setLoading(true);
    try {
      // Create a metadata URI (in a real app, this would be IPFS or similar)
      const metadataURI = `https://example.com/metadata/${airNodeId}`;
      
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

      toast.info("Preparing mint transaction...");
      const tx = await contracts.nft.mintNFT(
        metadata.airNodeId,
        fractionCount,
        metadataURI,
        metadataStruct
      );
      
      toast.info("Minting transaction submitted");
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);
      
      // Get the token ID from the event
      const event = receipt.logs
        .map((log: any) => {
          try {
            return contracts.nft?.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((event: any) => event && event.name === "NFTMinted");
      
      if (event) {
        const tokenId = event.args[0].toString();
        console.log("Minted token ID:", tokenId);
      }
      
      toast.success("NFT minted successfully");
      return tx;
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to get active marketplace listings
  const getMarketplaceListings = async (): Promise<MarketplaceListing[]> => {
    if (!contracts.marketplace) {
      toast.error("Marketplace contract not initialized");
      return [];
    }

    try {
      const listingIds = await contracts.marketplace.getActiveListings();
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
  const getUserMintedNFTs = async () => {
    if (!contracts.nft || !web3State.account) {
      return [];
    }

    try {
      // This is a simplified approach - in a real app, you'd query events or have a more sophisticated way
      // to get the user's NFTs
      const balance = await contracts.nft.balanceOf(web3State.account, 1);
      if (balance > 0) {
        // User has some NFTs
        return [{ tokenId: "1", balance: balance.toString() }];
      }
      return [];
    } catch (error) {
      console.error("Error getting user NFTs:", error);
      return [];
    }
  };

  return {
    contracts,
    loading,
    mintNFT,
    mintedNFTs,
    fractionalizeNFT: async () => true, // This is handled at mint time
    listNFTOnMarketplace,
    getMarketplaceListings,
    getUserMintedNFTs
  };
};
