
import { CML } from "@lucid-evolution/lucid";
import {
  BLOCKFROST_ID,
  BLOCKFROST_URL,
  CARDANO_NETWORK,
} from "@/config/index";
import * as plutus from "./plutus";
import { ethers } from "ethers";
import AirNodeNFTAbi from "@/contracts/abis/AirNodeNFT.json";

// Ethereum contract address
const NFT_CONTRACT_ADDRESS = "0xd8b927cf2a1628c087383274bff3b2a011ebaa04";

// Create a Lucid instance
export const createLucid = async (network: string = CARDANO_NETWORK) => {
  try {
    // Use CML instead of direct Lucid imports
    const provider = {
      url: BLOCKFROST_URL,
      projectId: BLOCKFROST_ID
    };
    return await CML.Lucid(provider, network);
  } catch (error) {
    console.error("Failed to create Lucid instance:", error);
    throw error;
  }
};

// Set the wallet for Lucid instance
export const setWallet = async (
  lucid: any,
  walletApi: any
): Promise<any> => {
  // The correct way to use the Lucid API to select a wallet
  lucid.selectWallet.fromAPI(walletApi);
  return lucid; // Return the lucid instance after setting the wallet
};

// Export validators for use in other files
export const AirNodeValidator = plutus.placeholder_placeholder_spend || {};
export const mintingValidator = plutus.mint_token_placeholder_mint || {};

// Connect to Ethereum contract - this function will trigger MetaMask
export const connectToEthereumNFTContract = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Ethereum provider not found. Please install MetaMask or another compatible wallet.");
  }
  
  try {
    // This will trigger the MetaMask popup if accounts aren't already connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("Connected to Ethereum with address:", await signer.getAddress());
    
    // Connect to the NFT contract with the signer
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      AirNodeNFTAbi.abi,
      signer
    );
    
    return nftContract;
  } catch (error) {
    console.error("Error connecting to Ethereum NFT contract:", error);
    throw error;
  }
};

// Mint NFT on Ethereum
export const mintEthereumNFT = async (
  airNodeId: string,
  fractionCount: number,
  metadata: any
) => {
  try {
    const nftContract = await connectToEthereumNFTContract();
    
    // Create a metadata URI
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

    console.log("Minting NFT with metadata:", metadataStruct);
    
    // This will trigger the MetaMask popup for transaction signing
    const tx = await nftContract.mintNFT(
      metadata.airNodeId,
      fractionCount,
      metadataURI,
      metadataStruct
    );
    
    console.log("Mint transaction submitted:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error minting Ethereum NFT:", error);
    throw error;
  }
};

// Generate transaction for marketplace listing (remove Cardano specifics)
export const generateMarketplaceListingTx = async (
  nftContract: ethers.Contract,
  tokenId: number,
  price: number
) => {
  try {
    // Implementation would reference the Ethereum marketplace contract
    console.log("Generating Ethereum marketplace listing transaction");
    
    // This would be replaced with actual Ethereum contract calls
    return {
      txHash: "eth_mock_tx_hash",
      submit: async () => "submitted_eth_tx_hash"
    };
  } catch (error) {
    console.error("Error generating marketplace listing tx:", error);
    throw error;
  }
};
