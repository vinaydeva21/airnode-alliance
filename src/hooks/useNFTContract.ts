import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { NFTMetadata, NFTFraction } from "@/types/blockchain";
import { toast } from "sonner";

export const useNFTContract = () => {
  const { web3State, contracts } = useWeb3();
  const [loading, setLoading] = useState(false);

  const mintNFT = async (
    airNodeId: string,
    fractionCount: number,
    metadata: NFTMetadata
  ) => {
    if (!web3State.connected || !contracts) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      // This will be replaced with actual contract call
      await contracts.mintNFT(airNodeId, fractionCount, metadata);
      toast.success("NFT minted successfully");
    } catch (error) {
      console.error("Mint error:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const transferNFT = async (fractionId: string, toAddress: string) => {
    if (!web3State.connected || !contracts) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await contracts.transferNFT(fractionId, toAddress);
      toast.success("NFT transferred successfully");
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Failed to transfer NFT");
    } finally {
      setLoading(false);
    }
  };

  return {
    mintNFT,
    transferNFT,
    loading,
  };
};
