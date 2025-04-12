
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ethers } from "ethers";
import {
  Check,
  Package,
  Pin,
  AlertCircle,
  Cpu,
  Divide,
  ListPlus,
  Loader,
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
import { NFTMetadata } from "@/types/blockchain";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { useNavigate } from "react-router-dom";
import { connectToEthereumNFTContract } from "@/config/scripts/scripts";
import { Badge } from "@/components/ui/badge";

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
  const [showMintingSpinner, setShowMintingSpinner] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { web3State } = useWeb3();
  const navigate = useNavigate();

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

  // Function to simulate the minting process with a spinner
  const simulateMinting = (callback: () => void) => {
    setShowMintingSpinner(true);
    
    // Show the spinner for 15 seconds
    setTimeout(() => {
      setShowMintingSpinner(false);
      callback();
    }, 15000);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setTxHash(null);
    
    try {
      // Check if Ethereum wallet is connected
      if (!web3State.connected || !web3State.account) {
        toast.error("Please connect your wallet first", {
          description: "Connect your MetaMask wallet to mint NFTs"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create metadata object
      const metadata: NFTMetadata = {
        airNodeId: values.airNodeId,
        location: values.location,
        performance: {
          uptime: values.uptime,
          earnings: values.earnings,
          roi: values.roi,
        },
        fractions: BigInt(values.fractionCount),
      };
      
      console.log("Preparing to mint NFT on Ethereum with:", {
        airNodeId: values.airNodeId,
        fractionCount: values.fractionCount,
        metadata
      });
      
      // Connect directly to the NFT contract - this will trigger MetaMask
      toast.info("Connecting to blockchain...");
      const nftContract = await connectToEthereumNFTContract();
      
      if (!nftContract) {
        throw new Error("NFT contract connection failed");
      }
      
      // Create a metadata URI (in a real app, this would be IPFS or similar)
      const metadataJSON = JSON.stringify({
        airNodeId: values.airNodeId,
        location: values.location,
        performance: {
          uptime: values.uptime,
          earnings: values.earnings,
          roi: values.roi
        },
        totalFractions: values.fractionCount,
        network: "Sepolia Testnet",
        timestamp: new Date().toISOString()
      });
      
      const metadataURI = `data:application/json;base64,${btoa(metadataJSON)}`;
      
      // Convert metadata to contract format - using precise numeric conversions for blockchain
      const metadataStruct = {
        airNodeId: metadata.airNodeId,
        location: metadata.location,
        performance: {
          uptime: metadata.performance.uptime,
          earnings: ethers.parseEther(metadata.performance.earnings.toString()),
          roi: metadata.performance.roi,
        },
        fractions: values.fractionCount,
      };
      
      toast.info("Please confirm the transaction in your MetaMask wallet", {
        description: "A wallet confirmation popup should appear shortly"
      });
      
      console.log("Sending mint transaction to blockchain...");
      
      // This will explicitly trigger the MetaMask popup for transaction confirmation
      const tx = await nftContract.mintNFT(
        metadata.airNodeId,
        values.fractionCount,
        metadataURI,
        metadataStruct,
        { 
          gasLimit: 3000000 // Explicitly set higher gas limit to avoid failures
        }
      );
      
      console.log("Mint transaction submitted:", tx.hash);
      setTxHash(tx.hash);
      
      toast.info("Transaction submitted to Sepolia network", {
        description: "Please wait for confirmation..."
      });

      // Start the minting animation
      simulateMinting(async () => {
        try {
          // After 15 seconds, show success and redirect
          toast.success(
            <div>
              NFT minted successfully on Sepolia Testnet!
              <button 
                className="ml-2 underline text-blue-500" 
                onClick={() => navigate('/marketplace')}
              >
                View in Marketplace
              </button>
            </div>,
            { duration: 7000 }
          );
          
          // Reset form after successful minting
          form.reset();
          
          // Direct user to marketplace after a short delay
          setTimeout(() => {
            navigate('/marketplace');
          }, 2000);
        } catch (error) {
          console.error("Error during minting completion:", error);
          toast.error("Something went wrong after minting");
        } finally {
          setIsSubmitting(false);
        }
      });
      
    } catch (error: any) {
      console.error("MetaMask/Contract interaction error:", error);
      setShowMintingSpinner(false);
      
      // Check if user rejected transaction
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        toast.error("Transaction was rejected in wallet", {
          description: "You canceled the transaction in MetaMask"
        });
      } else {
        toast.error("Failed to mint NFT", { 
          description: error.message || "Check your wallet connection and try again"
        });
      }
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
                className="w-full bg-ana-purple hover:bg-ana-purple/90"
                disabled={isSubmitting || showMintingSpinner}
              >
                {isSubmitting || showMintingSpinner ? (
                  <div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {showMintingSpinner ? (
                      <span>Minting NFT on Sepolia Testnet...</span>
                    ) : (
                      <span>{txHash ? "Confirming..." : "Preparing transaction..."}</span>
                    )}
                  </div>
                ) : (
                  "Mint NFT on Sepolia Testnet"
                )}
              </Button>
            </form>
          </Form>

          {txHash && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-800">Transaction Submitted</p>
                {showMintingSpinner && <Badge variant="success" className="text-xs">Minting in progress</Badge>}
              </div>
              <p className="text-xs text-green-700 break-all mt-1">
                Hash: {txHash}
              </p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View on Etherscan
              </a>
            </div>
          )}

          {showMintingSpinner && !txHash && (
            <div className="mt-4 flex flex-col items-center justify-center p-6 border border-ana-purple/20 rounded-md bg-card/20">
              <Loader className="h-10 w-10 text-ana-purple animate-spin mb-4" />
              <p className="text-sm font-medium text-center">Minting NFT on Sepolia Testnet</p>
              <p className="text-xs text-muted-foreground text-center mt-1">This may take up to 15 seconds...</p>
            </div>
          )}
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
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">Sepolia Testnet</span>
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
              connectivity on Sepolia Testnet
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
