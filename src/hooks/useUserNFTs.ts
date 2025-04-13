
import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { getAirNodeNFTContract } from '@/utils/contractHelpers';
import { toast } from 'sonner';
import { ethers } from 'ethers';

export interface UserNFT {
  id: string;
  name: string;
  location: string;
  metadata?: any;
}

export const useUserNFTs = () => {
  const { web3State, provider } = useWeb3();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserNFTs = async () => {
    if (!web3State.connected || !provider || !web3State.account) {
      return [];
    }
    
    setLoading(true);
    try {
      const contract = await getAirNodeNFTContract(provider);
      
      // Get the user's NFT balance
      const balance = await contract.balanceOf(web3State.account);
      console.log("User NFT balance:", balance.toString());
      
      const userNFTs: UserNFT[] = [];
      
      // Loop through each NFT owned by the user
      for (let i = 0; i < balance; i++) {
        try {
          // Get tokenId for this index
          const tokenId = await contract.tokenOfOwnerByIndex(web3State.account, i);
          console.log("Found tokenId:", tokenId.toString());
          
          // Get metadata for this token
          const metadata = await contract.getAirNodeMetadata(tokenId);
          console.log("Token metadata:", metadata);
          
          // Check if it's already fractionalized
          if (!metadata.fractionalized) {
            userNFTs.push({
              id: tokenId.toString(),
              name: `${metadata.airNodeId}`,
              location: metadata.location,
              metadata
            });
          }
        } catch (err) {
          console.error("Error fetching NFT at index", i, err);
        }
      }
      
      console.log("User's NFTs:", userNFTs);
      setNfts(userNFTs);
      return userNFTs;
    } catch (error) {
      console.error("Error fetching user NFTs:", error);
      toast.error("Could not load your NFTs");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (web3State.connected) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [web3State.connected, web3State.account]);

  return {
    nfts,
    loading,
    fetchUserNFTs
  };
};
