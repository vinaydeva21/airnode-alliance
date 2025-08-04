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
    if (!web3State.connected) {
      toast.error("Please connect your wallet to purchase shares");
      return;
    }

    if (quantity > airNode.availableShares) {
      toast.error("Not enough shares available");
      return;
    }

    setPurchaseLoading(true);
    try {
      // If fractionId exists, use enhanced marketplace, otherwise use local success handler
      if (airNode.fractionId) {
        await buyShares(airNode.fractionId, quantity, airNode.price);
        await loadMarketplaceData();
      }
      
      // Call success handler to update UI immediately
      if (onPurchaseSuccess) {
        onPurchaseSuccess(quantity);
      } else {
        toast.success(`Successfully purchased ${quantity} shares of ${airNode.name}!`);
        onOpenChange(false);
      }
      
      setQuantity(1);
    } catch (error) {
      console.error("Purchase failed:", error);
      // Only show error for blockchain failures, not fallback mode
      if (airNode.fractionId) {
        toast.error("Purchase failed. Please try again.");
      } else {
        // Fallback success for demo purposes
        if (onPurchaseSuccess) {
          onPurchaseSuccess(quantity);
        }
      }
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

            {/* Wallet Connection Status */}
            {!web3State.connected && (
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                <p className="text-yellow-300 text-sm">
                  Please connect your wallet to purchase shares
                </p>
              </div>
            )}
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
              disabled={loading || !web3State.connected || quantity > airNode.availableShares}
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