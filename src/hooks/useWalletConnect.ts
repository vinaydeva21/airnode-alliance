
import { useState, useEffect } from "react";
import { Web3State } from "@/types/blockchain";
import { useAccount, useConnect, useDisconnect, useConfig } from "wagmi";
const WMC_CHAIN_ID = 323432; // World Mobile Chain Testnet
const WMC_RPC_URL = "https://worldmobile-testnet.g.alchemy.com/v2/DzZUBKUFFmr_PE7VxyaRMlAZGUujAfyB";
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

  const { address, chainId, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const config = useConfig();

  // Update web3State when wagmi account changes
  useEffect(() => {
    if (isConnected && address) {
      setWeb3State({
        account: address,
        chainId: chainId,
        connected: true,
      });

      // Check if we're on World Mobile Chain testnet, if not prompt to switch
      if (chainId && chainId !== WMC_CHAIN_ID) {
        toast.warning("Wrong network detected", {
          description: "Please switch to World Mobile Chain testnet",
          action: {
            label: "Switch",
            onClick: () => switchToWMC(),
          },
        });
      }
    }
  }, [address, chainId, isConnected]);

  // Initialize Ethereum provider and set up event listeners
  useEffect(() => {
    const initProvider = async () => {
      if (checkIfEvmWalletIsInstalled()) {
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
          
          // Check if new chain is World Mobile Chain testnet
          if (decimalChainId !== WMC_CHAIN_ID) {
            toast.warning("Wrong network detected", {
              description: "Please switch to World Mobile Chain testnet",
              action: {
                label: "Switch",
                onClick: () => switchToWMC(),
              },
            });
          } else {
            toast.success("Connected to World Mobile Chain testnet");
          }
        });
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  // Switch to World Mobile Chain testnet
  const switchToWMC = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${WMC_CHAIN_ID.toString(16)}` }],
        });
        toast.success("Switched to World Mobile Chain testnet");
      }
    } catch (error: any) {
      console.error("Failed to switch network:", error);
      
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902 && window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${WMC_CHAIN_ID.toString(16)}`,
                chainName: "World Mobile Chain Testnet",
                nativeCurrency: {
                  name: "WOMOX",
                  symbol: "WOMOX",
                  decimals: 18,
                },
                rpcUrls: [WMC_RPC_URL],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add WMC testnet:", addError);
          toast.error("Failed to add WMC testnet to wallet");
        }
      } else {
        toast.error("Failed to switch network");
      }
    }
  };

  // Connect function
  const connect = async (walletId: string) => {
    try {
      setWalletType(walletId);

      // Handle MetaMask or Web3 Modal Connect
      if (walletId === "metamask" || walletId === "wmc") {
        const evmWalletState = await connectToEvmWallet();
        if (evmWalletState) {
          setWeb3State(evmWalletState);
          
          // Check if we need to switch to World Mobile Chain testnet
          if (evmWalletState.chainId !== WMC_CHAIN_ID) {
            await switchToWMC();
          }
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
      if (isConnected) {
        await disconnectAsync();
      }

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
    switchToWMC,
  };
};
