import { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, Wallet, Coins } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { MarketplaceTabs } from "@/components/marketplace/MarketplaceTabs";
import { useEthereumContracts } from "@/hooks/useEthereumContracts";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";

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
  timestamp?: number;
  isNewlyMinted?: boolean;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const { getMarketplaceListings, mintedNFTs, getUserMintedNFTs } = useEthereumContracts();
  const { web3State } = useWeb3();
  const [airNodes, setAirNodes] = useState<AirNode[]>([
    {
      id: "portal-180",
      name: "Portal 180",
      location: "Nairobi, Kenya",
      price: 45,
      imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
      totalShares: 1000,
      availableShares: 850,
      performance: {
        uptime: 99.2,
        earnings: 2.4,
        roi: 18.6,
      },
      timestamp: Date.now() - 1000000,
    },
    {
      id: "portal-360",
      name: "Portal 360",
      location: "Lagos, Nigeria",
      price: 60,
      imageUrl: "/lovable-uploads/b43073b7-44b5-4631-b30f-dc3671d1e301.png",
      totalShares: 1000,
      availableShares: 600,
      performance: {
        uptime: 98.7,
        earnings: 2.9,
        roi: 19.2,
      },
      timestamp: Date.now() - 900000,
    },
    {
      id: "nexus-1",
      name: "Nexus I",
      price: 75,
      location: "Addis Ababa, Ethiopia",
      imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
      totalShares: 2000,
      availableShares: 1200,
      performance: {
        uptime: 99.8,
        earnings: 3.6,
        roi: 22.4,
      },
      timestamp: Date.now() - 800000,
    },
    {
      id: "nexus-2",
      name: "Nexus II",
      price: 80,
      location: "Kampala, Uganda",
      imageUrl: "/lovable-uploads/b43073b7-44b5-4631-b30f-dc3671d1e301.png",
      totalShares: 2000,
      availableShares: 1800,
      performance: {
        uptime: 97.9,
        earnings: 3.2,
        roi: 20.1,
      },
      timestamp: Date.now() - 700000,
    },
  ]);

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

  useEffect(() => {
    const loadMarketplaceData = async () => {
      if (web3State.connected) {
        try {
          const userNFTs = await getUserMintedNFTs();
          console.log("User minted NFTs:", userNFTs);
          
          const listings = await getMarketplaceListings();
          console.log("Marketplace listings:", listings);
          
          if (mintedNFTs.length > 0) {
            console.log("Processing minted NFTs for marketplace display:", mintedNFTs);
            
            const newNodes = mintedNFTs.map(nft => ({
              id: nft.airNodeId || `token-${nft.tokenId}`,
              name: `AirNode ${nft.airNodeId || nft.tokenId}`,
              location: "Ethereum Network",
              price: 50,
              imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
              totalShares: parseInt(nft.fractions) || 1000,
              availableShares: parseInt(nft.fractions) || 1000,
              performance: {
                uptime: 99.0,
                earnings: 2.5,
                roi: 18.0,
              },
              isNewlyMinted: true,
              timestamp: nft.timestamp || Date.now()
            }));
            
            const existingIds = airNodes.map(node => node.id);
            const filteredNewNodes = newNodes.filter(node => !existingIds.includes(node.id));
            
            if (filteredNewNodes.length > 0) {
              const sortedNodes = [...filteredNewNodes, ...airNodes]
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              
              setAirNodes(sortedNodes);
              console.log("Updated airNodes with newly minted NFTs:", sortedNodes);
            }
          }
        } catch (error) {
          console.error("Error loading marketplace data:", error);
        }
      }
    };
    
    loadMarketplaceData();
  }, [web3State.connected, mintedNFTs, getMarketplaceListings, getUserMintedNFTs]);

  return (
    <NetworkBackground>
      <Navbar />

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
          />
        </div>
      </div>

      <Footer />
    </NetworkBackground>
  );
};

export default Marketplace;
