
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { AirNodeContractConfig } from '@/types/web3Types';

// This file will help initialize contracts once you have deployed them to Sepolia
// and have the addresses and ABIs

let contractConfig: AirNodeContractConfig | null = null;

export const initializeContracts = (config: AirNodeContractConfig) => {
  contractConfig = config;
  console.log("Smart contracts initialized with addresses:", {
    NFT: config.airNodeNFTAddress,
    Fractionalization: config.fractionalizationAddress,
    Marketplace: config.marketplaceAddress
  });
};

export const getAirNodeNFTContract = async (provider: ethers.BrowserProvider) => {
  if (!contractConfig) {
    toast.error("Smart contracts not initialized");
    throw new Error("Smart contracts not initialized");
  }

  const signer = await provider.getSigner();
  return new ethers.Contract(
    contractConfig.airNodeNFTAddress,
    contractConfig.airNodeNFTAbi,
    signer
  );
};

export const getAirNodeFractionalizationContract = async (provider: ethers.BrowserProvider) => {
  if (!contractConfig) {
    toast.error("Smart contracts not initialized");
    throw new Error("Smart contracts not initialized");
  }

  const signer = await provider.getSigner();
  return new ethers.Contract(
    contractConfig.fractionalizationAddress,
    contractConfig.fractionalizationAbi,
    signer
  );
};

export const getAirNodeMarketplaceContract = async (provider: ethers.BrowserProvider) => {
  if (!contractConfig) {
    toast.error("Smart contracts not initialized");
    throw new Error("Smart contracts not initialized");
  }

  const signer = await provider.getSigner();
  return new ethers.Contract(
    contractConfig.marketplaceAddress,
    contractConfig.marketplaceAbi,
    signer
  );
};

// Function to create metadata URI from AirNode details
export const createMetadataURI = (metadata: {
  airNodeId: string;
  location: string;
  uptime: number;
  earnings: number;
  roi: number;
  totalFractions: number;
}) => {
  // In a production environment, this should upload to IPFS or another decentralized storage
  // For now, we'll just return a JSON string
  return `data:application/json;base64,${btoa(JSON.stringify({
    name: `AirNode ${metadata.airNodeId}`,
    description: `AirNode located in ${metadata.location}`,
    image: "https://placeholder.com/airnode.png", // Replace with actual image URL
    attributes: [
      {
        trait_type: "Location",
        value: metadata.location
      },
      {
        trait_type: "Uptime",
        value: metadata.uptime,
        display_type: "percentage"
      },
      {
        trait_type: "Daily Earnings",
        value: metadata.earnings,
        display_type: "number"
      },
      {
        trait_type: "ROI",
        value: metadata.roi,
        display_type: "percentage"
      },
      {
        trait_type: "Total Fractions",
        value: metadata.totalFractions,
        display_type: "number"
      }
    ]
  }))}`;
};

// Function to parse fraction ID from contract
export const parseFractionId = (fractionId: string) => {
  // Example fraction ID: "portal-180-fractions"
  const parts = fractionId.split('-');
  return {
    airNodeId: parts.slice(0, parts.length - 1).join('-'),
    type: parts[parts.length - 1]
  };
};

// Utility to format contract error messages for user-friendly display
export const formatContractError = (error: any): string => {
  console.error("Contract error:", error);
  
  // Extract error message from different error formats
  let message = "Transaction failed";
  
  if (error.reason) {
    message = error.reason;
  } else if (error.message) {
    // Clean up common ethers error patterns
    message = error.message.replace("execution reverted: ", "");
    
    // Limit message length for display
    if (message.length > 100) {
      message = message.substring(0, 97) + "...";
    }
  }
  
  return message;
};
