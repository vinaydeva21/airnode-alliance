import { NFTMetadata } from "@/types/blockchain";
import { Lucid } from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "../config";

export async function mintNFTCardano(
  airNodeId: string,
  fractionCount: number,
  metadata: NFTMetadata,
  walletApi: any
) {
  console.log("api", walletApi);
  const lucid = await Lucid(PROVIDER, NETWORK);
  lucid.selectWallet.fromAPI(walletApi);
}
