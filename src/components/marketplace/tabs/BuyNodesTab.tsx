
import React, { useState, useEffect } from "react";
import { SearchBar } from "../SearchBar";
import { MarketplaceStats } from "../MarketplaceStats";
import { Pagination } from "../Pagination";
import AirNodeCard from "@/components/airnode/AirNodeCard";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { EnhancedNodePurchaseDialog } from "@/components/airnode/EnhancedNodePurchaseDialog";
import { toast } from "sonner";

interface BuyNodesTabProps {
  airNodes: Array<{
    id: string;
    name: string;
    location: string;
    price: number;
    imageUrl: string;
    totalShares: number;
    availableShares: number;
    performance: {
      uptime: number;
      earnings: number;
      roi: number;
    };
  }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading?: boolean;
}

export const BuyNodesTab: React.FC<BuyNodesTabProps> = ({ 
  airNodes, 
  searchQuery, 
  setSearchQuery,
  loading = false
}) => {
  // Get user NFTs to help with name recognition
  const { nfts } = useUserNFTs();
  
  // State to manage local available shares for immediate UI updates
  const [localAirNodes, setLocalAirNodes] = useState(airNodes);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  // Update local state when airNodes prop changes
  useEffect(() => {
    setLocalAirNodes(airNodes);
  }, [airNodes]);

  // Handle successful purchase - reduce available shares immediately
  const handlePurchaseSuccess = (nodeId: string, purchasedShares: number) => {
    setLocalAirNodes(prev => 
      prev.map(node => 
        node.id === nodeId 
          ? { ...node, availableShares: Math.max(0, node.availableShares - purchasedShares) }
          : node
      )
    );
    toast.success("Shares purchased successfully!");
    setPurchaseDialogOpen(false);
  };

  // Map over the airNodes to ensure proper naming
  const displayNodes = localAirNodes.map(node => {
    // Try to find the original NFT name from user's minted NFTs
    const originalNFT = nfts.find(nft => 
      // Check if this is a fraction of one of the user's NFTs
      nft.fractionalized && node.id.includes(nft.id)
    );
    
    // If found, use the original name, otherwise keep current name
    return {
      ...node,
      name: originalNFT ? originalNFT.name : node.name
    };
  });

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarketplaceStats />
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse text-ana-purple">Loading AirNodes...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayNodes.length > 0 ? (
            displayNodes.map((node) => (
              <AirNodeCard 
                key={node.id} 
                {...node} 
                onPurchaseClick={() => {
                  setSelectedNode(node);
                  setPurchaseDialogOpen(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No AirNodes found matching your criteria
            </div>
          )}
        </div>
      )}
      
      <Pagination />

      {/* Enhanced Purchase Dialog */}
      {selectedNode && (
        <EnhancedNodePurchaseDialog
          open={purchaseDialogOpen}
          onOpenChange={setPurchaseDialogOpen}
          airNode={selectedNode}
          onPurchaseSuccess={(purchasedShares: number) => 
            handlePurchaseSuccess(selectedNode.id, purchasedShares)
          }
        />
      )}
    </div>
  );
};
