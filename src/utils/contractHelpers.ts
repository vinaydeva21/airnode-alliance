
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { AirNodeContractConfig } from '@/types/web3Types';
import { contractConfig } from '@/config/contracts';

// Initialize contracts with our deployed contract addresses and ABIs
export const initializeContracts = () => {
  console.log("Smart contracts initialized with addresses:", {
    NFT: contractConfig.airNodeNFT.address,
    Fractionalization: contractConfig.airNodeFractionalization.address,
    Marketplace: contractConfig.airNodeMarketplace.address
  });
  return contractConfig;
};

export const getAirNodeNFTContract = async (provider: ethers.BrowserProvider) => {
  try {
    const signer = await provider.getSigner();
    
    // Make sure this matches the ABI structure with the mintAirNode function
    console.log("Creating NFT contract with address:", contractConfig.airNodeNFT.address);
    console.log("ABI has mintAirNode:", contractConfig.airNodeNFT.abi.some((entry: any) => 
      entry.name === "mintAirNode" && entry.type === "function"
    ));
    
    const contract = new ethers.Contract(
      contractConfig.airNodeNFT.address,
      contractConfig.airNodeNFT.abi,
      signer
    );
    
    return contract;
  } catch (error) {
    toast.error("Failed to get AirNode NFT contract");
    console.error("Contract error:", error);
    throw error;
  }
};

export const getAirNodeFractionalizationContract = async (provider: ethers.BrowserProvider) => {
  try {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      contractConfig.airNodeFractionalization.address,
      contractConfig.airNodeFractionalization.abi,
      signer
    );
  } catch (error) {
    toast.error("Failed to get Fractionalization contract");
    console.error("Contract error:", error);
    throw error;
  }
};

export const getAirNodeMarketplaceContract = async (provider: ethers.BrowserProvider) => {
  try {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      contractConfig.airNodeMarketplace.address,
      contractConfig.airNodeMarketplace.abi,
      signer
    );
  } catch (error) {
    toast.error("Failed to get Marketplace contract");
    console.error("Contract error:", error);
    throw error;
  }
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
