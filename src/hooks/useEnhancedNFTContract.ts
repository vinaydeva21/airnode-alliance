import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { contractConfig } from '@/config/contracts';

export interface NFTMetadata {
  airNodeId: string;
  name: string;
  location: string;
  imageUrl: string;
  uptime: number;
  earnings: number;
  roi: number;
  totalFractions: number;
  pricePerShare: number;
}

export const useEnhancedNFTContract = () => {
  const { web3State, provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  const getContracts = async () => {
    if (!provider) throw new Error("Provider not available");
    
    const signer = await provider.getSigner();
    
    const nftContract = new ethers.Contract(
      contractConfig.airNodeNFT.address,
      contractConfig.airNodeNFT.abi,
      signer
    );
    
    const fractionalizationContract = new ethers.Contract(
      contractConfig.airNodeFractionalization.address,
      contractConfig.airNodeFractionalization.abi,
      signer
    );
    
    const marketplaceContract = new ethers.Contract(
      contractConfig.airNodeMarketplace.address,
      contractConfig.airNodeMarketplace.abi,
      signer
    );
    
    return { nftContract, fractionalizationContract, marketplaceContract };
  };

  // Enhanced minting function
  const mintNFT = async (metadata: NFTMetadata) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const { nftContract } = await getContracts();
      
      // Create metadata URI
      const metadataJson = {
        name: metadata.name,
        description: `AirNode ${metadata.airNodeId} located in ${metadata.location}`,
        image: metadata.imageUrl,
        attributes: [
          { trait_type: "AirNode ID", value: metadata.airNodeId },
          { trait_type: "Location", value: metadata.location },
          { trait_type: "Uptime", value: metadata.uptime },
          { trait_type: "Daily Earnings", value: metadata.earnings },
          { trait_type: "ROI", value: metadata.roi },
          { trait_type: "Total Fractions", value: metadata.totalFractions },
          { trait_type: "Price Per Share", value: metadata.pricePerShare },
        ],
      };
      
      const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadataJson))}`;
      
      toast.info("Initiating NFT minting transaction...");
      
      // Call enhanced mint function
      const tx = await nftContract.mintAirNode(
        web3State.account,
        metadata.airNodeId,
        metadata.name,
        metadata.location,
        metadata.imageUrl,
        Math.round(metadata.uptime * 10), // Scale by 10 for precision
        Math.round(metadata.earnings * 100), // Scale by 100 for precision
        Math.round(metadata.roi * 10), // Scale by 10 for precision
        metadata.totalFractions,
        ethers.parseEther(metadata.pricePerShare.toString()),
        metadataURI,
        {
          gasLimit: 500000,
        }
      );
      
      toast.info("Transaction submitted, waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      // Extract token ID from events
      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = nftContract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          
          if (parsed?.name === "AirNodeMinted") {
            tokenId = parsed.args[0].toString();
            break;
          }
        } catch (e) {
          // Ignore parsing errors for other logs
        }
      }
      
      // Store in localStorage for backup
      const mintedNFTs = JSON.parse(localStorage.getItem("mintedNFTs") || "[]");
      const newNFT = {
        id: tokenId,
        ...metadata,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now(),
      };
      
      localStorage.setItem("mintedNFTs", JSON.stringify([...mintedNFTs, newNFT]));
      
      toast.success(`NFT minted successfully! Token ID: ${tokenId}`);
      
      return {
        tokenId,
        transactionHash: receipt.hash,
        metadata: newNFT,
      };
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast.error(`Failed to mint NFT: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fractionalize NFT
  const fractionalizeNFT = async (tokenId: string, fractionCount: number, pricePerFraction: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const { fractionalizationContract } = await getContracts();
      
      toast.info("Initiating fractionalization transaction...");
      
      const tx = await fractionalizationContract.fractionalizeNFT(
        tokenId,
        fractionCount,
        ethers.parseEther(pricePerFraction.toString()),
        {
          gasLimit: 800000,
        }
      );
      
      toast.info("Transaction submitted, waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      // Extract fraction ID from events
      let fractionId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = fractionalizationContract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          
          if (parsed?.name === "NFTFractionalized") {
            fractionId = parsed.args[0];
            break;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      // Store in localStorage for backup
      const fractionalized = JSON.parse(localStorage.getItem("fractionalized") || "[]");
      const newFraction = {
        id: fractionId,
        tokenId,
        count: fractionCount,
        pricePerFraction,
        transactionHash: receipt.hash,
        timestamp: Date.now(),
      };
      
      localStorage.setItem("fractionalized", JSON.stringify([...fractionalized, newFraction]));
      
      toast.success(`NFT fractionalized successfully! Fraction ID: ${fractionId}`);
      
      return {
        fractionId,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Error fractionalizing NFT:", error);
      toast.error(`Failed to fractionalize NFT: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // List fractions on marketplace
  const listFractionsOnMarketplace = async (fractionId: string, quantity: number, pricePerShare: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const { fractionalizationContract, marketplaceContract } = await getContracts();
      
      // First, mark fractions as listed in the fractionalization contract
      toast.info("Listing fractions for marketplace...");
      
      let tx = await fractionalizationContract.listFractions(fractionId, true, {
        gasLimit: 200000,
      });
      
      await tx.wait();
      
      // Then create marketplace listing
      toast.info("Creating marketplace listing...");
      
      tx = await marketplaceContract.listFractionForSale(
        fractionId,
        ethers.parseEther(pricePerShare.toString()),
        quantity,
        {
          gasLimit: 300000,
        }
      );
      
      const receipt = await tx.wait();
      
      // Extract listing ID from events
      let listingId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = marketplaceContract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          
          if (parsed?.name === "FractionListed") {
            listingId = parsed.args[0].toString();
            break;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      // Store in localStorage for backup
      const listings = JSON.parse(localStorage.getItem("listings") || "[]");
      const newListing = {
        id: listingId,
        fractionId,
        quantity,
        price: pricePerShare,
        isActive: true,
        transactionHash: receipt.hash,
        timestamp: Date.now(),
      };
      
      localStorage.setItem("listings", JSON.stringify([...listings, newListing]));
      
      toast.success(`Fractions listed on marketplace! Listing ID: ${listingId}`);
      
      return {
        listingId,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Error listing fractions:", error);
      toast.error(`Failed to list fractions: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all minted NFTs
  const getAllMintedNFTs = async () => {
    try {
      if (web3State.connected && provider) {
        const { nftContract } = await getContracts();
        const tokenIds = await nftContract.getAllMintedNFTs();
        
        const nfts = await Promise.all(
          tokenIds.map(async (tokenId: bigint) => {
            const metadata = await nftContract.getAirNodeMetadata(tokenId);
            return {
              id: tokenId.toString(),
              airNodeId: metadata.airNodeId,
              name: metadata.name,
              location: metadata.location,
              imageUrl: metadata.imageUrl,
              uptime: Number(metadata.uptime) / 10,
              earnings: Number(metadata.earnings) / 100,
              roi: Number(metadata.roi) / 10,
              totalFractions: Number(metadata.totalFractions),
              pricePerShare: parseFloat(ethers.formatEther(metadata.pricePerShare)),
              fractionalized: metadata.fractionalized,
              isActive: metadata.isActive,
            };
          })
        );
        
        return nfts;
      } else {
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem("mintedNFTs") || "[]");
      }
    } catch (error) {
      console.error("Error fetching minted NFTs:", error);
      return JSON.parse(localStorage.getItem("mintedNFTs") || "[]");
    }
  };

  return {
    mintNFT,
    fractionalizeNFT,
    listFractionsOnMarketplace,
    getAllMintedNFTs,
    loading,
  };
};