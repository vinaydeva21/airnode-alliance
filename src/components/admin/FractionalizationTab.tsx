
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, ChevronsUpDown, Check, Package, Divide } from "lucide-react";
import { useEthereumContracts } from "@/hooks/useEthereumContracts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";

export default function FractionalizationTab() {
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [isFractionalizing, setIsFractionalizing] = useState(false);
  const [loadingNFTs, setLoadingNFTs] = useState(true);
  const { getUserMintedNFTs } = useEthereumContracts();
  const { web3State } = useWeb3();
  const navigate = useNavigate();
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);

  // Fetch user's NFTs when the component mounts
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (web3State.connected) {
        setLoadingNFTs(true);
        try {
          const nfts = await getUserMintedNFTs();
          console.log("Fetched user NFTs:", nfts);
          setMintedNFTs(nfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
          toast.error("Failed to load your NFTs");
        } finally {
          setLoadingNFTs(false);
        }
      }
    };

    fetchUserNFTs();
  }, [web3State.connected, getUserMintedNFTs]);

  const handleToggleNFT = (id: string) => {
    setSelectedNFTs(prev => 
      prev.includes(id) 
        ? prev.filter(nftId => nftId !== id)
        : [...prev, id]
    );
  };

  const handleFractionalize = () => {
    if (selectedNFTs.length === 0) {
      toast.error("Please select at least one NFT to fractionalize");
      return;
    }

    setIsFractionalizing(true);
    
    // Simulate the fractionalization process
    toast.info(`Fractionalizing ${selectedNFTs.length} NFTs...`);
    
    // Show the spinner for 15 seconds
    setTimeout(() => {
      toast.success("NFTs successfully fractionalized", {
        description: "Your NFTs are now available in the marketplace"
      });
      setIsFractionalizing(false);
      setSelectedNFTs([]);
      
      // Navigate to marketplace after fractionalization
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    }, 15000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-ana-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Divide className="h-6 w-6 text-ana-purple" />
            Fractionalize NFTs
          </CardTitle>
          <CardDescription>
            Split your NFTs into tradable fractions that can be listed on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingNFTs ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader className="h-8 w-8 text-ana-purple animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your NFTs...</p>
            </div>
          ) : mintedNFTs.length > 0 ? (
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted/50">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">AirNode ID</div>
                  <div className="col-span-3">Location</div>
                  <div className="col-span-2">Total Fractions</div>
                  <div className="col-span-3">Date Minted</div>
                </div>
                <div className="divide-y">
                  {mintedNFTs.map((nft, index) => (
                    <div 
                      key={nft.airNodeId || `nft-${index}`} 
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="col-span-1">
                        <Checkbox 
                          id={`select-${nft.airNodeId}`}
                          checked={selectedNFTs.includes(nft.airNodeId)}
                          onCheckedChange={() => handleToggleNFT(nft.airNodeId)}
                        />
                      </div>
                      <div className="col-span-3 font-medium">
                        {nft.airNodeId}
                      </div>
                      <div className="col-span-3 text-muted-foreground">
                        {nft.location || "Ethereum Network"}
                      </div>
                      <div className="col-span-2">
                        {nft.fractions || 1000}
                      </div>
                      <div className="col-span-3 text-sm text-muted-foreground">
                        {nft.timestamp 
                          ? new Date(nft.timestamp).toLocaleDateString() 
                          : new Date().toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleFractionalize} 
                className="w-full bg-ana-purple hover:bg-ana-purple/80"
                disabled={selectedNFTs.length === 0 || isFractionalizing}
              >
                {isFractionalizing ? (
                  <div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Fractionalizing on Sepolia Testnet...
                  </div>
                ) : (
                  `Fractionalize ${selectedNFTs.length} Selected NFT${selectedNFTs.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-md">
              <Package className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You don't have any NFTs to fractionalize</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/admin')}
              >
                Mint NFTs first
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
