
// Smart Contract Interfaces
export interface NFTMetadata {
  airNodeId: string;
  location: string;
  performance: {
    uptime: number;
    earnings: number;
    roi: number;
  };
  totalFractions: number;
}

export interface NFTFraction {
  id: string;
  airNodeId: string;
  owner: string;
  listed: boolean;
  listPrice?: number;
  staked: boolean;
  stakingPeriod?: number;
  collateralized: boolean;
  loanAmount?: number;
}

export interface MarketplaceListing {
  fractionId: string;
  seller: string;
  price: number;
  type: "sale" | "lease";
  leaseDuration?: number;
}

export interface Reward {
  fractionId: string;
  amount: number;
  timestamp: number;
  claimed: boolean;
}

export interface Web3State {
  account: string | null;
  chainId: number | null;
  connected: boolean;
}

// Contract Interaction Functions
export interface ContractInteractions {
  // NFT Contract
  mintNFT: (airNodeId: string, fractionCount: number, metadataURI: string) => Promise<void>;
  transferNFT: (fractionId: string, toAddress: string) => Promise<void>;
  getOwner: (fractionId: string) => Promise<string>;
  updateMetadata: (fractionId: string, metadata: NFTMetadata) => Promise<void>;
  burnNFT: (fractionId: string) => Promise<void>;

  // Marketplace Contract
  listForSale: (fractionId: string, price: number) => Promise<void>;
  buyFraction: (fractionId: string, price: number) => Promise<void>;
  leaseFraction: (fractionId: string, duration: number, price: number) => Promise<void>;
  getListings: () => Promise<MarketplaceListing[]>;

  // Rewards Contract
  depositRewards: (airNodeId: string, amount: number) => Promise<void>;
  calculateRewards: (fractionId: string) => Promise<number>;
  claimRewards: (fractionId: string) => Promise<void>;
  getClaimableRewards: (fractionId: string) => Promise<number>;

  // Governance Contract
  submitProposal: (description: string, votingDeadline: number) => Promise<void>;
  vote: (proposalId: string, fractionId: string, inFavor: boolean) => Promise<void>;
  executeProposal: (proposalId: string) => Promise<void>;

  // Staking Contract
  stakeNFT: (fractionId: string, stakingPeriod: number) => Promise<void>;
  claimStakingRewards: (fractionId: string) => Promise<void>;
  useNFTAsCollateral: (fractionId: string, loanAmount: number) => Promise<void>;
  liquidateNFT: (fractionId: string) => Promise<void>;
}
