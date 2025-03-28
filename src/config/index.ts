
// Import CML instead of directly importing Network and Provider
import { CML } from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL || '';
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID || '';
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as string || '';

export const NETWORK: string = NETWORKx || 'Preprod';
// Use the provider differently since Blockfrost is not directly exported
export const PROVIDER = { url: BF_URL, projectId: BF_PID };

// Adding Blockfrost and Cardano network configs
export const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";
export const BLOCKFROST_ID = "preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Replace with actual ID in production
export const CARDANO_NETWORK = "Preprod"; // 'Mainnet' | 'Testnet' | 'Preview' | 'Preprod'
