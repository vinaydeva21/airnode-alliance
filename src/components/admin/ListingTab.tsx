
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ListPlus, Info, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { useEthereumContracts } from "@/hooks/useEthereumContracts";

// Mock data - in a real app, this would come from a contract call
const mockFractions = [
  { id: "1-0", tokenId: 1, fractionId: 0, name: "Portal 180", location: "Nairobi, Kenya" },
  { id: "1-1", tokenId: 1, fractionId: 1, name: "Portal 180", location: "Nairobi, Kenya" },
  { id: "2-0", tokenId: 2, fractionId: 0, name: "Portal 360", location: "Lagos, Nigeria" },
  { id: "3-0", tokenId: 3, fractionId: 0, name: "Nexus I", location: "Addis Ababa, Ethiopia" },
];

const formSchema = z.object({
  fractionId: z.string().min(1, {
    message: "Please select a fraction to list.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be positive.",
  }),
  quantity: z.coerce.number().int().positive({
    message: "Quantity must be a positive integer.",
  }),
  isAuction: z.boolean().default(false),
  duration: z.coerce.number().int().min(0).max(365, {
    message: "Duration must be between 0 and 365 days.",
  }),
});

export default function ListingTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { web3State } = useWeb3();
  const { listNFTOnMarketplace, loading } = useEthereumContracts();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fractionId: "",
      price: 0.01,
      quantity: 1,
      isAuction: false,
      duration: 0,
    },
  });

  const isAuction = form.watch("isAuction");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const [tokenId, fractionId] = values.fractionId.split("-").map(Number);
      
      if (web3State.chainId && web3State.chainId > 0) {
        // Ethereum chain
        await listNFTOnMarketplace(
          tokenId,
          fractionId,
          values.price,
          values.quantity,
          values.isAuction,
          values.duration
        );
        toast.success("Successfully listed fraction on marketplace");
      } else {
        // Cardano - would use a different implementation
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Successfully listed fraction on Cardano marketplace");
      }
      
      form.reset();
    } catch (error) {
      console.error("Error listing NFT fraction:", error);
      toast.error("Failed to list NFT fraction");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-card/50 backdrop-blur-sm border-ana-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="h-6 w-6 text-ana-purple" />
            List on Marketplace
          </CardTitle>
          <CardDescription>
            List your AirNode fractions for sale or lease on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fractionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Fraction</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select a fraction</option>
                        {mockFractions.map(fraction => (
                          <option key={fraction.id} value={`${fraction.tokenId}-${fraction.fractionId}`}>
                            {fraction.name} - Fraction #{fraction.fractionId}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose a fraction to list on the marketplace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set the price for this fraction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of fractions to list
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAuction"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Lease/Auction</FormLabel>
                      <FormDescription>
                        Enable for lease or auction-based listing
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {isAuction && (
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days): {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          max={365}
                          step={1}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the duration for the lease period
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Processing..." : "List on Marketplace"}
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
              About Marketplace Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              List your AirNode fractions on the decentralized marketplace to enable trading, 
              leasing, or fractional ownership. You can list fractions either for direct sale 
              or lease/auction.
            </p>
            
            <div className="rounded-md bg-ana-purple/10 p-3 border border-ana-purple/20">
              <h4 className="font-medium mb-2">Listing Types</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Tag size={16} className="mt-0.5 text-ana-purple" />
                  <div>
                    <span className="font-medium">Direct Sale</span>
                    <p className="text-muted-foreground">Fixed price sale where buyers can instantly purchase fractions</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Tag size={16} className="mt-0.5 text-ana-purple" />
                  <div>
                    <span className="font-medium">Lease</span>
                    <p className="text-muted-foreground">Time-limited access to fractions with automatic return</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Market Fees</h4>
              <div className="flex items-center justify-between text-sm py-2 border-b border-ana-purple/10">
                <span>Platform fee</span>
                <span className="font-medium">2.5%</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-ana-purple/10">
                <span>Creator royalty</span>
                <span className="font-medium">1.0%</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span>DAO treasury</span>
                <span className="font-medium">0.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Marketplace Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-medium">Real-time Pricing</p>
                  <p className="text-sm text-muted-foreground">Market-driven pricing based on network performance</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-medium">Cross-chain Trading</p>
                  <p className="text-sm text-muted-foreground">List on Ethereum or Cardano networks</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-medium">Automatic Rewards</p>
                  <p className="text-sm text-muted-foreground">Fraction owners receive network rewards</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple flex items-center justify-center text-white text-sm font-medium">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-medium">Transparent History</p>
                  <p className="text-sm text-muted-foreground">View complete trading history and performance</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
