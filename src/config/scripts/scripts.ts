
import { ethers } from "ethers";
import AirNodeNFTAbi from "@/contracts/abis/AirNodeNFT.json";

// Ethereum contract address
const NFT_CONTRACT_ADDRESS = "0xd8b927cf2a1628c087383274bff3b2a011ebaa04";

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

// Generate transaction for marketplace listing
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
