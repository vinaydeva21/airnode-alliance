import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { contractConfig } from '@/config/contracts';

export interface MarketplaceNode {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  totalShares: number;
  availableShares: number;
  performance: {
    uptime: number;
    earnings: number;
    roi: number;
  };
  fractionId: string;
}

export const useEnhancedMarketplace = () => {
  const { web3State, provider } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [marketplaceNodes, setMarketplaceNodes] = useState<MarketplaceNode[]>([]);

  // Create contract instances
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

  // Fetch marketplace listings from contracts
  const fetchMarketplaceListings = async () => {
    if (!web3State.connected || !provider) {
      console.log("Wallet not connected, using fallback data");
      return getFallbackNodes();
    }

    setLoading(true);
    try {
      const { fractionalizationContract, marketplaceContract } = await getContracts();
      
      // Get all listed fractions
      const listedFractionIds = await fractionalizationContract.getListedFractions();
      
      // Get marketplace listings
      const marketplaceListings = await marketplaceContract.getMarketplaceListings();
      
      // Transform to our format
      const nodes: MarketplaceNode[] = await Promise.all(
        marketplaceListings.map(async (listing: any) => {
          try {
            const fractionDetails = await fractionalizationContract.getFractionDetails(listing.fractionId);
            
            return {
              id: listing.fractionId,
              name: fractionDetails.name || `AirNode ${fractionDetails.nftId}`,
              location: fractionDetails.location || "Unknown Location",
              price: parseFloat(ethers.formatEther(listing.price)),
              imageUrl: fractionDetails.imageUrl || "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
              totalShares: Number(fractionDetails.totalFractions),
              availableShares: Number(listing.quantity),
              performance: {
                uptime: Number(fractionDetails.uptime) / 10 || 99.2,
                earnings: Number(fractionDetails.earnings) / 100 || 2.4,
                roi: Number(fractionDetails.roi) / 10 || 18.6,
              },
              fractionId: listing.fractionId,
            };
          } catch (error) {
            console.error("Error processing listing:", error);
            return null;
          }
        })
      );
      
      // Filter out null values
      const validNodes = nodes.filter(node => node !== null) as MarketplaceNode[];
      
      if (validNodes.length === 0) {
        console.log("No contract listings found, using fallback");
        return getFallbackNodes();
      }
      
      return validNodes;
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      toast.error("Failed to load marketplace data from blockchain");
      return getFallbackNodes();
    } finally {
      setLoading(false);
    }
  };

  // Buy shares with real contract interaction
  const buyShares = async (fractionId: string, quantity: number, pricePerShare: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const { marketplaceContract } = await getContracts();
      
      // Find the listing ID for this fraction
      const allListings = await marketplaceContract.getAllListings();
      const listing = allListings.find((l: any) => l.fractionId === fractionId && l.isActive);
      
      if (!listing) {
        throw new Error("Listing not found");
      }
      
      const listingId = allListings.indexOf(listing);
      const totalPrice = ethers.parseEther((pricePerShare * quantity).toString());
      
      toast.info("Initiating purchase transaction...");
      
      const tx = await marketplaceContract.buyFractions(listingId, quantity, {
        value: totalPrice,
        gasLimit: 300000,
      });
      
      toast.info("Transaction submitted, waiting for confirmation...");
      
      await tx.wait();
      
      toast.success(`Successfully purchased ${quantity} shares of ${fractionId}!`);
      
      // Refresh marketplace data
      await loadMarketplaceData();
      
      return tx.hash;
    } catch (error: any) {
      console.error("Error buying shares:", error);
      toast.error(`Failed to purchase shares: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's purchased fractions
  const getUserFractions = async () => {
    if (!web3State.connected || !provider) {
      return [];
    }

    try {
      const { marketplaceContract } = await getContracts();
      const [fractionIds, quantities] = await marketplaceContract.getUserAllFractions(web3State.account);
      
      return fractionIds.map((id: string, index: number) => ({
        fractionId: id,
        quantity: Number(quantities[index]),
      }));
    } catch (error) {
      console.error("Error fetching user fractions:", error);
      return [];
    }
  };

  // Load marketplace data
  const loadMarketplaceData = async () => {
    const nodes = await fetchMarketplaceListings();
    setMarketplaceNodes(nodes);
  };

  // Fallback data when contracts are not available
  const getFallbackNodes = (): MarketplaceNode[] => {
    return [
      {
        id: "portal-180-fractions",
        name: "Portal 180",
        location: "Nairobi, Kenya",
        price: 45,
        imageUrl: "/lovable-uploads/a70daab2-29e5-4fa4-b829-3329574be93f.png",
        totalShares: 1000,
        availableShares: 850,
        performance: {
          uptime: 99.2,
          earnings: 2.4,
          roi: 18.6,
        },
        fractionId: "portal-180-fractions",
      },
      {
        id: "portal-360-fractions",
        name: "Portal 360",
        location: "Lagos, Nigeria",
        price: 60,
        imageUrl: "/lovable-uploads/3ae2813d-4b87-4f87-89d7-24d53bbd4467.png",
        totalShares: 1000,
        availableShares: 600,
        performance: {
          uptime: 98.7,
          earnings: 2.9,
          roi: 19.2,
        },
        fractionId: "portal-360-fractions",
      },
      {
        id: "apex-90-fractions",
        name: "Apex 90",
        location: "Addis Ababa, Ethiopia",
        price: 75,
        imageUrl: "/lovable-uploads/59d86994-f6a9-4570-b53c-519a936f6a3f.png",
        totalShares: 2000,
        availableShares: 1200,
        performance: {
          uptime: 99.8,
          earnings: 3.6,
          roi: 22.4,
        },
        fractionId: "apex-90-fractions",
      },
      {
        id: "apex-180-fractions",
        name: "Apex 180",
        location: "Kampala, Uganda",
        price: 80,
        imageUrl: "/lovable-uploads/2da80626-af04-44e1-ae5b-ebb332918edf.png",
        totalShares: 2000,
        availableShares: 1800,
        performance: {
          uptime: 97.9,
          earnings: 3.2,
          roi: 20.1,
        },
        fractionId: "apex-180-fractions",
      },
    ];
  };

  // Load data on component mount
  useEffect(() => {
    loadMarketplaceData();
  }, [web3State.connected]);

  return {
    marketplaceNodes,
    loading,
    buyShares,
    getUserFractions,
    loadMarketplaceData,
    fetchMarketplaceListings,
  };
};