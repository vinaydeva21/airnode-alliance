
export interface Window {
  ethereum?: any;
  cardano: Cardano;
}

export interface Cardano {
  enable: () => Promise<CIP30Wallet>;
  nami?: AnyWallet;
  eternl?: AnyWallet;
  flint?: AnyWallet;
  lace?: AnyWallet;
  gerowallet?: AnyWallet;
  typhoncip30?: AnyWallet;
  [key: string]: AnyWallet | undefined | ((arg: any) => any);
}

export interface AnyWallet {
  enable: () => Promise<CIP30Wallet>;
  name?: string;
  apiVersion?: string;
  icon?: string;
  [key: string]: any;
}

export interface CIP30Wallet {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<any>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (address: string, payload: string) => Promise<any>;
  submitTx: (tx: string) => Promise<string>;
  getCollateral: () => Promise<string[] | undefined>;
  [key: string]: any;
}

// Web3Context types for React context
export interface Web3ContextType {
  web3State: Web3State;
  provider: any;
  contracts: any;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface WalletProviderProps {
  children: React.ReactNode;
}

// Web3State type for app state
export interface Web3State {
  account: string | null;
  chainId: number | null;
  connected: boolean;
}

// Remove the duplicate declaration and use the above interface
