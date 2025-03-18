import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletInfo } from "./WalletData";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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

        <div className="py-4 flex flex-col gap-3">
          <button
            onClick={() => {
              if (openConnectModal) {
                openConnectModal();
                onOpenChange(false);
              } else {
                toast.error("Rainbow Kit connection not available");
              }
            }}
            className="flex items-center justify-between p-3 rounded-lg border border-ana-purple/20 hover:bg-ana-purple/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌈</div>
              <span className="font-medium">Rainbow Kit</span>
            </div>
            <div className="text-ana-purple">Connect</div>
          </button>

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
  const { web3State } = useWeb3();

  const getWalletIcon = (id: string) => {
    switch (id) {
      case "metamask":
        return "🦊";
      case "yoroi":
        return "🔷";
      case "lace":
        return "✨";
      case "wmc":
        return "🌐";
      default:
        return "💼";
    }
  };

  const handleWalletClick = () => {
    switch (wallet.id) {
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
