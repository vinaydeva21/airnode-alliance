
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

// Define the Cardano interface before extending Window
interface CardanoWallet {
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
}

interface Cardano {
  nami?: CardanoWallet;
  yoroi?: CardanoWallet;
  lace?: CardanoWallet;
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
    cardano?: Cardano;
  }
}
