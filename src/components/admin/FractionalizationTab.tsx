import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Divide, Info, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useFractionalization } from "@/hooks/useFractionalization";
import { useWeb3 } from "@/contexts/Web3Context";
import { useUserNFTs } from "@/hooks/useUserNFTs";

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

export default function FractionalizationTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { web3State } = useWeb3();
  const { getTokenMetadata } = useNFTContract();
  const { fractionalizeNFT, loading } = useFractionalization();
  const { nfts, loading: loadingNFTs, fetchUserNFTs } = useUserNFTs();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airNodeId: "",
      fractionCount: 1000,
      pricePerFraction: 0.1,
    },
  });

  useEffect(() => {
    if (web3State.connected) {
      fetchUserNFTs();
    }
  }, [web3State.connected]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const nftId = parseInt(values.airNodeId);
      
      await fractionalizeNFT(nftId, values.fractionCount, values.pricePerFraction);
      
      toast.success(`Successfully fractionalized NFT into ${values.fractionCount} fractions`);
      toast.info("Fractions ready to be listed on the marketplace");
      form.reset();
      
      fetchUserNFTs();
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loadingNFTs}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AirNode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingNFTs ? (
                          <SelectItem value="loading" disabled>Loading NFTs...</SelectItem>
                        ) : nfts.length > 0 ? (
                          nfts.map(nft => (
                            <SelectItem key={nft.id} value={nft.id}>
                              {nft.name} - {nft.location}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No NFTs available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {nfts.length === 0 && !loadingNFTs ? 
                        "You don't have any AirNode NFTs yet. Mint one first." : 
                        "Choose an NFT to fractionalize"}
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
                disabled={isSubmitting || nfts.length === 0}
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
