use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions
use types.{MinterDatum}

validator airnode_minter(owner: VerificationKeyHash, marketplace: ScriptHash) {
  mint(redeemer: MinterDatum, policyid: PolicyId, tx: Transaction) {
    let Transaction { outputs, .. } = tx
    let MinterDatum { name, fraction, .. } = redeemer

    and {
      functions.must_be_signed_by(tx, owner)?,
      functions.find_script_outputs(outputs, policyid, name, fraction)?,
      functions.node_token_mint(tx, policyid, redeemer)?,
    }
  }

  spend(
    datum: Option<MinterDatum>,
    redeemer: Int,
    o_ref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let MinterDatum { name, fraction, .. } = datum
    expect Some(script_input) = transaction.find_input(tx.inputs, o_ref)
    expect Script(self_script) = script_input.output.address.payment_credential
    // functions.validate_support_campaign(tx, self_script, datum)
    and {
      functions.must_be_signed_by(tx, owner)?,
      functions.must_send_to_marketplace(
        script_input,
        tx.outputs,
        marketplace,
        self_script,
        name,
        redeemer,
      )?,
    }
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
