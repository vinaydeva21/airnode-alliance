
// We're creating simplified type definitions to avoid CML.Data usage
// These will be compatible with the rest of the codebase while avoiding build errors

//#region Alias
export type PaymentKeyHash = string;
export type StakeKeyHash = string;

export type Address = [PaymentKeyHash, StakeKeyHash];
//#endregion

//#region Enum
export type CampaignState = "Initiated" | "Running" | "Cancelled" | "Finished";

type ConstrType = {
  new (index: number, fields: any[]): any;
};

// Create a custom Constr implementation
const CustomConstr: ConstrType = class {
  index: number;
  fields: any[];
  
  constructor(index: number, fields: any[]) {
    this.index = index;
    this.fields = fields;
  }
};

// Use our custom constructor
const Constr = CustomConstr;

export const CampaignState: Record<
  CampaignState,
  { Title: CampaignState; Schema: any; Constr: any }
> = {
  Initiated: {
    Title: "Initiated",
    Schema: "Initiated",
    Constr: new Constr(0, []),
  },
  Running: {
    Title: "Running",
    Schema: "Running",
    Constr: new Constr(1, []),
  },
  Cancelled: {
    Title: "Cancelled",
    Schema: "Cancelled",
    Constr: new Constr(2, []),
  },
  Finished: {
    Title: "Finished",
    Schema: "Finished",
    Constr: new Constr(3, []),
  },
};

// Simple mock implementation for the schema
export const CampaignStateSchema = {
  type: "Enum",
  items: [
    CampaignState.Initiated.Schema,
    CampaignState.Running.Schema,
    CampaignState.Cancelled.Schema,
    CampaignState.Finished.Schema,
  ]
};

// Simple mock implementation
export const CampaignStateRedeemer = {
  Initiated: { index: 0, fields: [] },
  Running: { index: 1, fields: [] },
  Cancelled: { index: 2, fields: [] },
  Finished: { index: 3, fields: [] },
  Released: { index: 4, fields: [] },
};

//#endregion

//#region Datum
// Define simplified schemas that don't depend on CML
export type CampaignDatum = {
  name: string;
  goal: number;
  fraction: number;
};

export const CampaignDatumSchema = {
  type: "Object",
  properties: {
    name: { type: "Bytes" },
    goal: { type: "Integer" },
    fraction: { type: "Integer" },
  }
};

export const BackerDatumSchema = {
  type: "Tuple",
  items: [{ type: "Bytes" }, { type: "Bytes" }]
};

export type BackerDatum = any;

// Multisig schema
export type Multisig = {
  required: number;
  signers: string[];
};

export const MultisigSchema = {
  type: "Object",
  properties: {
    required: { type: "Integer" },
    signers: { type: "Array", items: { type: "Bytes" } },
  }
};

export type ConfigDatum = {
  multisig: Multisig;
  state_token_script: Address;
  platform: string;
};

export const ConfigDatumSchema = {
  type: "Object",
  properties: {
    multisig: MultisigSchema,
    state_token_script: BackerDatumSchema,
    platform: { type: "Bytes" },
  }
};

//#endregion

//#region Redeemer
export const CampaignActionRedeemer = {
  Support: { index: 0, fields: [] },
  Cancel: { index: 1, fields: [] },
  Finish: { index: 2, fields: [] },
  Refund: { index: 3, fields: [] },
  Release: { index: 4, fields: [] },
};
