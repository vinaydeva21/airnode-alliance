import { Blockfrost, Network, Provider } from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);
export const OWNER =
  "addr_test1qrlq53qjd2yxx4lqj29526fn2uyl9fe7julp4shkgqm3m4dpvpz9h24n9ttq5f4d2xunltqy3yfphmr29uw4kwxt0h9qadh7tj";
