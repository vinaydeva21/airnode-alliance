
import { CML } from "@lucid-evolution/lucid";

//#region Alias
export const PaymentKeyHashSchema = CML.Data.Bytes();
export const StakeKeyHashSchema = CML.Data.Bytes();

export const AddressSchema = CML.Data.Tuple([
  PaymentKeyHashSchema,
  StakeKeyHashSchema,
]);
//#endregion

//#region Enum
export type CampaignState = "Initiated" | "Running" | "Cancelled" | "Finished";

type ConstrType = {
  new (index: number, fields: any[]): any;
};

// Create a custom Constr if it's not available
const CustomConstr: ConstrType = class {
  index: number;
  fields: any[];
  
  constructor(index: number, fields: any[]) {
    this.index = index;
    this.fields = fields;
  }
};

// Use the custom Constr or the CML one if available
const Constr = (CML as any).Constr || CustomConstr;

export const CampaignState: Record<
  CampaignState,
  { Title: CampaignState; Schema: any; Constr: any }
> = {
  Initiated: {
    Title: "Initiated",
    Schema: CML.Data.Literal("Initiated"),
    Constr: new Constr(0, []),
  },
  Running: {
    Title: "Running",
    Schema: CML.Data.Literal("Running"),
    Constr: new Constr(1, []),
  },
  Cancelled: {
    Title: "Cancelled",
    Schema: CML.Data.Literal("Cancelled"),
    Constr: new Constr(2, []),
  },
  Finished: {
    Title: "Finished",
    Schema: CML.Data.Literal("Finished"),
    Constr: new Constr(3, []),
  },
};

export const CampaignStateSchema = CML.Data.Enum([
  CampaignState.Initiated.Schema,
  CampaignState.Running.Schema,
  CampaignState.Cancelled.Schema,
  CampaignState.Finished.Schema,
]);

export const CampaignStateRedeemer = {
  Initiated: CML.Data.to(new Constr(0, [])),
  Running: CML.Data.to(new Constr(1, [])),
  Cancelled: CML.Data.to(new Constr(2, [])),
  Finished: CML.Data.to(new Constr(3, [])),
  Released: CML.Data.to(new Constr(4, [])),
};

//#endregion

//#region Datum

export const CampaignDatumSchema = CML.Data.Object({
  name: CML.Data.Bytes(),
  goal: CML.Data.Integer(),
  fraction: CML.Data.Integer(),
});

export type CampaignDatum = any;
export const CampaignDatum = CampaignDatumSchema as unknown as CampaignDatum;

export const BackerDatumSchema = AddressSchema;
export type BackerDatum = any;
export const BackerDatum = BackerDatumSchema as unknown as BackerDatum;

//-----------------------------
export const MultisigSchema = CML.Data.Object({
  required: CML.Data.Integer(),
  signers: CML.Data.Array(CML.Data.Bytes()),
});
export type Multisig = any;
export const Multisig = MultisigSchema as unknown as Multisig;
//-----------------------------------

export const ConfigDatumSchema = CML.Data.Object({
  multisig: MultisigSchema,
  state_token_script: AddressSchema,
  platform: CML.Data.Bytes(),
});

export type ConfigDatum = any;
export const ConfigDatum = ConfigDatumSchema as unknown as ConfigDatum;
//#endregion

//#region Redeemer
export const CampaignActionRedeemer = {
  Support: CML.Data.to(new Constr(0, [])),
  Cancel: CML.Data.to(new Constr(1, [])),
  Finish: CML.Data.to(new Constr(2, [])),
  Refund: CML.Data.to(new Constr(3, [])),
  Release: CML.Data.to(new Constr(4, [])),
};
