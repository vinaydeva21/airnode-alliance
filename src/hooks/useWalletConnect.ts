
import { useState, useEffect } from 'react';
import { Web3State } from '@/types/blockchain';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { 
  checkIfEvmWalletIsInstalled,
  connectToEvmWallet,
  connectToNami,
  connectToYoroi
} from '@/utils/walletUtils';

export const useWalletConnect = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    chainId: null,
    connected: false
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  // Update web3State when wagmi account changes
  useEffect(() => {
    if (isConnected && address) {
      setWeb3State({
        account: address,
        chainId: chainId,
        connected: true
      });
    }
  }, [address, chainId, isConnected]);

  // Initialize Ethereum provider and set up event listeners
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

  // Connect function
  const connect = async (walletId: string) => {
    try {
      setWalletType(walletId);
      
      // Handle WalletConnect
      if (walletId === "walletconnect") {
        try {
          if (isConnected) {
            await disconnectAsync();
          }
          
          // Find the WalletConnect connector
          const walletConnectConnector = connectors.find(c => c.id === 'walletConnect');
          
          if (!walletConnectConnector) {
            toast.error("WalletConnect connector not found");
            return;
          }
          
          const result = await connectAsync({ connector: walletConnectConnector });
          
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
      
      // Handle MetaMask or Web3 Modal Connect
      if (walletId === "metamask" || walletId === "wmc") {
        const evmWalletState = await connectToEvmWallet();
        if (evmWalletState) {
          setWeb3State(evmWalletState);
        }
      } 
      // Handle Nami wallet
      else if (walletId === "nami") {
        const namiWalletState = await connectToNami();
        if (namiWalletState) {
          setWeb3State(namiWalletState);
        }
      }
      // Handle Yoroi wallet
      else if (walletId === "yoroi") {
        const yoroiWalletState = await connectToYoroi();
        if (yoroiWalletState) {
          setWeb3State(yoroiWalletState);
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error);
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
        connected: false
      });
      setWalletType(null);
      toast.info("Disconnected from wallet");
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error("Failed to disconnect wallet");
    }
  };

  return {
    web3State,
    provider,
    connect,
    disconnect
  };
};
