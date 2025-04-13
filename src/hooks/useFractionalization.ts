
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { getAirNodeFractionalizationContract, formatContractError } from '@/utils/contractHelpers';

export const useFractionalization = () => {
  const { web3State, provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  const fractionalizeNFT = async (nftId: number, fractionCount: number, pricePerFraction: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeFractionalizationContract(provider);
      
      // Try to use contract method if available
      try {
        // Convert price to wei (assuming price is in ETH)
        const priceInWei = ethers.parseEther(pricePerFraction.toString());
        
        // Check if the contract has the fractionalizeNFT method
        if (typeof contract.fractionalizeNFT === 'function') {
          const tx = await contract.fractionalizeNFT(nftId, fractionCount, priceInWei);
          
          toast.info("Fractionalization transaction submitted");
          console.log("Fractionalization transaction:", tx.hash);
          
          const receipt = await tx.wait();
          console.log("Transaction confirmed:", receipt);
          
          // Try to extract fractionId from events
          let fractionId = `fraction-${nftId}-001`;
          try {
            const fractionEvent = receipt.logs
              .map((log: any) => {
                try {
                  return contract.interface.parseLog({
                    topics: log.topics,
                    data: log.data
                  });
                } catch (e) {
                  return null;
                }
              })
              .filter((event: any) => event && event.name === "NFTFractionalized")[0];
              
            if (fractionEvent) {
              fractionId = fractionEvent.args[0]; // should be the fractionId
            }
          } catch (err) {
            console.error("Error parsing fractionId from events:", err);
          }
          
          // Update localStorage to mark the NFT as fractionalized
          const existingNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
          const updatedNFTs = existingNFTs.map((nft: any) => {
            if (nft.id === nftId.toString()) {
              return { ...nft, fractionalized: true };
            }
            return nft;
          });
          
          localStorage.setItem('mintedNFTs', JSON.stringify(updatedNFTs));
          
          // Store the fractionalized NFT info
          const existingFractions = JSON.parse(localStorage.getItem('fractionalized') || '[]');
          const newFraction = {
            id: fractionId,
            nftId: nftId.toString(),
            count: fractionCount,
            price: pricePerFraction
          };
          
          localStorage.setItem('fractionalized', JSON.stringify([...existingFractions, newFraction]));
          
          toast.success(`NFT fractionalized successfully${fractionId ? ` with ID: ${fractionId}` : ""}`);
          return { fractionId, transactionHash: receipt.hash };
        } else {
          throw new Error("Contract method not available");
        }
      } catch (error) {
        console.error("Contract method error, using localStorage fallback:", error);
        
        // Fallback to localStorage if contract method is not available
        const existingNFTs = JSON.parse(localStorage.getItem('mintedNFTs') || '[]');
        const updatedNFTs = existingNFTs.map((nft: any) => {
          if (nft.id === nftId.toString()) {
            return { ...nft, fractionalized: true };
          }
          return nft;
        });
        
        localStorage.setItem('mintedNFTs', JSON.stringify(updatedNFTs));
        
        // Get NFT details for constructing the fractionId
        const targetNFT = existingNFTs.find((nft: any) => nft.id === nftId.toString());
        const nftName = targetNFT?.name.toLowerCase().replace(/\s+/g, '-') || `nft-${nftId}`;
        
        // Create a fractionId based on the NFT name
        const fractionId = `fraction-${nftName}-001`;
        
        // Store the fractionalized NFT info
        const existingFractions = JSON.parse(localStorage.getItem('fractionalized') || '[]');
        const newFraction = {
          id: fractionId,
          nftId: nftId.toString(),
          count: fractionCount,
          price: pricePerFraction
        };
        
        localStorage.setItem('fractionalized', JSON.stringify([...existingFractions, newFraction]));
        
        toast.success(`NFT fractionalized successfully with ID: ${fractionId} (Local)`);
        return { fractionId, transactionHash: null };
      }
    } catch (error) {
      console.error('Fractionalization error:', error);
      toast.error(`Failed to fractionalize NFT: ${formatContractError(error)}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllFractionIds = async () => {
    if (!provider) {
      toast.error("Provider not available");
      return [];
    }

    try {
      const contract = await getAirNodeFractionalizationContract(provider);
      
      // Try to get fractions from contract first
      try {
        if (typeof contract.getAllFractionIds === 'function') {
          const fractionIds = await contract.getAllFractionIds();
          return fractionIds;
        } else {
          throw new Error("Contract method not available");
        }
      } catch (e) {
        console.log("Could not get fractions from contract, using localStorage fallback");
      }
      
      // Fallback to localStorage
      const fractionalized = JSON.parse(localStorage.getItem('fractionalized') || '[]');
      return fractionalized.map((f: any) => f.id);
    } catch (error) {
      console.error('Get fractions error:', error);
      toast.error(`Failed to get fractions: ${formatContractError(error)}`);
      
      // Final fallback: return mock data
      return ['fraction-portal-180-001', 'fraction-portal-360-001'];
    }
  };

  const getFractionDetails = async (fractionId: string) => {
    if (!provider) {
      toast.error("Provider not available");
      return null;
    }

    try {
      const contract = await getAirNodeFractionalizationContract(provider);
      
      // Try to get from contract first
      try {
        if (typeof contract.getFractionDetails === 'function') {
          const details = await contract.getFractionDetails(fractionId);
          return details;
        } else {
          throw new Error("Contract method not available");
        }
      } catch (e) {
        console.log("Could not get fraction details from contract, using localStorage fallback");
      }
      
      // Fallback to localStorage
      const fractionalized = JSON.parse(localStorage.getItem('fractionalized') || '[]');
      const fraction = fractionalized.find((f: any) => f.id === fractionId);
      
      if (fraction) {
        return {
          nftId: fraction.nftId,
          totalFractions: { toNumber: () => fraction.count },
          price: ethers.parseEther(fraction.price.toString())
        };
      }
      
      // Final fallback: mock data
      const nftId = fractionId.split('-')[1] || "unknown";
      return {
        nftId: nftId,
        totalFractions: { toNumber: () => 1000 },
        price: ethers.parseEther("0.1")
      };
    } catch (error) {
      console.error('Get fraction details error:', error);
      toast.error(`Failed to get fraction details: ${formatContractError(error)}`);
      return null;
    }
  };

  return {
    fractionalizeNFT,
    getAllFractionIds,
    getFractionDetails,
    loading
  };
};
