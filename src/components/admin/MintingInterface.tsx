
import React, { useState } from "react";
import { 
  Gem, CheckCircle, Globe, Cpu, Upload, AlertTriangle, Bookmark
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNFTContract } from "@/hooks/useNFTContract";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const mintingSchema = z.object({
  airNodeId: z.string().min(3, {
    message: "AirNode ID must be at least 3 characters"
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters"
  }),
  uptime: z.coerce.number().min(0).max(100),
  earnings: z.coerce.number().min(0),
  roi: z.coerce.number().min(0),
  totalFractions: z.coerce.number().int().min(1, {
    message: "Total fractions must be at least 1"
  })
});

type MintingValues = z.infer<typeof mintingSchema>;

export const MintingInterface = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<{id: string, timestamp: Date}[]>([]);
  const { mintNFT, loading } = useNFTContract();
  
  const form = useForm<MintingValues>({
    resolver: zodResolver(mintingSchema),
    defaultValues: {
      airNodeId: "",
      location: "",
      uptime: 99.5,
      earnings: 2.5,
      roi: 18.0,
      totalFractions: 1000
    },
  });

  const onSubmit = async (values: MintingValues) => {
    setIsSubmitting(true);
    
    try {
      const metadata = {
        airNodeId: values.airNodeId,
        location: values.location,
        performance: {
          uptime: values.uptime,
          earnings: values.earnings,
          roi: values.roi
        },
        totalFractions: values.totalFractions
      };
      
      await mintNFT(values.airNodeId, values.totalFractions, metadata);
      
      // Add minted NFT to the list
      setMintedNFTs(prev => [
        { id: values.airNodeId, timestamp: new Date() },
        ...prev
      ]);
      
      // Reset form
      form.reset();
      toast.success("NFT minted and fractionalized successfully");
    } catch (error) {
      console.error("Minting error:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-blue-400" />
            Mint New AirNode NFT
          </CardTitle>
          <CardDescription className="text-gray-300">
            Create a new AirNode NFT and fractionalize it for the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="airNodeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">AirNode ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., portal-180" 
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      A unique identifier for the AirNode
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Nairobi, Kenya" 
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Physical location of the AirNode
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="uptime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Uptime %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          className="bg-gray-900 border-gray-700 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="earnings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Earnings ($/day)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          className="bg-gray-900 border-gray-700 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">ROI %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          className="bg-gray-900 border-gray-700 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="totalFractions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Total Fractions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Number of fractions to divide this NFT into
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-ana-purple hover:bg-ana-purple/80"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Mint AirNode NFT
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Recently Minted
          </CardTitle>
          <CardDescription className="text-gray-300">
            Recently minted AirNode NFTs with fractionalization status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mintedNFTs.length > 0 ? (
            <div className="space-y-4">
              {mintedNFTs.map((nft, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Gem className="h-4 w-4 text-blue-400" />
                        {nft.id}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Minted on {nft.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Listed
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-300">Fractionalized</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-300">On Marketplace</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No NFTs Minted Yet</h3>
              <p className="text-gray-400 mt-1 max-w-xs">
                Mint your first AirNode NFT using the form to see it listed here
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-gray-300 border-gray-700 hover:bg-gray-800">
            <Bookmark className="h-4 w-4 mr-2" />
            View All Minted NFTs
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
