import React from "react";
import { SearchBar } from "../SearchBar";
import { MarketplaceStats } from "../MarketplaceStats";
import { Pagination } from "../Pagination";
import AirNodeCard, {
  AirNodePerformance,
} from "@/components/airnode/AirNodeCard";
import { UTxO } from "@lucid-evolution/lucid";

interface BuyNodesTabProps {
  airNodes: Array<{
    metadata: {
      name: string;
      image: string;
      location: string;
      airNodeId: string;
      fractions: number;
      performance?: AirNodePerformance;
    };
    utxo: UTxO;
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
              <AirNodeCard
                key={node.metadata.airNodeId}
                {...node.metadata}
                utxo={node.utxo}
              />
            ))}
      </div>

      <Pagination />
    </div>
  );
};
