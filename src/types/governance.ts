
export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: "Active" | "Passed" | "Rejected" | "Pending";
  endTime: string;
  votesFor: number;
  votesAgainst: number;
  abstain?: number;
  totalVotes: number;
  threshold: number;
  category?: string;
  createdAt?: Date;
  endDate?: Date;
}

export interface Vote {
  proposalId: string;
  proposalTitle: string;
  vote: "For" | "Against" | "Abstain";
  timestamp: Date;
}

export interface TreasuryTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface TreasuryAllocation {
  newAirNodes: number;
  rewards: number;
  operations: number;
  reserve: number;
}

export interface TreasuryData {
  totalBalance: number;
  allocation: TreasuryAllocation;
  recentTransactions: TreasuryTransaction[];
}
