
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletInfo } from "./WalletData";
import { toast } from "sonner";

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
  onConnect
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription className="text-white/70">
            Select a wallet to connect to the AirNode Alliance
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-3">
          {wallets.map((wallet) => (
            <WalletOption 
              key={wallet.id}
              wallet={wallet}
              onConnect={onConnect}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface WalletOptionProps {
  wallet: WalletInfo;
  onConnect: (walletId: string) => void;
}

const WalletOption: React.FC<WalletOptionProps> = ({ wallet, onConnect }) => {
  const getWalletIcon = (id: string) => {
    switch (id) {
      case "metamask":
        return "🦊";
      case "nami":
        return "💧";
      case "yoroi":
        return "🔷";
      case "wmc":
        return "🌐";
      case "walletconnect":
        return "🔗";
      default:
        return "💼";
    }
  };

  const handleWalletClick = () => {
    switch (wallet.id) {
      case "nami":
        // Check if Nami wallet is installed
        if (window.cardano && window.cardano.nami) {
          onConnect(wallet.id);
        } else {
          // Redirect to Nami wallet website
          toast.info("Nami wallet not found. Redirecting to download page...");
          window.open("https://namiwallet.io/", "_blank");
        }
        break;
      case "yoroi":
        // Check if Yoroi wallet is installed
        if (window.cardano && window.cardano.yoroi) {
          onConnect(wallet.id);
        } else {
          // Redirect to Yoroi wallet website
          toast.info("Yoroi wallet not found. Redirecting to download page...");
          window.open("https://yoroi-wallet.com/", "_blank");
        }
        break;
      default:
        // For other wallets, proceed as normal
        onConnect(wallet.id);
        break;
    }
  };

  return (
    <button
      onClick={handleWalletClick}
      className="flex items-center justify-between p-3 rounded-lg border border-ana-purple/20 hover:bg-ana-purple/20 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{getWalletIcon(wallet.id)}</div>
        <span className="font-medium">{wallet.name}</span>
      </div>
      <div className="text-ana-purple">Connect</div>
    </button>
  );
};
