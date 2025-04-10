
import { useState, useEffect } from "react";
import { Web3State } from "@/types/blockchain";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
  checkIfEvmWalletIsInstalled,
  connectToEvmWallet,
  connectToCardanoWallet,
} from "@/utils/walletUtils";

export const useWalletConnect = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    chainId: null,
    connected: false,
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  // Initialize Ethereum provider and set up event listeners
  useEffect(() => {
    const initProvider = async () => {
      if (checkIfEvmWalletIsInstalled()) {
        // Only create the provider if window.ethereum exists
        if (typeof window !== 'undefined' && window.ethereum) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);

          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnect();
            } else {
              setWeb3State((prev) => ({
                ...prev,
                account: accounts[0],
              }));
            }
          });

          window.ethereum.on("chainChanged", (chainId: string) => {
            const decimalChainId = parseInt(chainId, 16);
            setWeb3State((prev) => ({
              ...prev,
              chainId: decimalChainId,
            }));
            window.location.reload();
          });
        }
      }
    };

    initProvider();

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  // Connect function
  const connect = async (walletId: string) => {
    try {
      setWalletType(walletId);

      // Handle MetaMask or Web3 Modal Connect
      if (walletId === "metamask" || walletId === "wmc") {
        const evmWalletState = await connectToEvmWallet();
        if (evmWalletState) {
          setWeb3State(evmWalletState);
        }
      }
      // Handle Yoroi wallet
      else if (walletId === "yoroi" || walletId === "lace") {
        const yoroiWalletState = await connectToCardanoWallet(walletId);
        if (yoroiWalletState) {
          setWeb3State(yoroiWalletState);
        }
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to wallet");
    }
  };

  // Disconnect function
  const disconnect = async () => {
    try {
      setWeb3State({
        account: null,
        chainId: null,
        connected: false,
      });
      setWalletType(null);
      toast.info("Disconnected from wallet");
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  return {
    web3State,
    provider,
    connect,
    disconnect,
  };
};
