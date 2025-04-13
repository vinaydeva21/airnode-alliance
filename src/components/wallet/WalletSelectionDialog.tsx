
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import { WalletInfo } from "./WalletData";

interface WalletSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallets: WalletInfo[];
  onConnect: (walletId: string) => void;
}

export const WalletSelectionDialog: React.FC<WalletSelectionDialogProps> = ({
  open,
  onOpenChange,
  wallets,
  onConnect,
}) => {
  const { openConnectModal } = useConnectModal();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription className="text-white/70">
            Select a wallet to connect to the AirNode Alliance
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col gap-5">
          {/* Ethereum Network Section */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Ethereum Network</h3>
            <button
              onClick={() => {
                if (openConnectModal) {
                  openConnectModal();
                  onOpenChange(false);
                } else {
                  toast.error("Rainbow Kit connection not available");
                }
              }}
              className="flex w-full items-center justify-between p-3 rounded-lg border border-ana-purple/20 hover:bg-ana-purple/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🌈</div>
                <span className="font-medium">Rainbow Kit</span>
              </div>
              <div className="text-ana-purple">Connect</div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
