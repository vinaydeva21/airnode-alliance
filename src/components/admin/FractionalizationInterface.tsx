
import React, { useState } from "react";
import { 
  Split, Search, Gem, ChevronRight, ArrowRight, 
  Check, X, AlertTriangle, ZoomIn
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useMarketplace } from "@/hooks/useMarketplace";
import { toast } from "sonner";

type NFTItem = {
  id: string;
  name: string;
  location: string;
  fractionalized: boolean;
  fractions: number;
  listed: boolean;
};

export const FractionalizationInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [fractionCount, setFractionCount] = useState(1000);
  const [price, setPrice] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const { loading } = useNFTContract();
  const { listForSale } = useMarketplace();

  // Sample NFT data - in a real app, this would come from your blockchain or API
  const nfts: NFTItem[] = [
    { id: "portal-180", name: "Portal 180", location: "Nairobi, Kenya", fractionalized: false, fractions: 0, listed: false },
    { id: "portal-360", name: "Portal 360", location: "Lagos, Nigeria", fractionalized: true, fractions: 1000, listed: true },
    { id: "nexus-1", name: "Nexus I", location: "Addis Ababa, Ethiopia", fractionalized: false, fractions: 0, listed: false },
    { id: "nexus-2", name: "Nexus II", location: "Kampala, Uganda", fractionalized: true, fractions: 2000, listed: false },
  ];

  const filteredNFTs = nfts.filter(nft => 
    nft.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFractionalize = async () => {
    if (!selectedNFT) return;
    
    setIsProcessing(true);
    try {
      // Mock fractionalization - in a real app, this would call your blockchain function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${selectedNFT.name} fractionalized into ${fractionCount} fractions`);
      setSelectedNFT({
        ...selectedNFT,
        fractionalized: true,
        fractions: fractionCount
      });
    } catch (error) {
      console.error("Fractionalization error:", error);
      toast.error("Failed to fractionalize NFT");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleListForSale = async () => {
    if (!selectedNFT) return;
    
    setIsProcessing(true);
    try {
      // This would be a real blockchain call in production
      await listForSale(selectedNFT.id, price);
      
      setSelectedNFT({
        ...selectedNFT,
        listed: true
      });
    } catch (error) {
      console.error("Listing error:", error);
      toast.error("Failed to list NFT for sale");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Split className="h-5 w-5 text-purple-400" />
            Fractionalize AirNode NFTs
          </CardTitle>
          <CardDescription className="text-gray-300">
            Divide NFTs into fractions and list them on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for NFTs by ID, name or location..."
              className="bg-gray-900 border-gray-700 text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-4 mt-4">
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    nft.id === selectedNFT?.id
                      ? "bg-ana-purple/20 border-ana-purple"
                      : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                  }`}
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <Gem className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white flex items-center">
                          {nft.name}
                          {nft.fractionalized && (
                            <span className="ml-2 text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full">
                              Fractionalized
                            </span>
                          )}
                          {nft.listed && (
                            <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">
                              Listed
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">ID: {nft.id}</div>
                        <div className="text-sm text-gray-400 mt-0.5">{nft.location}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-300">No NFTs Found</h3>
                <p className="text-gray-400 mt-1 max-w-xs">
                  Try changing your search query or mint new AirNode NFTs
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedNFT && (
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-blue-400" />
              {selectedNFT.name}
            </CardTitle>
            <CardDescription className="text-gray-300">
              ID: {selectedNFT.id} • Location: {selectedNFT.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fractionalization Panel */}
              <div className={`p-5 rounded-lg border border-gray-700 ${
                selectedNFT.fractionalized ? 'bg-gray-800/30' : 'bg-gray-800/50'
              }`}>
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Split className="h-5 w-5 text-purple-400" />
                  Fractionalization
                  {selectedNFT.fractionalized && (
                    <span className="ml-auto text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Complete
                    </span>
                  )}
                </h3>
                
                {!selectedNFT.fractionalized ? (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      Divide this NFT into multiple fractions that can be sold individually
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Number of Fractions
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={fractionCount}
                        onChange={(e) => setFractionCount(parseInt(e.target.value))}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended: 1,000 - 10,000 fractions
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handleFractionalize}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Split className="h-4 w-4" />
                          Fractionalize NFT
                        </span>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Fractions:</span>
                      <span className="font-medium text-white">{selectedNFT.fractions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Available Fractions:</span>
                      <span className="font-medium text-white">{selectedNFT.fractions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Sold Fractions:</span>
                      <span className="font-medium text-white">0</span>
                    </div>
                    
                    <div className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full text-gray-300 border-gray-700 hover:bg-gray-800">
                            <ZoomIn className="h-4 w-4 mr-2" />
                            View Fraction Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 text-white border-gray-700">
                          <DialogHeader>
                            <DialogTitle>Fraction Details</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              {selectedNFT.name} has been divided into {selectedNFT.fractions} fractions
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Fraction ID Format</h4>
                                <p className="text-xs text-gray-400">{selectedNFT.id}#000000</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Contract Address</h4>
                                <p className="text-xs text-gray-400">0x1a2...3b4c</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-300">Metadata</h4>
                              <div className="bg-gray-800 p-2 rounded text-xs font-mono text-gray-300 overflow-auto max-h-32">
                                {JSON.stringify({
                                  parent: selectedNFT.id,
                                  totalSupply: selectedNFT.fractions,
                                  fractionType: "ERC-1155",
                                  location: selectedNFT.location
                                }, null, 2)}
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" className="border-gray-700 text-gray-300">Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Marketplace Listing Panel */}
              <div className={`p-5 rounded-lg border border-gray-700 ${
                !selectedNFT.fractionalized 
                  ? 'bg-gray-800/20 opacity-50' 
                  : selectedNFT.listed 
                    ? 'bg-gray-800/30' 
                    : 'bg-gray-800/50'
              }`}>
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-green-400" />
                  Marketplace Listing
                  {selectedNFT.listed && (
                    <span className="ml-auto text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Listed
                    </span>
                  )}
                </h3>
                
                {!selectedNFT.fractionalized ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <AlertTriangle className="h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                      Fractionalize this NFT first to list it on the marketplace
                    </p>
                  </div>
                ) : !selectedNFT.listed ? (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      List the fractionalized NFT for sale on the marketplace
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Price per Fraction (USDC)
                      </label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Total value: {(price * selectedNFT.fractions).toLocaleString()} USDC
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleListForSale}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          List on Marketplace
                        </span>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Price per Fraction:</span>
                      <span className="font-medium text-white">{price} USDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Value:</span>
                      <span className="font-medium text-white">{(price * selectedNFT.fractions).toLocaleString()} USDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Listing Status:</span>
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Listed On:</span>
                      <span className="font-medium text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-gray-300 border-gray-700 hover:bg-gray-800"
                        onClick={() => toast.info("This would take you to the marketplace listing")}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View in Marketplace
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-gray-300 border-gray-700 hover:bg-gray-800">
              Manage {selectedNFT.name} Assets
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
