import React from "react";
import { SearchBar } from "../SearchBar";
import { MarketplaceStats } from "../MarketplaceStats";
import { Pagination } from "../Pagination";
import AirNodeCard, {
  AirNodePerformance,
} from "@/components/airnode/AirNodeCard";

interface BuyNodesTabProps {
  airNodes: Array<{
    name: string;
    image: string;
    location: string;
    airNodeId: string;
    fractions: string;
    performance?: AirNodePerformance;
  }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BuyNodesTab: React.FC<BuyNodesTabProps> = ({
  airNodes,
  searchQuery,
  setSearchQuery,
}) => {
  // fetch contract UTxOs for AirNodes and pass it to AirNodeCard
  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarketplaceStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {airNodes.length === 0
          ? "fetching available nodes"
          : airNodes.map((node) => (
              <AirNodeCard key={node.airNodeId} {...node} />
            ))}
      </div>

      <Pagination />
    </div>
  );
};
