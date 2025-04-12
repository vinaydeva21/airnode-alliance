
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
import { Separator } from "@/components/ui/separator";
import { Wallet, ExternalLink } from "lucide-react";

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
  
  // Filter wallets by network
  const cardanoWallets = wallets.filter(wallet => wallet.network === "cardano");

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

  const handleMetaMaskConnect = () => {
    if (isMetaMaskInstalled) {
      onConnect("metamask");
      onOpenChange(false);
    } else {
      // Redirect to MetaMask website for installation
      toast.info("MetaMask not found. Redirecting to download page...");
      window.open("https://metamask.io/download/", "_blank");
    }
  };

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
            
            {/* MetaMask Option - Enhanced with visual distinction */}
            <button
              onClick={handleMetaMaskConnect}
              className="flex w-full items-center justify-between p-3 rounded-lg border border-orange-500/40 hover:bg-orange-500/20 transition-colors mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🦊</div>
                <div>
                  <span className="font-medium">MetaMask</span>
                  <p className="text-xs text-white/70">Popular Ethereum wallet</p>
                </div>
              </div>
              <div className="text-orange-400 flex items-center">
                {isMetaMaskInstalled ? (
                  "Connect"
                ) : (
                  <>
                    Install <ExternalLink size={14} className="ml-1" />
                  </>
                )}
              </div>
            </button>
            
            <button
              onClick={() => {
                if (openConnectModal) {
                  openConnectModal();
                  onOpenChange(false);
                } else {
                  toast.error("Rainbow Kit connection not available");
                }
              }}
              className="flex w-full items-center justify-between p-3 rounded-lg border border-ana-purple/20 hover:bg-ana-purple/20 transition-colors mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🌈</div>
                <div>
                  <span className="font-medium">Rainbow Kit</span>
                  <p className="text-xs text-white/70">Multiple wallets</p>
                </div>
              </div>
              <div className="text-ana-purple">Connect</div>
            </button>
            
            {/* Additional MetaMask Option - Below Rainbow Kit */}
            <button
              onClick={handleMetaMaskConnect}
              className="flex w-full items-center justify-between p-3 rounded-lg border border-ana-purple/20 hover:bg-ana-purple/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🦊</div>
                <div>
                  <span className="font-medium">MetaMask Direct</span>
                  <p className="text-xs text-white/70">Connect directly to MetaMask</p>
                </div>
              </div>
              <div className="text-ana-purple flex items-center">
                {isMetaMaskInstalled ? (
                  "Connect"
                ) : (
                  <>
                    Install <ExternalLink size={14} className="ml-1" />
                  </>
                )}
              </div>
            </button>
          </div>
          
          <Separator className="bg-ana-purple/20" />
          
          {/* Cardano Network Section */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Cardano Network</h3>
            <div className="flex flex-col gap-3">
              {cardanoWallets.map((wallet) => (
                <WalletOption
                  key={wallet.id}
                  wallet={wallet}
                  onConnect={onConnect}
                />
              ))}
            </div>
          </div>
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
      case "yoroi":
        return "🔷";
      case "lace":
        return "✨";
      default:
        return "💼";
    }
  };

  const handleWalletClick = () => {
    switch (wallet.id) {
      case "yoroi":
        // Check if Yoroi wallet is installed
        if (typeof window !== 'undefined' && window.cardano && window.cardano.yoroi) {
          onConnect(wallet.id);
        } else {
          // Redirect to Yoroi wallet website
          toast.info("Yoroi wallet not found. Redirecting to download page...");
          window.open("https://yoroi-wallet.com/", "_blank");
        }
        break;
      case "lace":
        // No need for type assertion anymore since we properly updated the type
        if (typeof window !== 'undefined' && window.cardano && window.cardano.lace) {
          onConnect(wallet.id);
        } else {
          // Redirect to Lace wallet website
          toast.info("Lace wallet not found. Redirecting to download page...");
          window.open("https://www.lace.io/", "_blank");
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
