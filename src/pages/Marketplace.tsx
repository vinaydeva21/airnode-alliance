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

              // Get NFT name from localStorage for accurate naming
              const mintedNFTs = JSON.parse(
                localStorage.getItem("mintedNFTs") || "[]"
              );
              const fractionalized = JSON.parse(
                localStorage.getItem("fractionalized") || "[]"
              );

              // Find the original NFT this fraction belongs to
              const relatedNFT = mintedNFTs.find((nft: any) =>
                fractionalized.some(
                  (f: any) =>
                    f.id === listing.fractionId && f.tokenId === nft.id
                )
              );

              // Use the actual NFT name if available, or extract from fractionId
              let name, location;
              if (relatedNFT) {
                name = relatedNFT.name;
                location = relatedNFT.location;
              } else {
                // Fallback to parsing from fractionId
                const parts = listing.fractionId.split("-");
                name = parts[0] || "AirNode";
                location = parts[1] || "Unknown";

                // Capitalize first letter
                name = name.charAt(0).toUpperCase() + name.slice(1);
                location = location.charAt(0).toUpperCase() + location.slice(1);
              }

              return {
                id: listing.fractionId,
                name: name,
                location: location,
                price: listing.price,
                imageUrl:
                  "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
                totalShares: details?.totalFractions?.toNumber() || 1000,
                availableShares: parseInt(listing.quantity || "100"),
                performance: {
                  uptime: 99.2,
                  earnings: 2.4,
                  roi: 18.6,
                },
              };
            })
          );

          // Fallback to localStorage if no contract listings
          if (transformedNodes.length === 0) {
            // Get fractionalized NFTs from localStorage
            const fractionalized = JSON.parse(
              localStorage.getItem("fractionalized") || "[]"
            );
            const localListings = JSON.parse(
              localStorage.getItem("listings") || "[]"
            );
            const mintedNFTs = JSON.parse(
              localStorage.getItem("mintedNFTs") || "[]"
            );

            console.log("Local storage listings:", localListings);
            console.log("Fractionalized NFTs:", fractionalized);
            console.log("Minted NFTs:", mintedNFTs);

            if (localListings.length > 0) {
              const mockNodes = localListings
                .filter((listing: any) => listing.isActive !== false)
                .map((listing: any) => {
                  const fractionInfo =
                    fractionalized.find(
                      (f: any) => f.id === listing.fractionId
                    ) || {};

                  // Find the original NFT this fraction belongs to
                  const relatedNFT = mintedNFTs.find(
                    (nft: any) => fractionInfo.tokenId === nft.id
                  );

                  let name, location;
                  if (relatedNFT) {
                    name = relatedNFT.name;
                    location = relatedNFT.location;
                  } else {
                    const parts = listing.fractionId.split("-");
                    name = parts[0] || "AirNode";
                    location = parts[1] || "Unknown";

                    // Capitalize first letter
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    location =
                      location.charAt(0).toUpperCase() + location.slice(1);
                  }

                  return {
                    id: listing.fractionId,
                    name: name,
                    location: location,
                    price: parseFloat(listing.price),
                    imageUrl:
                      "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
                    totalShares: fractionInfo.count || 1000,
                    availableShares: parseInt(listing.quantity || "100"),
                    performance: {
                      uptime: 99.2,
                      earnings: 2.4,
                      roi: 18.6,
                    },
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
          const localListings = JSON.parse(
            localStorage.getItem("listings") || "[]"
          );
          const fractionalized = JSON.parse(
            localStorage.getItem("fractionalized") || "[]"
          );
          const mintedNFTs = JSON.parse(
            localStorage.getItem("mintedNFTs") || "[]"
          );

          console.log(
            "Checking localStorage fallback. Listings:",
            localListings
          );

          if (localListings.length > 0) {
            const mockNodes = localListings
              .filter((listing: any) => listing.isActive !== false)
              .map((listing: any) => {
                const fractionInfo =
                  fractionalized.find(
                    (f: any) => f.id === listing.fractionId
                  ) || {};

                // Find the original NFT this fraction belongs to
                const relatedNFT = mintedNFTs.find(
                  (nft: any) => fractionInfo.tokenId === nft.id
                );

                let name, location;
                if (relatedNFT) {
                  name = relatedNFT.name;
                  location = relatedNFT.location;
                } else {
                  const parts = listing.fractionId.split("-");
                  name = parts[0] || "AirNode";
                  location = parts[1] || "Unknown";

                  // Capitalize first letter
                  name = name.charAt(0).toUpperCase() + name.slice(1);
                  location =
                    location.charAt(0).toUpperCase() + location.slice(1);
                }

                return {
                  id: listing.fractionId,
                  name: name,
                  location: location,
                  price: parseFloat(listing.price),
                  imageUrl:
                    "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
                  totalShares: fractionInfo.count || 1000,
                  availableShares: parseInt(listing.quantity || "100"),
                  performance: {
                    uptime: 99.2,
                    earnings: 2.4,
                    roi: 18.6,
                  },
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
          const localListings = JSON.parse(
            localStorage.getItem("listings") || "[]"
          );
          const fractionalized = JSON.parse(
            localStorage.getItem("fractionalized") || "[]"
          );
          const mintedNFTs = JSON.parse(
            localStorage.getItem("mintedNFTs") || "[]"
          );

          if (localListings.length > 0) {
            const mockNodes = localListings
              .filter((listing: any) => listing.isActive !== false)
              .map((listing: any) => {
                const fractionInfo =
                  fractionalized.find(
                    (f: any) => f.id === listing.fractionId
                  ) || {};

                // Find the original NFT this fraction belongs to
                const relatedNFT = mintedNFTs.find(
                  (nft: any) => fractionInfo.tokenId === nft.id
                );

                let name, location;
                if (relatedNFT) {
                  name = relatedNFT.name;
                  location = relatedNFT.location;
                } else {
                  const parts = listing.fractionId.split("-");
                  name = parts[0] || "AirNode";
                  location = parts[1] || "Unknown";

                  // Capitalize first letter
                  name = name.charAt(0).toUpperCase() + name.slice(1);
                  location =
                    location.charAt(0).toUpperCase() + location.slice(1);
                }

                return {
                  id: listing.fractionId,
                  name: name,
                  location: location,
                  price: parseFloat(listing.price),
                  imageUrl:
                    "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
                  totalShares: fractionInfo.count || 1000,
                  availableShares: parseInt(listing.quantity || "100"),
                  performance: {
                    uptime: 99.2,
                    earnings: 2.4,
                    roi: 18.6,
                  },
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

  // Default AirNodes as fallback with new images
  const defaultAirNodes = [
    {
      id: "portal-180",
      name: "Portal 180",
      location: "Nairobi, Kenya",
      price: 45,
      imageUrl: "/lovable-uploads/4a8968a8-9af2-40aa-9480-469f6961f03c.png",
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
      imageUrl: "/lovable-uploads/2a34fc0e-ef2f-427d-b83f-b2ac89eac128.png",
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
      imageUrl: "/lovable-uploads/41074963-71ad-4ff5-98d5-15013da0f5dd.png",
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
      imageUrl: "/lovable-uploads/0bde1343-f33a-4772-afec-f05061c54e5c.png",
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
