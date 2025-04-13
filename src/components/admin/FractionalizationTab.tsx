import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Divide, Info, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useFractionalization } from "@/hooks/useFractionalization";
import { useWeb3 } from "@/contexts/Web3Context";

const formSchema = z.object({
  airNodeId: z.string().min(1, {
    message: "Please select an AirNode NFT.",
  }),
  fractionCount: z.coerce.number().int().min(1, {
    message: "Fraction count must be at least 1.",
  }),
  pricePerFraction: z.coerce.number().min(0.01, {
    message: "Price per fraction must be at least 0.01.",
  }),
});

// Mock NFT data for demonstration
const mockNFTs = [
  { id: "1", name: "Portal 180", location: "Nairobi, Kenya" },
  { id: "2", name: "Portal 360", location: "Lagos, Nigeria" },
  { id: "3", name: "Nexus I", location: "Addis Ababa, Ethiopia" },
];

interface NFTOption {
  id: string;
  name: string;
  location: string;
}

export default function FractionalizationTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableNFTs, setAvailableNFTs] = useState<NFTOption[]>([]);
  const { web3State } = useWeb3();
  const { getTokenMetadata } = useNFTContract();
  const { fractionalizeNFT, loading } = useFractionalization();
  
  // Fetch available NFTs - in a real application, you would fetch this from the contract
  useEffect(() => {
    // This is a mock implementation - would be replaced with real contract calls
    const fetchNFTs = async () => {
      if (web3State.connected) {
        // For demo purposes, we're using mock data
        // In a real app, you would query the blockchain for NFTs owned by the user
        setAvailableNFTs([
          { id: "1", name: "Portal 180", location: "Nairobi, Kenya" },
          { id: "2", name: "Portal 360", location: "Lagos, Nigeria" },
          { id: "3", name: "Nexus I", location: "Addis Ababa, Ethiopia" },
        ]);
      }
    };
    
    fetchNFTs();
  }, [web3State.connected]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airNodeId: "",
      fractionCount: 1000,
      pricePerFraction: 0.1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Convert airNodeId (which is actually the tokenId) to a number
      const nftId = parseInt(values.airNodeId);
      
      // Call the contract to fractionalize the NFT
      await fractionalizeNFT(nftId, values.fractionCount, values.pricePerFraction);
      
      toast.success(`Successfully fractionalized NFT into ${values.fractionCount} fractions`);
      toast.info("Fractions ready to be listed on the marketplace");
      form.reset();
    } catch (error) {
      console.error("Error fractionalizing NFT:", error);
      toast.error("Failed to fractionalize NFT");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-card/50 backdrop-blur-sm border-ana-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Divide className="h-6 w-6 text-ana-purple" />
            Fractionalize AirNode NFT
          </CardTitle>
          <CardDescription>
            Split an AirNode NFT into fractions that can be listed on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="airNodeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select AirNode NFT</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select an AirNode</option>
                        {mockNFTs.map(nft => (
                          <option key={nft.id} value={nft.id}>
                            {nft.name} - {nft.location}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose an NFT to fractionalize
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fractionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Fractions</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many fractions to create from this NFT
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricePerFraction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Fraction</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input className="pl-10" type="number" step="0.01" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Initial listing price for each fraction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Fractionalize NFT"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-ana-purple" />
              About Fractionalization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Fractionalization splits a single NFT into multiple fractions, each represented by a token. 
              This allows partial ownership of valuable assets and increases liquidity.
            </p>
            
            <div className="rounded-md bg-ana-purple/10 p-3 border border-ana-purple/20">
              <h4 className="font-medium mb-2">Benefits</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ana-purple"></span>
                  <span>Lower barrier to entry for investors</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ana-purple"></span>
                  <span>Improved liquidity for NFT assets</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ana-purple"></span>
                  <span>Democratic access to network infrastructure</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ana-purple"></span>
                  <span>Proportional governance rights</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Fraction Distribution</h4>
              <div className="h-12 w-full rounded-md overflow-hidden flex">
                <div className="bg-ana-purple h-full" style={{ width: "60%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">
                    Public Sale (60%)
                  </div>
                </div>
                <div className="bg-ana-pink h-full" style={{ width: "20%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">
                    Rewards (20%)
                  </div>
                </div>
                <div className="bg-blue-500 h-full" style={{ width: "10%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">
                    DAO (10%)
                  </div>
                </div>
                <div className="bg-green-500 h-full" style={{ width: "10%" }}>
                  <div className="h-full flex items-center justify-center text-xs text-white">
                    Ops (10%)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Fractionalization Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Select NFT to fractionalize</p>
                  <p className="text-sm text-muted-foreground">Choose a minted AirNode NFT from your collection</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Set fraction parameters</p>
                  <p className="text-sm text-muted-foreground">Define number of fractions and initial price</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Confirm transaction</p>
                  <p className="text-sm text-muted-foreground">Approve the smart contract interaction</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium">List on marketplace</p>
                  <p className="text-sm text-muted-foreground">Make fractions available for purchase</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
