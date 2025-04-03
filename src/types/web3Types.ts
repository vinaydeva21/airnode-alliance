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
