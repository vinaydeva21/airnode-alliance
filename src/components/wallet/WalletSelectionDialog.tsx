
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
          {/* Ethereum & Layer 2 Networks Section */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-3">Connect Your Wallet</h3>
            <div className="space-y-3">
              {/* Rainbow Kit - Supports multiple wallets including Coinbase */}
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
                  <div>
                    <div className="font-medium">Connect Wallet</div>
                    <div className="text-xs text-white/60">MetaMask, Coinbase, WalletConnect & more</div>
                  </div>
                </div>
                <div className="text-ana-purple">Connect</div>
              </button>
              
              {/* Network Information */}
              <div className="bg-ana-darkblue/30 rounded-lg p-3 border border-ana-purple/10">
                <div className="text-xs text-white/70 mb-2">Supported Networks:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>World Mobile Chain Testnet (Default) — WOMOX</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Sepolia Testnet (Legacy)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
