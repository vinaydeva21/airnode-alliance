
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
  loading?: boolean;
}

export const MarketplaceTabs: React.FC<MarketplaceTabsProps> = ({
  activeTab,
  setActiveTab,
  airNodes,
  lendingOptions,
  searchQuery,
  setSearchQuery,
  loading = false
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
      <TabsList className="grid grid-cols-2 max-w-md bg-mono-gray-100 p-1 rounded-lg border border-mono-gray-200">
        <TabsTrigger 
          value="buy" 
          className="flex items-center gap-2 text-mono-gray-600 data-[state=active]:bg-white data-[state=active]:text-mono-gray-900 data-[state=active]:shadow-sm rounded-md"
        >
          <ShoppingCart size={16} />
          Buy AirNodes
        </TabsTrigger>
        <TabsTrigger 
          value="lending" 
          className="flex items-center gap-2 text-mono-gray-600 data-[state=active]:bg-white data-[state=active]:text-mono-gray-900 data-[state=active]:shadow-sm rounded-md"
        >
          <Wallet size={16} />
          DeFi Services
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="buy" className="mt-8">
        <BuyNodesTab 
          airNodes={airNodes} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="lending" className="mt-8">
        <DeFiServicesTab lendingOptions={lendingOptions} />
      </TabsContent>
    </Tabs>
  );
};
