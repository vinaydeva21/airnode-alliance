
import { toast } from "sonner";
import { NFTMetadata } from "@/types/blockchain";
import { connectToEthereumNFTContract } from "@/config/scripts/scripts";
import { ethers } from "ethers";

// This function handles minting NFTs on Ethereum
export const mintNFTCardano = async (
  airNodeId: string,
  fractionCount: bigint,
  metadata: NFTMetadata,
  chainId: number | null
) => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("Ethereum wallet not found. Please install MetaMask");
      return;
    }

    toast.info("Connecting to Ethereum wallet...");
    
    // Connect to Ethereum wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get the Ethereum provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    toast.info(`Connected to wallet: ${await signer.getAddress()}`);
    
    // Connect to NFT contract
    const nftContract = await connectToEthereumNFTContract();
    
    if (!nftContract) {
      toast.error("Failed to connect to NFT contract");
      return;
    }
    
    // Generate NFT metadata
    const nftMetadataJSON = JSON.stringify({
      name: `AirNode ${airNodeId}`,
      description: `Fractionalized AirNode at ${metadata.location}`,
      attributes: [
        { trait_type: "Uptime", value: metadata.performance.uptime },
        { trait_type: "Earnings", value: metadata.performance.earnings },
        { trait_type: "ROI", value: metadata.performance.roi },
        { trait_type: "Fractions", value: fractionCount.toString() }
      ]
    });
    
    const metadataURI = `data:application/json;base64,${btoa(nftMetadataJSON)}`;
    
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
    
    toast.info("Please confirm the transaction in your wallet...");
    
    // Call the mint function on the smart contract
    const tx = await nftContract.mintNFT(
      metadata.airNodeId,
      Number(fractionCount),
      metadataURI,
      metadataStruct
    );
    
    toast.info("Transaction submitted, waiting for confirmation...");
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    toast.success("NFT minted successfully on Ethereum blockchain");
    return tx.hash;
  } catch (error) {
    console.error("Error minting NFT on Ethereum:", error);
    toast.error("Failed to mint NFT on Ethereum blockchain");
    throw error;
  }
};
