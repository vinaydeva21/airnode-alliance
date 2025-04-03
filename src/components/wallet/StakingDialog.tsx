"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface StakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableAna: number;
}

export const StakingDialog: React.FC<StakingDialogProps> = ({
  open,
  onOpenChange,
  availableAna,
}) => {
  const [stakeAmount, setStakeAmount] = useState("");

  const handleStake = () => {
    toast.success(`Staked ${stakeAmount} ANA tokens`, {
      description: "Your tokens are now earning rewards",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Stake ANA Tokens</DialogTitle>
          <DialogDescription className="text-white/70">
            Stake your ANA tokens to earn rewards and increase your governance
            voting power
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between text-sm bg-ana-darkblue/30 p-3 rounded-md">
            <span>Available ANA Balance:</span>
            <span>{availableAna} ANA</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Amount to Stake</label>
            <Input
              type="number"
              min="1"
              max={availableAna}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Staking Period</label>
            <Tabs defaultValue="30days" className="w-full">
              <TabsList className="grid grid-cols-3 bg-ana-darkblue/50">
                <TabsTrigger value="30days">30 Days</TabsTrigger>
                <TabsTrigger value="90days">90 Days</TabsTrigger>
                <TabsTrigger value="180days">180 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-between text-sm bg-green-500/10 p-3 rounded-md">
            <span>Estimated APY:</span>
            <span className="text-green-400">12%</span>
          </div>

          <div className="p-3 bg-ana-purple/10 border border-ana-purple/30 rounded-md text-sm">
            <strong>Note:</strong> Staked tokens will be locked for the selected
            period. Early unstaking incurs a 10% penalty.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStake}>Stake Tokens</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
