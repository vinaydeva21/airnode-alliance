use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions
use types.{MinterDatum}

validator airnode_minter(owner: VerificationKeyHash) {
  mint(redeemer: MinterDatum, policyid: PolicyId, tx: Transaction) {
    let Transaction { outputs, .. } = tx
    let MinterDatum { name, fraction, .. } = redeemer

    // let creator_address: Address = functions.address_from_tuple(creator)
    and {
      functions.must_be_signed_by(tx, owner),
      functions.find_script_outputs(outputs, policyid, name, fraction),
      functions.node_token_mint(tx, policyid, redeemer),
    }
  }

  spend(_datum, _redeemer, o_ref: OutputReference, tx: Transaction) {
    expect Some(Input { output: Output { address, .. }, .. }) =
      transaction.find_input(tx.inputs, o_ref)
    expect Script(self_script) = address.payment_credential
    // functions.validate_support_campaign(tx, self_script, datum)
    True
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
