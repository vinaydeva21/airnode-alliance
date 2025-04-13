
import { ContractInteractions, Web3State } from "@/types/blockchain";
import { ethers } from "ethers";

export interface Web3ContextType {
  web3State: Web3State;
  provider: ethers.BrowserProvider | null;
  contracts: ContractInteractions | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
}

export interface WalletProviderProps {
  children: React.ReactNode;
}

// Add contract types
export interface AirNodeContractConfig {
  airNodeNFTAddress: string;
  airNodeNFTAbi: any[];
  fractionalizationAddress: string;
  fractionalizationAbi: any[];
  marketplaceAddress: string;
  marketplaceAbi: any[];
}

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
      lace?: {
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}
