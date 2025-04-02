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
    let Transaction { inputs, outputs, .. } = tx
    expect Some(script_input) = transaction.find_input(inputs, oref)
    let (pid, tkn, qty) = functions.input_token(script_input)
    True
  }

  else(_) {
    fail
  }
}
