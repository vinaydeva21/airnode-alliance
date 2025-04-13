
import { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, Wallet, Coins } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { MarketplaceTabs } from "@/components/marketplace/MarketplaceTabs";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useFractionalization } from "@/hooks/useFractionalization";
import { toast } from "sonner";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const [airNodes, setAirNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { getListings } = useMarketplace();
  const { getFractionDetails } = useFractionalization();
  
  // Fetch marketplace listings when component mounts
  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        // Try to get listings from contract
        const listings = await getListings();
        
        // Transform listings to AirNode format
        if (listings && listings.length > 0) {
          const transformedNodes = await Promise.all(
            listings.map(async (listing) => {
              // Get fraction details
              const details = await getFractionDetails(listing.fractionId);
              const name = listing.fractionId.split('-')[0] || "AirNode";
              const location = listing.fractionId.split('-')[1] || "Unknown";
              
              return {
                id: listing.fractionId,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                location: location.charAt(0).toUpperCase() + location.slice(1),
                price: listing.price,
                imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
                totalShares: details?.totalFractions?.toNumber() || 1000,
                availableShares: parseInt(listing.quantity || "100"),
                performance: {
                  uptime: 99.2,
                  earnings: 2.4,
                  roi: 18.6
                }
              };
            })
          );
          
          // Fallback to localStorage if no contract listings
          if (transformedNodes.length === 0) {
            // Get fractionalized NFTs from localStorage
            const fractionalized = JSON.parse(localStorage.getItem('fractionalized') || '[]');
            const localListings = JSON.parse(localStorage.getItem('listings') || '[]');
            
            console.log("Local storage listings:", localListings);
            console.log("Fractionalized NFTs:", fractionalized);
            
            if (localListings.length > 0) {
              const mockNodes = localListings
                .filter((listing: any) => listing.isActive !== false)
                .map((listing: any) => {
                  const fractionInfo = fractionalized.find((f: any) => f.id === listing.fractionId) || {};
                  const name = listing.fractionId.split('-')[0] || "AirNode";
                  const location = listing.fractionId.split('-')[1] || "Unknown";
                  
                  return {
                    id: listing.fractionId,
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    location: location.charAt(0).toUpperCase() + location.slice(1),
                    price: parseFloat(listing.price),
                    imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
                    totalShares: fractionInfo.count || 1000,
                    availableShares: parseInt(listing.quantity || "100"),
                    performance: {
                      uptime: 99.2,
                      earnings: 2.4,
                      roi: 18.6
                    }
                  };
                });
              
              console.log("Generated mock nodes:", mockNodes);
              setAirNodes(mockNodes.length > 0 ? mockNodes : defaultAirNodes);
            } else {
              // Use default airNodes as final fallback
              setAirNodes(defaultAirNodes);
            }
          } else {
            setAirNodes(transformedNodes);
          }
        } else {
          // Check localStorage for fallback
          const localListings = JSON.parse(localStorage.getItem('listings') || '[]');
          const fractionalized = JSON.parse(localStorage.getItem('fractionalized') || '[]');
          
          console.log("Checking localStorage fallback. Listings:", localListings);
          
          if (localListings.length > 0) {
            const mockNodes = localListings
              .filter((listing: any) => listing.isActive !== false)
              .map((listing: any) => {
                const fractionInfo = fractionalized.find((f: any) => f.id === listing.fractionId) || {};
                const name = listing.fractionId.split('-')[0] || "AirNode";
                const location = listing.fractionId.split('-')[1] || "Unknown";
                
                return {
                  id: listing.fractionId,
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  location: location.charAt(0).toUpperCase() + location.slice(1),
                  price: parseFloat(listing.price),
                  imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
                  totalShares: fractionInfo.count || 1000,
                  availableShares: parseInt(listing.quantity || "100"),
                  performance: {
                    uptime: 99.2,
                    earnings: 2.4,
                    roi: 18.6
                  }
                };
              });
            
            console.log("Generated mock nodes from local listings:", mockNodes);
            setAirNodes(mockNodes.length > 0 ? mockNodes : defaultAirNodes);
          } else {
            // Use default airNodes as fallback
            setAirNodes(defaultAirNodes);
          }
        }
      } catch (error) {
        console.error("Error fetching marketplace listings:", error);
        toast.error("Failed to load marketplace listings");
        
        // Try localStorage as fallback
        try {
          const localListings = JSON.parse(localStorage.getItem('listings') || '[]');
          const fractionalized = JSON.parse(localStorage.getItem('fractionalized') || '[]');
          
          if (localListings.length > 0) {
            const mockNodes = localListings
              .filter((listing: any) => listing.isActive !== false)
              .map((listing: any) => {
                const fractionInfo = fractionalized.find((f: any) => f.id === listing.fractionId) || {};
                const name = listing.fractionId.split('-')[0] || "AirNode";
                const location = listing.fractionId.split('-')[1] || "Unknown";
                
                return {
                  id: listing.fractionId,
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  location: location.charAt(0).toUpperCase() + location.slice(1),
                  price: parseFloat(listing.price),
                  imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
                  totalShares: fractionInfo.count || 1000,
                  availableShares: parseInt(listing.quantity || "100"),
                  performance: {
                    uptime: 99.2,
                    earnings: 2.4,
                    roi: 18.6
                  }
                };
              });
            
            setAirNodes(mockNodes.length > 0 ? mockNodes : defaultAirNodes);
          } else {
            setAirNodes(defaultAirNodes);
          }
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          setAirNodes(defaultAirNodes);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchListings();
  }, []);
  
  // Default AirNodes as fallback
  const defaultAirNodes = [
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
        roi: 18.6
      }
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
        roi: 19.2
      }
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
        roi: 22.4
      }
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
        roi: 20.1
      }
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
      icon: <Wallet className="h-10 w-10 text-ana-purple" />
    },
    { 
      id: "loan-2", 
      title: "Yield Farming", 
      description: "Provide liquidity with your ANA tokens and earn enhanced yields",
      apy: "16%",
      ltv: "N/A",
      term: "Flexible",
      icon: <Coins className="h-10 w-10 text-green-400" />
    },
    { 
      id: "loan-3", 
      title: "ANA Staking", 
      description: "Stake your ANA tokens to earn rewards and increase governance voting power",
      apy: "12%",
      ltv: "N/A",
      term: "30/90/180 days",
      icon: <TrendingUp className="h-10 w-10 text-blue-400" />
    }
  ];

  return (
    <NetworkBackground>
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">AirNode Marketplace</h1>
          
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
