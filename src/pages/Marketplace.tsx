import { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, Wallet, Coins } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { MarketplaceTabs } from "@/components/marketplace/MarketplaceTabs";
import { useEnhancedMarketplace } from "@/hooks/useEnhancedMarketplace";
import { toast } from "sonner";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const [airNodes, setAirNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { marketplaceNodes, loading: marketplaceLoading, loadMarketplaceData } = useEnhancedMarketplace();

  // Use enhanced marketplace nodes instead of manual fetching
  useEffect(() => {
    // Enhanced marketplace hook handles data fetching automatically
    setAirNodes(marketplaceNodes);
    setLoading(marketplaceLoading);
  }, [marketplaceNodes, marketplaceLoading]);

  // Default AirNodes as fallback with new images
  const defaultAirNodes = [
    {
      id: "portal-180",
      name: "Portal 180",
      location: "Nairobi, Kenya",
      price: 45,
      imageUrl: "/lovable-uploads/a70daab2-29e5-4fa4-b829-3329574be93f.png",
      totalShares: 1000,
      availableShares: 850,
      performance: {
        uptime: 99.2,
        earnings: 2.4,
        roi: 18.6,
      },
    },
    {
      id: "portal-360",
      name: "Portal 360",
      location: "Lagos, Nigeria",
      price: 60,
      imageUrl: "/lovable-uploads/3ae2813d-4b87-4f87-89d7-24d53bbd4467.png",
      totalShares: 1000,
      availableShares: 600,
      performance: {
        uptime: 98.7,
        earnings: 2.9,
        roi: 19.2,
      },
    },
    {
      id: "apex-90",
      name: "Apex 90",
      price: 75,
      location: "Addis Ababa, Ethiopia",
      imageUrl: "/lovable-uploads/59d86994-f6a9-4570-b53c-519a936f6a3f.png",
      totalShares: 2000,
      availableShares: 1200,
      performance: {
        uptime: 99.8,
        earnings: 3.6,
        roi: 22.4,
      },
    },
    {
      id: "apex-180",
      name: "Apex 180",
      price: 80,
      location: "Kampala, Uganda",
      imageUrl: "/lovable-uploads/2da80626-af04-44e1-ae5b-ebb332918edf.png",
      totalShares: 2000,
      availableShares: 1800,
      performance: {
        uptime: 97.9,
        earnings: 3.2,
        roi: 20.1,
      },
    },
  ];

  const lendingOptions = [
    {
      id: "loan-1",
      title: "AirNode-Backed Loan",
      description: "Borrow stablecoins using your AirNode shares as collateral",
      apy: "4.5%",
      ltv: "70%",
      term: "1-12 months",
      icon: <Wallet className="h-10 w-10 text-ana-purple" />,
    },
    {
      id: "loan-2",
      title: "Yield Farming",
      description:
        "Provide liquidity with your ANA tokens and earn enhanced yields",
      apy: "16%",
      ltv: "N/A",
      term: "Flexible",
      icon: <Coins className="h-10 w-10 text-green-400" />,
    },
    {
      id: "loan-3",
      title: "ANA Staking",
      description:
        "Stake your ANA tokens to earn rewards and increase governance voting power",
      apy: "12%",
      ltv: "N/A",
      term: "30/90/180 days",
      icon: <TrendingUp className="h-10 w-10 text-blue-400" />,
    },
  ];

  return (
    <NetworkBackground>
      {/* <Navbar /> */}

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            AirNode Marketplace
          </h1>

          <MarketplaceTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            airNodes={airNodes}
            lendingOptions={lendingOptions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            loading={loading}
          />
        </div>
      </div>

      <Footer />
    </NetworkBackground>
  );
};

export default Marketplace;
