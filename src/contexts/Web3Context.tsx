import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3State, ContractInteractions } from '@/types/blockchain';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

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
  
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const checkIfEvmWalletIsInstalled = () => {
    return window.ethereum !== undefined;
  };

  const checkIfNamiIsInstalled = () => {
    return window.cardano && window.cardano.nami !== undefined;
  };

  const checkIfYoroiIsInstalled = () => {
    return window.cardano && window.cardano.yoroi !== undefined;
  };

  useEffect(() => {
    if (isConnected && address) {
      setWeb3State({
        account: address,
        chainId: chainId,
        connected: true
      });
    }
  }, [address, chainId, isConnected]);

  useEffect(() => {
    const initProvider = async () => {
      if (checkIfEvmWalletIsInstalled()) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnect();
          } else {
            setWeb3State(prev => ({
              ...prev,
              account: accounts[0],
            }));
          }
        });

        window.ethereum.on('chainChanged', (chainId: string) => {
          const decimalChainId = parseInt(chainId, 16);
          setWeb3State(prev => ({
            ...prev,
            chainId: decimalChainId
          }));
          window.location.reload();
        });
      }
    };

    initProvider();

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
      
      if (walletId === "walletconnect") {
        try {
          if (isConnected) {
            await disconnectAsync();
          }
          
          const result = await connectAsync({ connector: connectAsync.connectors.find(c => c.id === 'walletConnect') });
          
          if (result.accounts && result.accounts.length > 0) {
            setWeb3State({
              account: result.accounts[0],
              chainId: result.chainId,
              connected: true
            });
            
            toast.success("WalletConnect connected", {
              description: `Address: ${result.accounts[0].substring(0, 6)}...${result.accounts[0].substring(result.accounts[0].length - 4)}`
            });
          }
          return;
        } catch (error) {
          console.error('WalletConnect error:', error);
          toast.error("Failed to connect with WalletConnect");
          return;
        }
      }
      
      if (walletId === "metamask" || walletId === "wmc") {
        if (!checkIfEvmWalletIsInstalled()) {
          toast.error("Please install MetaMask or another web3 wallet");
          return;
        }

        if (!provider) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);
        }

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
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
      else if (walletId === "nami") {
        if (!checkIfNamiIsInstalled()) {
          toast.error("Nami wallet not installed");
          return;
        }
        
        try {
          const namiAPI = await window.cardano.nami.enable();
          const address = await namiAPI.getChangeAddress();
          const addressHex = Buffer.from(address, 'hex').toString('hex');
          
          setWeb3State({
            account: addressHex,
            chainId: null,
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
          const yoroiAPI = await window.cardano.yoroi.enable();
          const address = await yoroiAPI.getChangeAddress();
          const addressHex = Buffer.from(address, 'hex').toString('hex');
          
          setWeb3State({
            account: addressHex,
            chainId: null,
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

  const disconnect = async () => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }
      
      setWeb3State({
        account: null,
        chainId: null,
        connected: false
      });
      setWalletType(null);
      toast.info("Disconnected from wallet");
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const getContractInteractions = (): ContractInteractions | null => {
    if (!web3State.connected || !provider) return null;

    return {
      mintNFT: async (airNodeId, fractionCount, metadataURI) => {
        console.log("Minting NFT:", { airNodeId, fractionCount, metadataURI });
        toast.info("NFT minting process initiated");
      },
      transferNFT: async (fractionId, toAddress) => {
        console.log("Transferring NFT:", { fractionId, toAddress });
        toast.info("NFT transfer initiated");
      },
      getOwner: async (fractionId) => {
        console.log("Getting owner of:", fractionId);
        return web3State.account || "";
      },
      updateMetadata: async (fractionId, metadata) => {
        console.log("Updating metadata:", { fractionId, metadata });
        toast.info("Metadata update initiated");
      },
      burnNFT: async (fractionId) => {
        console.log("Burning NFT:", fractionId);
        toast.info("NFT burn initiated");
      },

      listForSale: async (fractionId, price) => {
        console.log("Listing for sale:", { fractionId, price });
        toast.info("NFT listing initiated");
      },
      buyFraction: async (fractionId, price) => {
        console.log("Buying fraction:", { fractionId, price });
        toast.info("Purchase initiated");
      },
      leaseFraction: async (fractionId, duration, price) => {
        console.log("Leasing fraction:", { fractionId, duration, price });
        toast.info("Lease initiated");
      },
      getListings: async () => {
        console.log("Getting listings");
        return [];
      },

      depositRewards: async (airNodeId, amount) => {
        console.log("Depositing rewards:", { airNodeId, amount });
        toast.info("Reward deposit initiated");
      },
      calculateRewards: async (fractionId) => {
        console.log("Calculating rewards for:", fractionId);
        return 0;
      },
      claimRewards: async (fractionId) => {
        console.log("Claiming rewards for:", fractionId);
        toast.info("Rewards claim initiated");
      },
      getClaimableRewards: async (fractionId) => {
        console.log("Getting claimable rewards for:", fractionId);
        return 0;
      },

      submitProposal: async (description, votingDeadline) => {
        console.log("Submitting proposal:", { description, votingDeadline });
        toast.info("Proposal submission initiated");
      },
      vote: async (proposalId, fractionId, inFavor) => {
        console.log("Voting on proposal:", { proposalId, fractionId, inFavor });
        toast.info("Vote submitted");
      },
      executeProposal: async (proposalId) => {
        console.log("Executing proposal:", proposalId);
        toast.info("Proposal execution initiated");
      },

      stakeNFT: async (fractionId, stakingPeriod) => {
        console.log("Staking NFT:", { fractionId, stakingPeriod });
        toast.info("NFT staking initiated");
      },
      claimStakingRewards: async (fractionId) => {
        console.log("Claiming staking rewards for:", fractionId);
        toast.info("Staking rewards claim initiated");
      },
      useNFTAsCollateral: async (fractionId, loanAmount) => {
        console.log("Using NFT as collateral:", { fractionId, loanAmount });
        toast.info("Collateralization initiated");
      },
      liquidateNFT: async (fractionId) => {
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
