
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3State, ContractInteractions } from '@/types/blockchain';
import { toast } from 'sonner';
import { ethers } from 'ethers';

interface Web3ContextType {
  web3State: Web3State;
  contracts: ContractInteractions | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    chainId: null,
    connected: false
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  // Check if an EVM wallet is installed
  const checkIfEvmWalletIsInstalled = () => {
    return window.ethereum !== undefined;
  };

  // Check if Cardano wallets are installed
  const checkIfNamiIsInstalled = () => {
    return window.cardano && window.cardano.nami !== undefined;
  };

  const checkIfYoroiIsInstalled = () => {
    return window.cardano && window.cardano.yoroi !== undefined;
  };

  // Initialize provider and listen for account changes
  useEffect(() => {
    const initProvider = async () => {
      if (checkIfEvmWalletIsInstalled()) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnect();
          } else {
            // User switched accounts
            setWeb3State(prev => ({
              ...prev,
              account: accounts[0],
            }));
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          // Convert hex chainId to decimal
          const decimalChainId = parseInt(chainId, 16);
          setWeb3State(prev => ({
            ...prev,
            chainId: decimalChainId
          }));
          // Reload the page to avoid any errors with chain change
          window.location.reload();
        });
      }
    };

    initProvider();

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const connect = async (walletId: string) => {
    try {
      setWalletType(walletId);
      
      // Handle EVM-based wallets
      if (walletId === "metamask" || walletId === "walletconnect" || walletId === "wmc") {
        if (!checkIfEvmWalletIsInstalled()) {
          toast.error("Please install MetaMask or another web3 wallet");
          return;
        }

        if (!provider) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);
        }

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // Get current chain ID
        const chainIdHex = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        const chainId = parseInt(chainIdHex, 16);

        if (accounts.length > 0) {
          setWeb3State({
            account: accounts[0],
            chainId: chainId,
            connected: true
          });
          toast.success("Wallet connected", {
            description: `Address: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`
          });
        }
      } 
      // Handle Cardano-based wallets
      else if (walletId === "nami") {
        if (!checkIfNamiIsInstalled()) {
          toast.error("Nami wallet not installed");
          return;
        }
        
        try {
          // Request Nami wallet connection
          const namiAPI = await window.cardano.nami.enable();
          const address = await namiAPI.getChangeAddress();
          const addressHex = Buffer.from(address, 'hex').toString('hex');
          
          setWeb3State({
            account: addressHex,
            chainId: null, // Cardano doesn't use chainId the same way
            connected: true
          });
          
          toast.success("Nami wallet connected", {
            description: `Address: ${addressHex.substring(0, 6)}...${addressHex.substring(addressHex.length - 4)}`
          });
        } catch (error) {
          console.error('Nami connection error:', error);
          toast.error("Failed to connect to Nami wallet");
        }
      }
      else if (walletId === "yoroi") {
        if (!checkIfYoroiIsInstalled()) {
          toast.error("Yoroi wallet not installed");
          return;
        }
        
        try {
          // Request Yoroi wallet connection
          const yoroiAPI = await window.cardano.yoroi.enable();
          const address = await yoroiAPI.getChangeAddress();
          const addressHex = Buffer.from(address, 'hex').toString('hex');
          
          setWeb3State({
            account: addressHex,
            chainId: null, // Cardano doesn't use chainId the same way
            connected: true
          });
          
          toast.success("Yoroi wallet connected", {
            description: `Address: ${addressHex.substring(0, 6)}...${addressHex.substring(addressHex.length - 4)}`
          });
        } catch (error) {
          console.error('Yoroi connection error:', error);
          toast.error("Failed to connect to Yoroi wallet");
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error("Failed to connect to wallet");
    }
  };

  const disconnect = () => {
    setWeb3State({
      account: null,
      chainId: null,
      connected: false
    });
    setWalletType(null);
    toast.info("Disconnected from wallet");
  };

  // Define contract interactions with the connected wallet
  const getContractInteractions = (): ContractInteractions | null => {
    if (!web3State.connected || !provider) return null;

    return {
      // NFT Contract
      mintNFT: async (airNodeId, fractionCount, metadataURI) => {
        // Placeholder: Will implement contract interaction
        console.log("Minting NFT:", { airNodeId, fractionCount, metadataURI });
        toast.info("NFT minting process initiated");
      },
      transferNFT: async (fractionId, toAddress) => {
        // Placeholder: Will implement contract interaction
        console.log("Transferring NFT:", { fractionId, toAddress });
        toast.info("NFT transfer initiated");
      },
      getOwner: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Getting owner of:", fractionId);
        return web3State.account || "";
      },
      updateMetadata: async (fractionId, metadata) => {
        // Placeholder: Will implement contract interaction
        console.log("Updating metadata:", { fractionId, metadata });
        toast.info("Metadata update initiated");
      },
      burnNFT: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Burning NFT:", fractionId);
        toast.info("NFT burn initiated");
      },

      // Marketplace Contract
      listForSale: async (fractionId, price) => {
        // Placeholder: Will implement contract interaction
        console.log("Listing for sale:", { fractionId, price });
        toast.info("NFT listing initiated");
      },
      buyFraction: async (fractionId, price) => {
        // Placeholder: Will implement contract interaction
        console.log("Buying fraction:", { fractionId, price });
        toast.info("Purchase initiated");
      },
      leaseFraction: async (fractionId, duration, price) => {
        // Placeholder: Will implement contract interaction
        console.log("Leasing fraction:", { fractionId, duration, price });
        toast.info("Lease initiated");
      },
      getListings: async () => {
        // Placeholder: Will implement contract interaction
        console.log("Getting listings");
        return [];
      },

      // Rewards Contract
      depositRewards: async (airNodeId, amount) => {
        // Placeholder: Will implement contract interaction
        console.log("Depositing rewards:", { airNodeId, amount });
        toast.info("Reward deposit initiated");
      },
      calculateRewards: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Calculating rewards for:", fractionId);
        return 0;
      },
      claimRewards: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Claiming rewards for:", fractionId);
        toast.info("Rewards claim initiated");
      },
      getClaimableRewards: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Getting claimable rewards for:", fractionId);
        return 0;
      },

      // Governance Contract
      submitProposal: async (description, votingDeadline) => {
        // Placeholder: Will implement contract interaction
        console.log("Submitting proposal:", { description, votingDeadline });
        toast.info("Proposal submission initiated");
      },
      vote: async (proposalId, fractionId, inFavor) => {
        // Placeholder: Will implement contract interaction
        console.log("Voting on proposal:", { proposalId, fractionId, inFavor });
        toast.info("Vote submitted");
      },
      executeProposal: async (proposalId) => {
        // Placeholder: Will implement contract interaction
        console.log("Executing proposal:", proposalId);
        toast.info("Proposal execution initiated");
      },

      // Staking Contract
      stakeNFT: async (fractionId, stakingPeriod) => {
        // Placeholder: Will implement contract interaction
        console.log("Staking NFT:", { fractionId, stakingPeriod });
        toast.info("NFT staking initiated");
      },
      claimStakingRewards: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Claiming staking rewards for:", fractionId);
        toast.info("Staking rewards claim initiated");
      },
      useNFTAsCollateral: async (fractionId, loanAmount) => {
        // Placeholder: Will implement contract interaction
        console.log("Using NFT as collateral:", { fractionId, loanAmount });
        toast.info("Collateralization initiated");
      },
      liquidateNFT: async (fractionId) => {
        // Placeholder: Will implement contract interaction
        console.log("Liquidating NFT:", fractionId);
        toast.info("Liquidation initiated");
      }
    };
  };

  return (
    <Web3Context.Provider value={{ 
      web3State, 
      contracts: getContractInteractions(), 
      connect, 
      disconnect 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Add type definitions for the window object
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
    };
    cardano?: {
      nami?: {
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
      };
      yoroi?: {
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}
