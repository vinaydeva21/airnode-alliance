
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
}

export const BuyNodesTab: React.FC<BuyNodesTabProps> = ({ 
  airNodes, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarketplaceStats />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {airNodes.map((node) => (
          <AirNodeCard key={node.id} {...node} />
        ))}
      </div>
      
      <Pagination />
    </div>
  );
};
