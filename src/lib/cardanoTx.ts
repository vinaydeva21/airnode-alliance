import { NFTMetadata } from "@/types/blockchain";
import {
  BigInt,
  Data,
  fromText,
  Lucid,
  mintingPolicyToId,
  paymentCredentialOf,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "../config";
import { AirNodeValidator, mintingValidator } from "@/config/scripts/scripts";
import { CampaignDatum } from "@/types/cardano";

export async function mintNFTCardano(
  airNodeId: string,
  fractionCount: bigint,
  metadata: NFTMetadata,
  walletApi: any
) {
  try {
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletApi);
    const address = await lucid.wallet().address();
    // const mintingValidator: MintingPolicy = {
    //   type: "PlutusV3",
    //   script: mint_token_placeholder_mint,
    // };

    //     const contractAddress = validatorToAddress(NETWORK, validator);
    //     const policyId = mintingPolicyToId(validator);

    const policyID = mintingPolicyToId(mintingValidator);
    const policyId = policyID;
    const contractAddress = validatorToAddress(NETWORK, mintingValidator);
    //   const validator = AirNodeValidator([paymentCredentialOf(address).hash]);
    //   const contractAddress = validatorToAddress(NETWORK, validator);
    //   const policyId = mintingPolicyToId(validator);

    const tokens = {
      [policyId + fromText(airNodeId)]: fractionCount,
    };
    const redeemer = Data.void();

    const tx = await lucid
      .newTx()
      .mintAssets(tokens, redeemer)
      .pay.ToContract(
        contractAddress,
        { kind: "inline", value: Data.void() },
        { lovelace: 2_000_000n, ...tokens }
      )
      .attach.MintingPolicy(mintingValidator)
      .attachMetadata(721, {
        [policyId]: {
          [airNodeId]: {
            name: airNodeId,
            image: "https://avatars.githubusercontent.com/u/106166350",
            // ...metadata,
          },
        },
      })
      .addSigner(address)
      .complete();

    //   const redeemer: CampaignDatum = {
    //     name: fromText(airNodeId),
    //     goal: BigInt(fractionCount * 4_000_000),
    //     fraction: BigInt(fractionCount),
    //   };
    //   const tx = await lucid
    //     .newTx()
    //     .mintAssets(tokens, Data.to(redeemer, CampaignDatum))
    //     .pay.ToContract(
    //       contractAddress,
    //       { kind: "inline", value: Data.to(redeemer, CampaignDatum) },
    //       { lovelace: 2_000_000n, ...tokens }
    //     )
    //     .attach.Script(validator)
    //     .attachMetadata(721, {
    //       [policyId]: {
    //         [airNodeId]: {
    //           name: airNodeId,
    //           image: "https://avatars.githubusercontent.com/u/106166350",
    //           ...metadata,
    //         },
    //       },
    //     })
    //     .addSigner(address)
    // .complete();
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log(txHash);
  } catch (error: any) {
    console.log(error);
  }
}
