// Type definitions and mock data for wallet components

export interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: string;
  value: string;
  timestamp: string;
}

export interface AirNode {
  name: string;
  shares: number;
  value: number;
  earnings: number;
  roi: number;
}

export interface TokenBalances {
  ana: number;
  anaStaked: number;
  usdc: number;
}

export interface WalletAssets {
  airNodes: AirNode[];
  tokens: TokenBalances;
  totalValue: number;
}

export interface WalletInfo {
  id: string;
  name: string;
}

// Mock data
export const MOCK_WALLETS: WalletInfo[] = [
  { id: "metamask", name: "MetaMask" },
  { id: "yoroi", name: "Yoroi Wallet" },
  { id: "wmc", name: "World Mobile Wallet" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx1", type: "Buy", asset: "Portal 180", amount: "2 shares", value: "$90.00", timestamp: "2023-09-15 14:32" },
  { id: "tx2", type: "Stake", asset: "ANA Token", amount: "150 ANA", value: "$75.00", timestamp: "2023-09-10 09:45" },
  { id: "tx3", type: "Claim", asset: "Rewards", amount: "25 USDC", value: "$25.00", timestamp: "2023-09-01 16:20" },
  { id: "tx4", type: "Vote", asset: "Proposal #24", amount: "-", value: "-", timestamp: "2023-08-28 11:15" },
  { id: "tx5", type: "Collateralize", asset: "Nexus I", amount: "3 shares", value: "$225.00", timestamp: "2023-08-15 10:30" }
];

export const DEFAULT_WALLET_ASSETS: WalletAssets = {
  airNodes: [
    { name: "Portal 180", shares: 3, value: 135, earnings: 7.2, roi: 18.6 },
    { name: "Nexus I", shares: 2, value: 150, earnings: 7.2, roi: 22.4 }
  ],
  tokens: {
    ana: 450,
    anaStaked: 150,
    usdc: 125.75
  },
  totalValue: 860.75
};

// Helper function to truncate wallet address
export const truncateAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Mock connect function that generates a random wallet address
export const generateMockAddress = (): string => {
  return "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};
