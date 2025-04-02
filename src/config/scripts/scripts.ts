import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  MintingPolicy,
  Validator,
} from "@lucid-evolution/lucid";
import {
  placeholder_placeholder_spend,
  mint_token_placeholder_mint,
  marketplace_marketplace_spend,
} from "./plutus";
import { mint } from "viem/chains";

// ------------------------------------------------------------------
const airnode_script = applyDoubleCborEncoding(placeholder_placeholder_spend);

export function AirNodeValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_script, params),
  };
}

const mint_token = applyDoubleCborEncoding(mint_token_placeholder_mint);
export const mintingValidator: MintingPolicy = {
  type: "PlutusV3",
  script: mint_token_placeholder_mint,
};

// MarketPlace Validator
const marketplace_script = applyDoubleCborEncoding(
  marketplace_marketplace_spend
);
export const marketplaceValidator: Validator = {
  type: "PlutusV3",
  script: marketplace_script,
};
