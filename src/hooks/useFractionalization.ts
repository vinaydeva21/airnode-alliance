
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
      
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = ethers.parseEther(pricePerFraction.toString());
      
      const tx = await contract.fractionalizeNFT(nftId, fractionCount, priceInWei);
      
      toast.info("Fractionalization transaction submitted");
      console.log("Fractionalization transaction:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // Try to extract fractionId from events
      let fractionId = "";
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
      
      toast.success(`NFT fractionalized successfully${fractionId ? ` with ID: ${fractionId}` : ""}`);
      return { fractionId, transactionHash: receipt.hash };
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
      const fractionIds = await contract.getAllFractionIds();
      return fractionIds;
    } catch (error) {
      console.error('Get fractions error:', error);
      toast.error(`Failed to get fractions: ${formatContractError(error)}`);
      return [];
    }
  };

  const getFractionDetails = async (fractionId: string) => {
    if (!provider) {
      toast.error("Provider not available");
      return null;
    }

    try {
      const contract = await getAirNodeFractionalizationContract(provider);
      const details = await contract.getFractionDetails(fractionId);
      return details;
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
