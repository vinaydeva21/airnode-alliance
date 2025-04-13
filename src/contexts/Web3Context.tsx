
import React, { createContext, useContext, useEffect } from 'react';
import { Web3State, ContractInteractions } from '@/types/blockchain';
import { Web3ContextType, WalletProviderProps } from '@/types/web3Types';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { useContractInteractions } from '@/hooks/useContractInteractions';
import { initializeContracts } from '@/utils/contractHelpers';

// Create the Web3 context
const Web3Context = createContext<Web3ContextType | null>(null);

// Provider component that wraps the app
export const Web3Provider: React.FC<WalletProviderProps> = ({ children }) => {
  // Get wallet connection logic from the hook
  const { web3State, provider, connect, disconnect } = useWalletConnect();
  
  // Initialize contracts on component mount
  useEffect(() => {
    initializeContracts();
  }, []);
  
  // Get contract interactions based on current Web3 state
  const contracts = useContractInteractions(web3State, provider);

  // Provide the context value to children
  return (
    <Web3Context.Provider value={{ 
      web3State, 
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
