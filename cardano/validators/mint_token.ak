use cardano/address.{Address, Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, OutputReference, Transaction}
use functions

validator placeholder {
  mint(_redeemer, _policy_id, _tx) {
    True
  }

  spend(_datum, _redeemer, _o_ref, _tx) {
    True
  }

  else(_) {
    True
  }
}
