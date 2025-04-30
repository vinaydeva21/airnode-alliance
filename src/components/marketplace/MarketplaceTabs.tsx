
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Wallet } from "lucide-react";
import { BuyNodesTab } from "./tabs/BuyNodesTab";
import { DeFiServicesTab } from "./tabs/DeFiServicesTab";

interface AirNode {
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
}

interface LendingOption {
  id: string;
  title: string;
  description: string;
  apy: string;
  ltv: string;
  term: string;
  icon: React.ReactNode;
}

interface MarketplaceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  airNodes: AirNode[];
  lendingOptions: LendingOption[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MarketplaceTabs: React.FC<MarketplaceTabsProps> = ({
  activeTab,
  setActiveTab,
  airNodes,
  lendingOptions,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
      <TabsList className="grid grid-cols-2 max-w-md bg-ana-darkblue/50">
        <TabsTrigger value="buy" className="flex items-center gap-2">
          <ShoppingCart size={16} />
          Buy AirNodes
        </TabsTrigger>
        <TabsTrigger value="lending" className="flex items-center gap-2">
          <Wallet size={16} />
          DeFi Services
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="buy" className="mt-6">
        <BuyNodesTab 
          airNodes={airNodes} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </TabsContent>
      
      <TabsContent value="lending" className="mt-6">
        <DeFiServicesTab lendingOptions={lendingOptions} />
      </TabsContent>
    </Tabs>
  );
};
