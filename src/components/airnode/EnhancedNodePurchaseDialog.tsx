import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEnhancedMarketplace } from "@/hooks/useEnhancedMarketplace";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { Coins, TrendingUp, Zap } from "lucide-react";

interface EnhancedNodePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: (purchasedShares: number) => void;
  airNode: {
    id: string;
    name: string;
    location: string;
    price: number;
    totalShares: number;
    availableShares: number;
    performance: {
      uptime: number;
      earnings: number;
      roi: number;
    };
    fractionId?: string;
  };
}

export const EnhancedNodePurchaseDialog: React.FC<EnhancedNodePurchaseDialogProps> = ({
  open,
  onOpenChange,
  onPurchaseSuccess,
  airNode,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setPurchaseLoading] = useState(false);
  const { buyShares, loadMarketplaceData } = useEnhancedMarketplace();
  const { web3State } = useWeb3();

  const totalCost = quantity * airNode.price;
  const estimatedMonthlyEarnings = (quantity * airNode.performance.earnings * 30);
  const estimatedROI = airNode.performance.roi;

  const handlePurchase = async () => {
    if (quantity <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (quantity > airNode.availableShares) {
      toast.error("Not enough shares available");
      return;
    }

    setPurchaseLoading(true);
    
    try {
      // Hardcoded purchase flow - simulate successful purchase
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction time
      
      // Store purchased NFT in session storage
      const purchasedNFT = {
        id: airNode.id,
        name: airNode.name,
        location: airNode.location,
        sharesOwned: quantity,
        purchasePrice: (airNode.price / airNode.totalShares) * quantity,
        purchaseDate: new Date().toISOString()
      };
      
      const existingPurchases = JSON.parse(sessionStorage.getItem('purchasedNFTs') || '[]');
      const existingIndex = existingPurchases.findIndex((nft: any) => nft.id === airNode.id);
      
      if (existingIndex >= 0) {
        existingPurchases[existingIndex].sharesOwned += quantity;
        existingPurchases[existingIndex].purchasePrice += (airNode.price / airNode.totalShares) * quantity;
      } else {
        existingPurchases.push(purchasedNFT);
      }
      
      sessionStorage.setItem('purchasedNFTs', JSON.stringify(existingPurchases));
      
      toast.success(`Successfully purchased ${quantity} share${quantity > 1 ? 's' : ''} of ${airNode.name}!`);
      
      if (onPurchaseSuccess) {
        onPurchaseSuccess(quantity);
      }
      
      // Reset form and close dialog
      setQuantity(1);
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Purchase failed:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Purchase AirNode Shares</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* AirNode Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{airNode.name}</h3>
            <p className="text-white/70">{airNode.location}</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                <Zap className="w-3 h-3 mr-1" />
                {airNode.performance.uptime}% Uptime
              </Badge>
              <Badge variant="outline" className="bg-ana-purple/20 text-ana-purple border-ana-purple/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                {airNode.performance.roi}% ROI
              </Badge>
            </div>
          </div>

          <Separator className="bg-ana-purple/20" />

          {/* Purchase Configuration */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">
                Number of Shares
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="bg-transparent border-ana-purple/30"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(airNode.availableShares, parseInt(e.target.value) || 1)))}
                  className="text-center bg-ana-darkblue/50 border-ana-purple/30"
                  min={1}
                  max={airNode.availableShares}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(airNode.availableShares, quantity + 1))}
                  disabled={quantity >= airNode.availableShares}
                  className="bg-transparent border-ana-purple/30"
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Available: {airNode.availableShares} / {airNode.totalShares} shares
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-ana-darkblue/30 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-white/90">Purchase Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Price per share:</span>
                  <span>${airNode.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Quantity:</span>
                  <span>{quantity} shares</span>
                </div>
                <Separator className="bg-ana-purple/20" />
                <div className="flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span className="text-ana-purple">${totalCost}</span>
                </div>
              </div>
            </div>

            {/* Earnings Projection */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <h4 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Estimated Earnings
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Monthly:</span>
                  <span className="text-green-300">${estimatedMonthlyEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Annual ROI:</span>
                  <span className="text-green-300">{estimatedROI}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent border-ana-purple/30"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              className="flex-1"
              disabled={loading || quantity > airNode.availableShares}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Purchase for $${totalCost}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};