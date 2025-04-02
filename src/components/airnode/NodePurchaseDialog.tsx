import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AirNodePerformance } from "./AirNodeCard";
import { UTxO } from "@lucid-evolution/lucid";
import { useWeb3 } from "@/contexts/Web3Context";
import { BuyTokenCardano } from "@/lib/cardanoTx";

interface NodePurchaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: {
    id: string;
    name: string;
    price: number;
    availableShares: number;
    performance: AirNodePerformance;
  };
  utxo: UTxO | undefined;
  shareAmount: number;
  setShareAmount: (amount: number) => void;
}

export const NodePurchaseDialog: React.FC<NodePurchaseProps> = ({
  open,
  onOpenChange,
  node,
  utxo,
  shareAmount,
  setShareAmount,
}) => {
  const { web3State } = useWeb3();
  const handlePurchase = async () => {
    if (utxo === undefined) {
      toast.error(`Purchase failed for ${shareAmount} shares of ${node.name}`, {
        description: `an error occurred while fetching the UTxO`,
      });
    } else {
      await BuyTokenCardano(
        utxo,
        BigInt(shareAmount),
        BigInt(node.price * shareAmount * 1_000_000),
        node.name,
        web3State.chainId
      );
      toast.success(
        `Purchase initiated for ${shareAmount} shares of ${node.name}`,
        {
          description: `Total cost: $${(node.price * shareAmount).toFixed(2)}`,
        }
      );
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {node.name} Shares</DialogTitle>
          <DialogDescription className="text-white/70">
            Enter the number of shares you want to purchase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Number of Shares</label>
            <Input
              type="number"
              min="1"
              max={node.availableShares}
              value={shareAmount}
              onChange={(e) => setShareAmount(parseInt(e.target.value) || 1)}
              className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Total Cost</label>
            <div className="p-2 bg-ana-darkblue/30 border border-ana-purple/20 rounded text-right font-semibold">
              ${(node.price * shareAmount).toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">
              Estimated Monthly Earnings
            </label>
            <div className="p-2 bg-ana-darkblue/30 border border-green-500/20 rounded text-right font-semibold text-green-400">
              +${(node.performance.earnings * shareAmount).toFixed(2)}/month
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePurchase}>Confirm Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
