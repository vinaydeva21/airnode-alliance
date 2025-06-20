import { ContractInteractions, Web3State } from "@/types/blockchain";

export interface Web3ContextType {
  web3State: Web3State;
  contracts: ContractInteractions | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  chain: "Cardano" | "WMC";
  setChain: (chain: "Cardano" | "WMC") => void;
}

export interface WalletProviderProps {
  children: React.ReactNode;
}
