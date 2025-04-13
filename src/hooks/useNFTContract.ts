
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { NFTMetadata } from '@/types/blockchain';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { getAirNodeNFTContract, createMetadataURI, formatContractError } from '@/utils/contractHelpers';

export const useNFTContract = () => {
  const { web3State, provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  const mintNFT = async (airNodeId: string, fractionCount: number, metadata: NFTMetadata) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeNFTContract(provider);
      
      // Create metadata URI
      const metadataURI = createMetadataURI({
        airNodeId: metadata.airNodeId,
        location: metadata.location,
        uptime: metadata.performance.uptime,
        earnings: metadata.performance.earnings,
        roi: metadata.performance.roi,
        totalFractions: metadata.totalFractions
      });
      
      // Call the mintAirNode function
      const tx = await contract.mintAirNode(
        web3State.account, // recipient address (current wallet)
        metadata.airNodeId,
        metadata.location,
        Math.floor(metadata.performance.uptime * 10), // uptime as percentage scaled by 10
        Math.floor(metadata.performance.earnings * 100), // earnings in cents
        Math.floor(metadata.performance.roi * 10), // ROI as percentage scaled by 10
        metadata.totalFractions,
        metadataURI
      );
      
      toast.info("NFT minting transaction submitted");
      console.log("Mint transaction:", tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // Find the minted token ID from the events
      const mintEvent = receipt.logs
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
        .filter((event: any) => event && event.name === "AirNodeMinted")[0];
      
      if (mintEvent) {
        const tokenId = mintEvent.args[0];
        toast.success(`NFT minted successfully with ID: ${tokenId}`);
        return { tokenId, transactionHash: receipt.hash };
      } else {
        toast.success("NFT minted successfully");
      }
    } catch (error) {
      console.error('Mint error:', error);
      toast.error(`Failed to mint NFT: ${formatContractError(error)}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const transferNFT = async (tokenId: string, toAddress: string) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeNFTContract(provider);
      const tx = await contract.transferFrom(web3State.account, toAddress, tokenId);
      
      toast.info("NFT transfer transaction submitted");
      
      await tx.wait();
      toast.success("NFT transferred successfully");
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(`Failed to transfer NFT: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const getTokenMetadata = async (tokenId: number) => {
    if (!provider) {
      toast.error("Provider not available");
      return null;
    }

    try {
      const contract = await getAirNodeNFTContract(provider);
      const metadata = await contract.getAirNodeMetadata(tokenId);
      return metadata;
    } catch (error) {
      console.error('Get metadata error:', error);
      toast.error(`Failed to get NFT metadata: ${formatContractError(error)}`);
      return null;
    }
  };

  return {
    mintNFT,
    transferNFT,
    getTokenMetadata,
    loading
  };
};
