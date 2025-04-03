import { Blockfrost, Network, Provider } from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);
export const OWNER =
  "addr_test1qz8uszw3ttxjvjllacn3zmm36as88v3vprsar59arqqwdxxhx2u93sjnxtcdjkhctzydqcwvqg9xkfjaf7l260xzw4hspfkj73";
// vinay address
