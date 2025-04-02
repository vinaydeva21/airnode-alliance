use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions
use types.{MarketplaceDatum}

validator marketplace {
  spend(
    datum: Option<MarketplaceDatum>,
    _redeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { inputs, outputs, .. } = tx
    expect Some(script_input) = transaction.find_input(inputs, oref)
    expect Script(self_script) = script_input.output.address.payment_credential
    let (pid, tkn, qty) = functions.input_token(script_input)
    functions.validate_token_outputs(tx, self_script, pid, datum, qty, tkn)
  }

  else(_) {
    fail
  }
}
