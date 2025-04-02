use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions

validator marketplace {
  spend(_datum, _redeemer, _oref, tx: Transaction) {
    let tx_inputs = tx.inputs
    True
  }

  else(_) {
    False
  }
}
