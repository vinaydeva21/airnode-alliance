import { NFTMetadata } from "@/types/blockchain";
import {
  BigInt,
  Data,
  fromText,
  Lucid,
  mintingPolicyToId,
  paymentCredentialOf,
  UTxO,
  validatorToAddress,
  validatorToScriptHash,
} from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "../config";
import {
  AirNodeValidator,
  marketplaceValidator,
} from "@/config/scripts/scripts";
import { CampaignDatum, MarketplaceDatum } from "@/types/cardano";

export async function mintNFTCardano(
  airNodeId: string,
  fractionCount: bigint,
  m: NFTMetadata,
  walletApi: any
) {
  try {
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletApi);
    const address = await lucid.wallet().address();

    const marketplace_hash = validatorToScriptHash(marketplaceValidator);

    const validator = AirNodeValidator([
      paymentCredentialOf(address).hash,
      marketplace_hash,
    ]);
    const contractAddress = validatorToAddress(NETWORK, validator);
    const policyId = mintingPolicyToId(validator);

    const tokens = {
      [policyId + fromText(airNodeId)]: fractionCount,
    };
    const redeemer = Data.to(
      {
        name: fromText(airNodeId),
        price: 0n,
        fraction: fractionCount,
      },
      MarketplaceDatum
    );

    const tx = await lucid
      .newTx()
      .mintAssets(tokens, redeemer)
      .pay.ToContract(
        contractAddress,
        { kind: "inline", value: redeemer },
        { lovelace: 2_000_000n, ...tokens }
      )
      .attach.MintingPolicy(validator)
      .attachMetadata(721, {
        [policyId]: {
          [airNodeId]: {
            name: airNodeId,
            image: "https://avatars.githubusercontent.com/u/106166350",
            airNodeId: m.airNodeId,
            location: m.location,
            performance: {
              uptime: m.performance.uptime.toString(),
              earnings: m.performance.earnings.toString(),
              roi: m.performance.roi.toString(),
            },
            fractions: m.fractions,
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

export async function listTokenCardano(
  utxo: UTxO,
  metadata: any,
  price: bigint,
  fraction: bigint,
  walletApi: any
) {
  try {
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletApi);
    const address = await lucid.wallet().address();
    const marketplace_hash = validatorToScriptHash(marketplaceValidator);
    const validator = AirNodeValidator([
      paymentCredentialOf(address).hash, //replace with owner Address
      marketplace_hash,
    ]);
    const policyId = mintingPolicyToId(validator);
    const contractAddress = validatorToAddress(NETWORK, validator);

    const marketplaceAddress = validatorToAddress(
      NETWORK,
      marketplaceValidator
    );

    const tokensBackToContract =
      utxo.assets[policyId + fromText(metadata.name)] - fraction;
    console.log(metadata.name, fromText(metadata.name));
    const datum = Data.to(
      {
        name: fromText(metadata.name),
        price: price * 1_000_000n,
        fraction,
      },
      MarketplaceDatum
    );

    const redeemer = Data.to(fraction);
    const newTx = lucid
      .newTx()
      .collectFrom([utxo], redeemer)
      .pay.ToContract(
        marketplaceAddress,
        { kind: "inline", value: datum },
        { lovelace: 1n, [policyId + fromText(metadata.name)]: fraction }
      )
      .attach.Script(validator)
      .addSigner(address);

    tokensBackToContract !== 0n &&
      newTx.pay.ToContract(
        contractAddress,
        { kind: "inline", value: Data.void() },
        {
          lovelace: 1n,
          [policyId + fromText(metadata.name)]: tokensBackToContract,
        }
      );
    const tx = await newTx.complete();
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log(txHash);
    return txHash;
  } catch (error: any) {
    console.log(error);
  }
}

export async function BuyTokenCardano(
  utxo: UTxO,
  fraction: bigint,
  price: bigint,
  tokenName: string,
  walletApi: any
) {
  try {
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletApi);
    const address = await lucid.wallet().address();
    const marketplace_hash = validatorToScriptHash(marketplaceValidator);
    const validator = AirNodeValidator([
      paymentCredentialOf(address).hash, //replace with owner Address
      marketplace_hash,
    ]);
    const policyId = mintingPolicyToId(validator);
    const marketplaceAddress = validatorToAddress(
      NETWORK,
      marketplaceValidator
    );

    const tokensBackToContract =
      utxo.assets[policyId + fromText(tokenName)] - fraction;

    const datum = Data.to(
      {
        name: fromText(tokenName),
        price: price * 1_000_000n,
        fraction,
      },
      MarketplaceDatum
    );

    const redeemer = Data.void();
    const newTx = lucid
      .newTx()
      .collectFrom([utxo], redeemer)
      .pay.ToAddress(address, {
        lovelace: 1n,
        [policyId + fromText(tokenName)]: fraction,
      })
      .attach.Script(marketplaceValidator);

    tokensBackToContract !== 0n &&
      newTx.pay.ToContract(
        marketplaceAddress,
        { kind: "inline", value: Data.void() },
        {
          lovelace: 1n,
          [policyId + fromText(tokenName)]: tokensBackToContract,
        }
      );
    const tx = await newTx.complete();
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log(txHash);
    return txHash;
  } catch (error: any) {
    console.log(error);
  }
}
