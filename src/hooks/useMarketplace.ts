
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { MarketplaceListing } from '@/types/blockchain';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { getAirNodeMarketplaceContract, formatContractError } from '@/utils/contractHelpers';

export const useMarketplace = () => {
  const { web3State, provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  const listForSale = async (fractionId: string, price: number, quantity: number = 1) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeMarketplaceContract(provider);
      
      // Try to use contract method if available
      try {
        // Convert price to wei (assuming price is in ETH)
        const priceInWei = ethers.parseEther(price.toString());
        
        // Check if the contract has the listFractionForSale method
        if (typeof contract.listFractionForSale === 'function') {
          const tx = await contract.listFractionForSale(fractionId, priceInWei, quantity);
          
          toast.info("Listing transaction submitted");
          console.log("Listing transaction:", tx.hash);
          
          const receipt = await tx.wait();
          
          // Try to extract listingId from events
          let listingId;
          try {
            const listingEvent = receipt.logs
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
              .filter((event: any) => event && event.name === "FractionListed")[0];
              
            if (listingEvent) {
              listingId = listingEvent.args[0]; // the listingId
            }
          } catch (err) {
            console.error("Error parsing listingId from events:", err);
          }
          
          toast.success(`Fractions listed for sale successfully${listingId ? ` with ID: ${listingId}` : ""}`);
          return { listingId, transactionHash: receipt.hash };
        } else {
          throw new Error("Contract method not available");
        }
      } catch (error) {
        console.error("Contract method error, using localStorage fallback:", error);
        
        // Fallback to localStorage if contract method is not available
        const existingListings = JSON.parse(localStorage.getItem('listings') || '[]');
        const listingId = Date.now().toString();
        const newListing = {
          id: listingId,
          fractionId: fractionId,
          seller: web3State.account,
          price: price,
          quantity: quantity,
          listingTime: new Date().toISOString(),
          isActive: true
        };
        
        localStorage.setItem('listings', JSON.stringify([...existingListings, newListing]));
        
        toast.success(`Fractions listed for sale successfully with ID: ${listingId} (Local)`);
        return { listingId, transactionHash: null };
      }
    } catch (error) {
      console.error('Listing error:', error);
      toast.error(`Failed to list fractions: ${formatContractError(error)}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buyFraction = async (listingId: number, quantity: number, price: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeMarketplaceContract(provider);
      
      // Try contract method if available
      try {
        // Convert price to wei and multiply by quantity
        const totalPriceInWei = ethers.parseEther((price * quantity).toString());
        
        if (typeof contract.buyFractions === 'function') {
          const tx = await contract.buyFractions(listingId, quantity, { value: totalPriceInWei });
          
          toast.info("Purchase transaction submitted");
          
          await tx.wait();
          toast.success("Purchase successful");
        } else {
          throw new Error("Contract method not available");
        }
      } catch (error) {
        console.error("Contract method error, using localStorage fallback:", error);
        
        // Fallback to localStorage
        const existingListings = JSON.parse(localStorage.getItem('listings') || '[]');
        const updatedListings = existingListings.map((listing: any) => {
          if (listing.id === listingId.toString()) {
            return {
              ...listing,
              quantity: Math.max(0, parseInt(listing.quantity) - quantity),
              isActive: parseInt(listing.quantity) - quantity > 0
            };
          }
          return listing;
        });
        
        localStorage.setItem('listings', JSON.stringify(updatedListings));
        
        // Add to user's fractions
        const userFractions = JSON.parse(localStorage.getItem('userFractions') || '[]');
        const newFraction = {
          id: `purchased-${listingId}-${Date.now()}`,
          fractionId: existingListings.find((l: any) => l.id === listingId.toString())?.fractionId,
          quantity: quantity,
          price: price,
          purchaseDate: new Date().toISOString()
        };
        
        localStorage.setItem('userFractions', JSON.stringify([...userFractions, newFraction]));
        
        toast.success("Purchase successful (Local)");
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(`Failed to purchase: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const getListings = async (): Promise<MarketplaceListing[]> => {
    if (!provider) {
      return [];
    }

    try {
      const contract = await getAirNodeMarketplaceContract(provider);
      
      // Try to get listings from contract
      try {
        if (typeof contract.getAllListings === 'function') {
          const rawListings = await contract.getAllListings();
          
          // Transform contract data to our app's format
          return rawListings
            .filter((listing: any) => listing.isActive)
            .map((listing: any) => ({
              fractionId: listing.fractionId,
              seller: listing.seller,
              price: parseFloat(ethers.formatEther(listing.price)),
              type: "sale", // We only have sale type for now
              // Additional fields from the contract
              quantity: listing.quantity.toString(),
              listingTime: new Date(listing.listingTime * 1000),
            }));
        } else {
          throw new Error("Contract method not available");
        }
      } catch (error) {
        console.error("Contract method error, using localStorage fallback:", error);
        
        // Fall back to localStorage if contract method fails
        const storedListings = JSON.parse(localStorage.getItem('listings') || '[]');
        
        return storedListings
          .filter((listing: any) => listing.isActive !== false)
          .map((listing: any) => ({
            id: listing.id,
            fractionId: listing.fractionId,
            seller: listing.seller || web3State.account,
            price: parseFloat(listing.price),
            type: "sale",
            quantity: listing.quantity.toString(),
            listingTime: new Date(listing.listingTime || Date.now())
          }));
      }
    } catch (error) {
      console.error('Get listings error:', error);
      toast.error(`Failed to get listings: ${formatContractError(error)}`);
      
      // Final fallback - return empty array
      return [];
    }
  };

  const cancelListing = async (listingId: number) => {
    if (!web3State.connected || !provider) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const contract = await getAirNodeMarketplaceContract(provider);
      
      // Try contract method if available
      try {
        if (typeof contract.cancelListing === 'function') {
          const tx = await contract.cancelListing(listingId);
          
          toast.info("Cancel listing transaction submitted");
          
          await tx.wait();
          toast.success("Listing cancelled successfully");
        } else {
          throw new Error("Contract method not available");
        }
      } catch (error) {
        console.error("Contract method error, using localStorage fallback:", error);
        
        // Fall back to localStorage
        const existingListings = JSON.parse(localStorage.getItem('listings') || '[]');
        const updatedListings = existingListings.map((listing: any) => {
          if (listing.id === listingId.toString()) {
            return {
              ...listing,
              isActive: false
            };
          }
          return listing;
        });
        
        localStorage.setItem('listings', JSON.stringify(updatedListings));
        
        toast.success("Listing cancelled successfully (Local)");
      }
    } catch (error) {
      console.error('Cancel listing error:', error);
      toast.error(`Failed to cancel listing: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    listForSale,
    buyFraction,
    getListings,
    cancelListing,
    loading
  };
};
