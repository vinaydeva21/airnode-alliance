
import React from "react";
import { SearchBar } from "../SearchBar";
import { MarketplaceStats } from "../MarketplaceStats";
import { Pagination } from "../Pagination";
import AirNodeCard from "@/components/airnode/AirNodeCard";

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
  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarketplaceStats />
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse text-ana-purple">Loading AirNodes...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {airNodes.length > 0 ? (
            airNodes.map((node) => (
              <AirNodeCard key={node.id} {...node} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No AirNodes found matching your criteria
            </div>
          )}
        </div>
      )}
      
      <Pagination />
    </div>
  );
};
