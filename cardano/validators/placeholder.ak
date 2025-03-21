use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions
use types.{CampaignDatum}

validator placeholder {
  mint(redeemer: CampaignDatum, policy_id: PolicyId, tx: Transaction) {
    let Transaction { outputs, .. } = tx
    let CampaignDatum { creator, name, .. } = redeemer

    // let creator_address: Address = functions.address_from_tuple(creator)
    and {
      functions.must_be_signed_by(tx, creator.1st),
      functions.find_script_outputs(outputs, policy_id, name),
      functions.reward_token(tx, policy_id, redeemer),
    }
  }

  spend(
    datum: Option<CampaignDatum>,
    _redeemer,
    o_ref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    expect Some(Input { output: Output { address, .. }, .. }) =
      transaction.find_input(tx.inputs, o_ref)
    expect Script(self_script) = address.payment_credential
    functions.validate_support_campaign(tx, self_script, datum)
  }

  else(_) {
    fail
  }

  // // If needs be, remove any of unneeded handlers above, and use:
  //
  // else(_ctx: ScriptContext) {
  //   todo @"fallback logic if none of the other purposes match"
  // }
  //
  // // You will also need an additional import:
  // //
  // // use cardano/script_context.{ScriptContext}
}
