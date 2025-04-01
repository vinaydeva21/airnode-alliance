import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  Package,
  Pin,
  AlertCircle,
  Cpu,
  Divide,
  ListPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNFTContract } from "@/hooks/useNFTContract";
import { NFTMetadata } from "@/types/blockchain";
import { toast } from "sonner";
import { mintNFTCardano } from "@/lib/cardanoTx";
import { useWeb3 } from "@/contexts/Web3Context";
const formSchema = z.object({
  airNodeId: z.string().min(3, {
    message: "AirNode ID must be at least 3 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  uptime: z.coerce.number().min(0).max(100, {
    message: "Uptime must be between 0 and 100.",
  }),
  earnings: z.coerce.number().min(0, {
    message: "Earnings must be positive.",
  }),
  roi: z.coerce.number().min(0, {
    message: "ROI must be positive.",
  }),
  fractionCount: z.coerce.number().int().min(1, {
    message: "Fraction count must be at least 1.",
  }),
});

export default function MintingTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mintNFT, loading } = useNFTContract();
  const { web3State, connect, disconnect } = useWeb3();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airNodeId: "",
      location: "",
      uptime: 99.5,
      earnings: 2.5,
      roi: 18.0,
      fractionCount: 1000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const metadata: NFTMetadata = {
        airNodeId: values.airNodeId,
        location: values.location,
        performance: {
          uptime: values.uptime,
          earnings: values.earnings,
          roi: values.roi,
        },
        fractions: values.fractionCount,
      };

      // await mintNFT(values.airNodeId, values.fractionCount, metadata);
      await mintNFTCardano(
        values.airNodeId,
        BigInt(values.fractionCount),
        metadata,
        web3State.chainId
      );
      values.airNodeId, values.fractionCount, metadata, web3State.chainId;
      toast.success("NFT minted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-card/50 backdrop-blur-sm border-ana-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-ana-purple" />
            Mint New AirNode NFT
          </CardTitle>
          <CardDescription>
            Create a new AirNode NFT that can be fractionalized and listed on
            the marketplace
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
                    <FormLabel>AirNode ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. portal-180" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this AirNode
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nairobi, Kenya" {...field} />
                    </FormControl>
                    <FormDescription>
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
                      <FormLabel>Uptime (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
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
                      <FormLabel>Earnings ($/day)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
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
                      <FormLabel>ROI (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Minting..." : "Mint NFT"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Minting Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <Package size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Create AirNode NFT</p>
                  <p className="text-sm text-muted-foreground">
                    Mint a new NFT with node metadata
                  </p>
                </div>
                <Check className="h-5 w-5 text-green-500" />
              </li>

              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <Divide size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Fractionalize</p>
                  <p className="text-sm text-muted-foreground">
                    Split the NFT into shareable fractions
                  </p>
                </div>
                <Pin className="h-5 w-5 text-yellow-500" />
              </li>

              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-ana-purple/20 flex items-center justify-center text-ana-purple mt-0.5">
                  <ListPlus size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">List on Marketplace</p>
                  <p className="text-sm text-muted-foreground">
                    Make fractions available for purchase
                  </p>
                </div>
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-ana-purple/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-ana-purple" />
              AirNode Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Processing</span>
                <span className="font-medium">4-core ARM Processor</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">8GB RAM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">256GB SSD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Connectivity</span>
                <span className="font-medium">5G + Backup LTE</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Power</span>
                <span className="font-medium">Solar + Battery Backup</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              All AirNodes use energy-efficient hardware with redundant
              connectivity
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
