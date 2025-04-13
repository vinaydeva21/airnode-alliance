
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3State, ContractInteractions } from '@/types/blockchain';
import { Web3ContextType, WalletProviderProps } from '@/types/web3Types';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { initializeContracts } from '@/utils/contractHelpers';
import { ethers } from 'ethers';

// Create the Web3 context
const Web3Context = createContext<Web3ContextType | null>(null);

// Provider component that wraps the app
export const Web3Provider: React.FC<WalletProviderProps> = ({ children }) => {
  // Get wallet connection logic from the hook
  const { web3State, provider, connect, disconnect } = useWalletConnect();
  
  // Initialize contract interactions state
  const [contracts, setContracts] = useState<ContractInteractions | null>(null);
  
  // Initialize contracts on component mount
  useEffect(() => {
    console.log("Initializing contracts");
    initializeContracts();
  }, []);
  
  // Update contract interactions when web3State or provider changes
  useEffect(() => {
    if (web3State.connected && provider) {
      console.log("Web3 state is connected, setting up contracts");
      // We'll set this up separately in the hooks
      setContracts({} as ContractInteractions); 
    } else {
      console.log("Web3 state is disconnected, clearing contracts");
      setContracts(null);
    }
  }, [web3State.connected, provider]);

  // Provide the context value to children
  return (
    <Web3Context.Provider value={{ 
      web3State, 
      provider,
      contracts, 
      connect, 
      disconnect 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
