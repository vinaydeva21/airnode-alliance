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
    const assetName = "AirNode";
    const fracToken = "Fraction-AirNode";

    const mintedAssets = { [`${policyID}${fromText(assetName)}`]: 1n };
    const fractiontoken = {
      [`${policyID}${fromText(fracToken)}`]: fractionCount,
    };
    const redeemer = Data.void();
    console.log("refder", redeemer);
    console.log("pid", policyID);

    const tx = await lucid
      .newTx()
      .mintAssets(mintedAssets, redeemer)
      .mintAssets(fractiontoken, redeemer)

      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("tx complete", txHash);
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const lucid = await Lucid(PROVIDER, NETWORK);
  //   lucid.selectWallet.fromAPI(walletApi);
  //   const address = await lucid.wallet().address();

  //   const validator = AirNodeValidator([paymentCredentialOf(address).hash]);
  //   const contractAddress = validatorToAddress(NETWORK, validator);
  //   const policyId = mintingPolicyToId(validator);

  //   const tokens = {
  //     [policyId + fromText(airNodeId)]: BigInt(fractionCount),
  //   };

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
  //     .complete();
  //   console.log("tx complete");
  // } catch (error: any) {
  //   console.log(error);
  // }
}
