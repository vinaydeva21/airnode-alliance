import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  Validator,
} from "@lucid-evolution/lucid";
import { placeholder_placeholder_spend } from "./plutus";

// ------------------------------------------------------------------
const airnode_script = applyDoubleCborEncoding(placeholder_placeholder_spend);

export function AirNodeValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(airnode_script, params),
  };
}
