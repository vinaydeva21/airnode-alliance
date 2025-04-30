
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ListPlus, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMarketplace } from "@/hooks/useMarketplace";
import { toast } from "sonner";

// Mock fractionalized NFTs data
const fractionData = [
  { id: "fraction-portal-180-001", nftId: "portal-180", name: "Portal 180 #001", count: 1000 },
  { id: "fraction-portal-360-001", nftId: "portal-360", name: "Portal 360 #001", count: 1000 },
  { id: "fraction-nexus-1-001", nftId: "nexus-1", name: "Nexus I #001", count: 2000 },
];

const formSchema = z.object({
  fractionId: z.string().min(1, {
    message: "Please select a fraction to list.",
  }),
  listingType: z.enum(["sale", "auction"]),
  price: z.coerce.number().min(0.01, {
    message: "Price must be at least 0.01.",
  }),
  quantity: z.coerce.number().int().min(1, {
    message: "Quantity must be at least 1.",
  }),
  duration: z.coerce.number().int().min(1).optional(),
});

export default function ListingTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { listForSale, loading } = useMarketplace();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fractionId: "",
      listingType: "sale",
      price: 0.1,
      quantity: 100,
      duration: 7,
    },
  });

  const listingType = form.watch("listingType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      await listForSale(values.fractionId, values.price);
      toast.success(`Successfully listed ${values.quantity} fractions for ${values.listingType}`);
      form.reset();
    } catch (error) {
      console.error("Error listing fractions:", error);
      toast.error("Failed to list fractions");
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
            List Fractions on Marketplace
          </CardTitle>
          <CardDescription>
            Make fractionalized AirNode NFTs available on the marketplace
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
                    <FormLabel>Select Fractionalized NFT</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select a fractionalized NFT</option>
                        {fractionData.map(fraction => (
                          <option key={fraction.id} value={fraction.id}>
                            {fraction.name} ({fraction.count} fractions)
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose fractions to list on the marketplace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="sale">Fixed Price Sale</option>
                        <option value="auction">Timed Auction</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{listingType === "auction" ? "Starting Price" : "Price per Fraction"}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input className="pl-10" type="number" step="0.01" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to List</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of fractions to make available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {listingType === "auction" && (
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auction Duration (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                {isSubmitting ? "Listing..." : "List on Marketplace"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-ana-purple" />
              Marketplace Listing Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-blue-500/10 p-4 border border-blue-500/20">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <ShoppingCart className="h-4 w-4" />
                Fixed Price Sale
              </h4>
              <p className="text-sm">
                List fractions at a set price that buyers can immediately purchase.
                Ideal for consistent income generation and quick sales.
              </p>
              
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>Quick liquidity</span>
                <span>No waiting period</span>
                <span>Predictable returns</span>
              </div>
            </div>
            
            <div className="rounded-md bg-green-500/10 p-4 border border-green-500/20">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                Timed Auction
              </h4>
              <p className="text-sm">
                Set a starting price and duration for competitive bidding.
                Potential for higher returns if there's significant demand.
              </p>
              
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>Higher price potential</span>
                <span>Market-driven pricing</span>
                <span>Buyer competition</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Recommended Listing Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              For newly minted AirNode fractions, we recommend the following strategy:
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <DollarSign size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Tiered Pricing Structure</p>
                  <p className="text-sm text-muted-foreground">
                    List 60% at standard price, 30% at premium price, hold 10% in reserve
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <Clock size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Phased Release</p>
                  <p className="text-sm text-muted-foreground">
                    Start with a smaller batch to test market demand before releasing more
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <ShoppingCart size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Bundle Options</p>
                  <p className="text-sm text-muted-foreground">
                    Offer discounted bundles of 10+ fractions for larger investors
                  </p>
                </div>
              </li>
            </ul>
            
            <div className="text-xs text-muted-foreground mt-4">
              <p className="font-medium">Market Insights:</p>
              <p>Current average price per fraction: $0.15</p>
              <p>Recent listing sold out in: 48 hours</p>
              <p>Highest demand locations: East Africa, Southeast Asia</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
