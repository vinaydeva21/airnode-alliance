
import { ContractInteractions, Web3State } from "@/types/blockchain";

export interface Web3ContextType {
  web3State: Web3State;
  contracts: ContractInteractions | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
}

export interface WalletProviderProps {
  children: React.ReactNode;
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
