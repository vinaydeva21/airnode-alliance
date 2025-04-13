
import { ContractInteractions } from '@/types/blockchain';
import { Web3State } from '@/types/blockchain';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useNFTContract } from './useNFTContract';
import { useFractionalization } from './useFractionalization';
import { useMarketplace } from './useMarketplace';
import { createMetadataURI } from '@/utils/contractHelpers';

export const useContractInteractions = (
  web3State: Web3State, 
  provider: ethers.BrowserProvider | null
): ContractInteractions | null => {
  if (!web3State.connected || !provider) return null;

  const { mintNFT, transferNFT, getTokenMetadata } = useNFTContract();
  const { fractionalizeNFT, getFractionDetails } = useFractionalization();
  const { listForSale, buyFraction, getListings } = useMarketplace();

  return {
    // NFT Contract interactions
    mintNFT: async (airNodeId, fractionCount, metadataURI) => {
      // Parse the metadata from URI if it's a data URI
      let metadata;
      if (metadataURI.startsWith('data:application/json;base64,')) {
        const base64Data = metadataURI.replace('data:application/json;base64,', '');
        const jsonStr = atob(base64Data);
        const parsedData = JSON.parse(jsonStr);
        
        metadata = {
          airNodeId: parsedData.name.replace('AirNode ', ''),
          location: parsedData.attributes.find((attr: any) => attr.trait_type === 'Location')?.value || '',
          performance: {
            uptime: parsedData.attributes.find((attr: any) => attr.trait_type === 'Uptime')?.value || 99.5,
            earnings: parsedData.attributes.find((attr: any) => attr.trait_type === 'Daily Earnings')?.value || 2.5,
            roi: parsedData.attributes.find((attr: any) => attr.trait_type === 'ROI')?.value || 18,
          },
          totalFractions: parsedData.attributes.find((attr: any) => attr.trait_type === 'Total Fractions')?.value || fractionCount,
        };
      } else {
        // If it's not a data URI, use default values
        metadata = {
          airNodeId,
          location: "Unknown Location",
          performance: {
            uptime: 99.5,
            earnings: 2.5,
            roi: 18,
          },
          totalFractions: fractionCount,
        };
      }
      
      await mintNFT(airNodeId, fractionCount, metadata);
      toast.info("NFT minting process completed");
    },
    
    transferNFT: async (fractionId, toAddress) => {
      await transferNFT(fractionId, toAddress);
      toast.info("NFT transfer completed");
    },
    
    getOwner: async (fractionId) => {
      try {
        // This is a simplified implementation as we don't have a direct getOwner function
        // In a real app, we would make a contract call to find the owner
        return web3State.account || "";
      } catch (error) {
        console.error("Error getting owner:", error);
        return "";
      }
    },
    
    updateMetadata: async (fractionId, metadata) => {
      try {
        // Convert metadata to URI
        const metadataURI = createMetadataURI({
          airNodeId: metadata.airNodeId,
          location: metadata.location,
          uptime: metadata.performance.uptime,
          earnings: metadata.performance.earnings,
          roi: metadata.performance.roi,
          totalFractions: metadata.totalFractions
        });
        
        // We would call the contract's updateMetadata function here
        console.log("Would update metadata for:", { fractionId, metadataURI });
        toast.info("Metadata update would be initiated");
      } catch (error) {
        console.error("Error updating metadata:", error);
        toast.error("Failed to update metadata");
      }
    },
    
    burnNFT: async (fractionId) => {
      console.log("Burning NFT is not implemented yet:", fractionId);
      toast.info("NFT burn functionality is not implemented yet");
    },

    // Marketplace Contract interactions
    listForSale: async (fractionId, price) => {
      await listForSale(fractionId, price);
      toast.info("NFT listed for sale");
    },
    
    buyFraction: async (fractionId, price) => {
      await buyFraction(parseInt(fractionId), 1, price);
      toast.info("Purchase completed");
    },
    
    leaseFraction: async (fractionId, duration, price) => {
      console.log("Leasing is not implemented yet:", { fractionId, duration, price });
      toast.info("Leasing functionality is not implemented yet");
    },
    
    getListings: async () => {
      return await getListings();
    },

    // The remaining functions are placeholders for future implementation
    
    // Rewards Contract interactions
    depositRewards: async (airNodeId, amount) => {
      console.log("Depositing rewards:", { airNodeId, amount });
      toast.info("Reward deposit functionality is not implemented yet");
    },
    
    calculateRewards: async (fractionId) => {
      console.log("Calculating rewards for:", fractionId);
      return 0;
    },
    
    claimRewards: async (fractionId) => {
      console.log("Claiming rewards for:", fractionId);
      toast.info("Rewards claim functionality is not implemented yet");
    },
    
    getClaimableRewards: async (fractionId) => {
      console.log("Getting claimable rewards for:", fractionId);
      return 0;
    },

    // Governance Contract interactions
    submitProposal: async (description, votingDeadline) => {
      console.log("Submitting proposal:", { description, votingDeadline });
      toast.info("Proposal submission functionality is not implemented yet");
    },
    
    vote: async (proposalId, fractionId, inFavor) => {
      console.log("Voting on proposal:", { proposalId, fractionId, inFavor });
      toast.info("Voting functionality is not implemented yet");
    },
    
    executeProposal: async (proposalId) => {
      console.log("Executing proposal:", proposalId);
      toast.info("Proposal execution functionality is not implemented yet");
    },

    // Staking Contract interactions
    stakeNFT: async (fractionId, stakingPeriod) => {
      console.log("Staking NFT:", { fractionId, stakingPeriod });
      toast.info("NFT staking functionality is not implemented yet");
    },
    
    claimStakingRewards: async (fractionId) => {
      console.log("Claiming staking rewards for:", fractionId);
      toast.info("Staking rewards claim functionality is not implemented yet");
    },
    
    useNFTAsCollateral: async (fractionId, loanAmount) => {
      console.log("Using NFT as collateral:", { fractionId, loanAmount });
      toast.info("Collateralization functionality is not implemented yet");
    },
    
    liquidateNFT: async (fractionId) => {
      console.log("Liquidating NFT:", fractionId);
      toast.info("Liquidation functionality is not implemented yet");
    }
  };
};
