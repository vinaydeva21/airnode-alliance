
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMarketplace } from "@/hooks/useMarketplace";

export interface NodePurchaseProps {
  airNodeId: string;
  name: string;
  price: number;
  availableShares: number;
  children?: React.ReactNode;
}

export function NodePurchaseDialog({
  airNodeId,
  name,
  price,
  availableShares,
  children,
}: NodePurchaseProps) {
  const [open, setOpen] = React.useState(false);
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("ana");
  const { buyFraction, loading } = useMarketplace();

  const handleBuyShares = async () => {
    try {
      if (sharesToBuy <= 0) {
        toast.error("Please enter a valid amount of shares");
        return;
      }

      if (sharesToBuy > availableShares) {
        toast.error(`Only ${availableShares} shares available`);
        return;
      }

      await buyFraction(airNodeId, price * sharesToBuy);
      toast.success("Purchase successful!", {
        description: `You have purchased ${sharesToBuy} shares of ${name}`,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error purchasing shares:", error);
      toast.error("Failed to purchase shares");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="default" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <DialogContent className="sm:max-w-[400px] bg-card border border-ana-purple/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Buy AirNode Shares</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">
              Available shares: {availableShares}
            </p>
            <p className="text-sm text-muted-foreground">
              Price per share: ${price}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of shares</label>
            <Input
              type="number"
              min={1}
              max={availableShares}
              value={sharesToBuy}
              onChange={(e) => setSharesToBuy(parseInt(e.target.value) || 0)}
              className="bg-card/50"
            />
            <p className="text-xs text-muted-foreground">
              Total cost: ${(price * sharesToBuy).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment method</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={paymentMethod === "ana" ? "default" : "outline"}
                size="sm"
                onClick={() => setPaymentMethod("ana")}
                className={paymentMethod === "ana" ? "bg-ana-purple" : ""}
              >
                ANA Tokens
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "eth" ? "default" : "outline"}
                size="sm"
                onClick={() => setPaymentMethod("eth")}
                className={paymentMethod === "eth" ? "bg-ana-blue" : ""}
              >
                ETH
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleBuyShares}
          disabled={loading || sharesToBuy <= 0 || sharesToBuy > availableShares}
          className="w-full bg-ana-purple hover:bg-ana-purple/90"
        >
          {loading ? "Processing..." : `Buy ${sharesToBuy} Shares`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
