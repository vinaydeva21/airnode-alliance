import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  MintingPolicy,
  Validator,
} from "@lucid-evolution/lucid";
import {
  marketplace_marketplace_spend,
  airnode_minter_airnode_minter_spend,
} from "./plutus";

// ------------------------------------------------------------------
const airnode_script = applyDoubleCborEncoding(
  airnode_minter_airnode_minter_spend
);

export function AirNodeValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_script, params),
  };
}

// MarketPlace Validator
const marketplace_script = applyDoubleCborEncoding(
  marketplace_marketplace_spend
);
export const marketplaceValidator: Validator = {
  type: "PlutusV3",
  script: marketplace_script,
};
