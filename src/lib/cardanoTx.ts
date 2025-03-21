import { NFTMetadata } from "@/types/blockchain";
import {
  Data,
  fromText,
  Lucid,
  mintingPolicyToId,
  paymentCredentialOf,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "../config";
import { AirNodeValidator } from "@/config/scripts/scripts";
import { CampaignDatum } from "@/types/cardano";

export async function mintNFTCardano(
  airNodeId: string,
  fractionCount: number,
  metadata: NFTMetadata,
  walletApi: any
) {
  try {
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletApi);
    const address = await lucid.wallet().address();

    const validator = AirNodeValidator([paymentCredentialOf(address).hash]);
    const contractAddress = validatorToAddress(NETWORK, validator);
    const policyId = mintingPolicyToId(validator);

    const tokens = {
      [policyId + fromText(airNodeId)]: BigInt(fractionCount),
    };

    const redeemer: CampaignDatum = {
      name: fromText(airNodeId),
      goal: BigInt(fractionCount * 4_000_000),
      fraction: BigInt(fractionCount),
    };
    const tx = await lucid
      .newTx()
      .mintAssets(tokens, Data.to(redeemer, CampaignDatum))
      .pay.ToContract(
        contractAddress,
        { kind: "inline", value: Data.to(redeemer, CampaignDatum) },
        { lovelace: 2_000_000n, ...tokens }
      )
      .attach.Script(validator)
      .attachMetadata(721, {
        [policyId]: {
          [airNodeId]: {
            name: airNodeId,
            image: "https://avatars.githubusercontent.com/u/106166350",
            ...metadata,
          },
        },
      })
      .addSigner(address)
      .complete();
    console.log("tx complete");
  } catch (error: any) {
    console.log(error);
  }
}
