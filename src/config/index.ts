import { Blockfrost, Network, Provider } from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);

// Adding Blockfrost and Cardano network configs
export const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";
export const BLOCKFROST_ID = "preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Replace with actual ID in production
export const CARDANO_NETWORK = "Preprod"; // 'Mainnet' | 'Testnet' | 'Preview' | 'Preprod'
