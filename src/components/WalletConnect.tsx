
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Wallet, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { AuthDialog } from "./wallet/AuthDialog";
import { StakingDialog } from "./wallet/StakingDialog";
import { TransactionHistoryDialog } from "./wallet/TransactionHistoryDialog";
import { MyAssetsDialog } from "./wallet/MyAssetsDialog";
import { WalletDropdownMenu } from "./wallet/WalletDropdownMenu";
import { WalletSelectionDialog } from "./wallet/WalletSelectionDialog";
import { 
  MOCK_WALLETS, 
  MOCK_TRANSACTIONS, 
  DEFAULT_WALLET_ASSETS,
  truncateAddress,
} from "./wallet/WalletData";
import { useWeb3 } from "@/contexts/Web3Context";

interface WalletConnectProps {
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className = "" }) => {
  const { web3State, connect, disconnect } = useWeb3();
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [myAssetsDialogOpen, setMyAssetsDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [walletSelectionOpen, setWalletSelectionOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async (walletId: string) => {
    setConnecting(true);
    
    try {
      // Connect to the wallet using Web3Context
      await connect();
      setWalletSelectionOpen(false);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect to wallet");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleAuthSuccess = () => {
    handleConnect("metamask");
  };

  return (
    <div className={className}>
      {!web3State.connected ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAuthTab("login");
              setAuthDialogOpen(true);
            }}
            className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
          >
            <User size={16} className="mr-1" />
            Login
          </Button>
          <Button
            onClick={() => setWalletSelectionOpen(true)}
            className="bg-ana-purple hover:bg-ana-purple/90"
            disabled={connecting}
          >
            {connecting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet size={16} className="mr-1" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      ) : (
        <WalletDropdownMenu
          walletName={"Web3 Wallet"}
          address={truncateAddress(web3State.account || "")}
          anaBalance={DEFAULT_WALLET_ASSETS.tokens.ana}
          stakedAna={DEFAULT_WALLET_ASSETS.tokens.anaStaked}
          pendingRewards={DEFAULT_WALLET_ASSETS.tokens.usdc}
          votingPower={3250}
          onDisconnect={handleDisconnect}
          onAssetsClick={() => setMyAssetsDialogOpen(true)}
          onStakeClick={() => setStakeDialogOpen(true)}
          onHistoryClick={() => setTransactionHistoryOpen(true)}
        />
      )}
      
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        activeTab={authTab}
        setActiveTab={setAuthTab}
        onSuccess={handleAuthSuccess}
      />
      
      <StakingDialog
        open={stakeDialogOpen}
        onOpenChange={setStakeDialogOpen}
        availableAna={DEFAULT_WALLET_ASSETS.tokens.ana}
      />
      
      <TransactionHistoryDialog
        open={transactionHistoryOpen}
        onOpenChange={setTransactionHistoryOpen}
        transactions={MOCK_TRANSACTIONS}
      />
      
      <MyAssetsDialog
        open={myAssetsDialogOpen}
        onOpenChange={setMyAssetsDialogOpen}
        airNodes={DEFAULT_WALLET_ASSETS.airNodes}
        tokens={DEFAULT_WALLET_ASSETS.tokens}
        totalValue={DEFAULT_WALLET_ASSETS.totalValue}
        onStakeClick={() => {
          setMyAssetsDialogOpen(false);
          setStakeDialogOpen(true);
        }}
      />

      <WalletSelectionDialog 
        open={walletSelectionOpen}
        onOpenChange={setWalletSelectionOpen}
        wallets={MOCK_WALLETS}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default WalletConnect;
