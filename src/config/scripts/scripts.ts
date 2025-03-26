
import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  MintingPolicy,
  Validator,
} from "@lucid-evolution/lucid";
import {
  placeholder_placeholder_spend,
  mint_token_placeholder_mint,
  airnode_nft_airnode_nft_mint,
  airnode_nft_airnode_nft_spend,
  marketplace_marketplace_spend,
  staking_staking_spend,
  governance_governance_spend,
} from "./plutus";

// ------------------------------------------------------------------
const airnode_script = applyDoubleCborEncoding(placeholder_placeholder_spend);

export function AirNodeValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_script, params),
  };
}

// AirNode NFT contracts
const airnode_nft_mint = applyDoubleCborEncoding(airnode_nft_airnode_nft_mint);

export function AirNodeNFTMintingPolicy(params: any[]): MintingPolicy {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_nft_mint, params),
  };
}

const airnode_nft_spend_validator = applyDoubleCborEncoding(airnode_nft_airnode_nft_spend);

export function AirNodeNFTValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_nft_spend_validator, params),
  };
}

// Marketplace contract
const marketplace_validator = applyDoubleCborEncoding(marketplace_marketplace_spend);

export function MarketplaceValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(marketplace_validator, params),
  };
}

// Staking contract
const staking_validator = applyDoubleCborEncoding(staking_staking_spend);

export function StakingValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(staking_validator, params),
  };
}

// Governance contract
const governance_validator = applyDoubleCborEncoding(governance_governance_spend);

export function GovernanceValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(governance_validator, params),
  };
}

// Default mint token policy
const mint_token = applyDoubleCborEncoding(mint_token_placeholder_mint);
export const mintingValidator: MintingPolicy = {
  type: "PlutusV3",
  script: mint_token_placeholder_mint,
};
