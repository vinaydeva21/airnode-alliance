
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { MarketplaceListing } from '@/types/blockchain';
import { toast } from 'sonner';

export const useMarketplace = () => {
  const { web3State, contracts } = useWeb3();
  const [loading, setLoading] = useState(false);

  const listForSale = async (fractionId: string, price: number) => {
    if (!web3State.connected || !contracts) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await contracts.listForSale(fractionId, price);
      toast.success("NFT listed for sale");
    } catch (error) {
      console.error('Listing error:', error);
      toast.error("Failed to list NFT");
    } finally {
      setLoading(false);
    }
  };

  const buyFraction = async (fractionId: string, price: number) => {
    if (!web3State.connected || !contracts) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      await contracts.buyFraction(fractionId, price);
      toast.success("Purchase successful");
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error("Failed to purchase NFT");
    } finally {
      setLoading(false);
    }
  };

  return {
    listForSale,
    buyFraction,
    loading
  };
};
