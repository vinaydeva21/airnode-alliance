use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address.{Address, Inline, Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{Input, Output, Transaction}
use types.{MinterDatum, PaymentKeyHash, StakeKeyHash}

pub fn must_be_signed_by(tx: Transaction, signer: VerificationKeyHash) -> Bool {
  // just expect 1 signer
  [signer] == tx.extra_signatories
}

pub fn must_send_to_script(outputs: List<Output>, addr: Address) {
  expect Some(address) = list.find(outputs, fn(o) { o.address == addr })
  address.address == addr
}

pub fn node_token_mint(
  tx: Transaction,
  self_script: PolicyId,
  datum: MinterDatum,
) -> Bool {
  let MinterDatum { name, fraction, .. } = datum
  let minted_tokens = tx.mint |> assets.tokens(self_script) |> dict.to_pairs()
  ([Pair(name, fraction)] == minted_tokens)?
}

pub fn address_from_tuple(
  key_hash_tuple: (PaymentKeyHash, StakeKeyHash),
) -> Address {
  let (pkh, skh) = key_hash_tuple
  Address {
    payment_credential: pkh |> VerificationKey,
    stake_credential: if skh == "" {
      None
    } else {
      skh |> VerificationKey |> Inline |> Some
    },
  }
}

pub fn output_by_addr(outputs: List<Output>, addr: Address) -> Output {
  when outputs is {
    [output, ..rest] ->
      if output.address == addr {
        output
      } else {
        output_by_addr(rest, addr)
      }
    [] -> fail @"No Output Found By Address"
  }
}

pub fn find_script_outputs(
  outputs: List<Output>,
  script_hash: ScriptHash,
  name: ByteArray,
  fractions: Int,
) {
  expect [o] =
    outputs
      |> list.filter(
          fn(output) {
            when output.address.payment_credential is {
              Script(addr_script_hash) -> script_hash == addr_script_hash
              VerificationKey(_) -> False
            }
          },
        )
  trace @"output": assets.quantity_of(o.value, script_hash, name)
  trace @"fraction and name": fractions, name
  (assets.quantity_of(o.value, script_hash, name) == fractions)?
}

pub fn must_send_to_marketplace(
  input: Input,
  outputs: List<Output>,
  marketplace_hash: ScriptHash,
  pid: PolicyId,
  name: ByteArray,
  fractions: Int,
) {
  expect [o] =
    outputs
      |> list.filter(
          fn(output) {
            when output.address.payment_credential is {
              Script(addr_script_hash) -> marketplace_hash == addr_script_hash
              VerificationKey(_) -> False
            }
          },
        )
  trace @"output": assets.quantity_of(o.value, marketplace_hash, name)
  trace @"fraction and name": fractions, name
  (assets.quantity_of(o.value, pid, name) == fractions)?
}

pub fn validate_token_outputs(
  tx: Transaction,
  self_script: PolicyId,
  datum: MinterDatum,
  available_tokens: Int,
  tkn: ByteArray,
) {
  let Transaction { outputs, .. } = tx
  let MinterDatum { name, price, fraction } = datum
  let (buyer_token_qty, script_token_qty) =
    find_output_from_PID(outputs, self_script, name)

  let lovelace = find_script_output_lovelace(outputs, self_script, name)
  //   and {
  //     script_reward_token == script_token,
  //     backer_amount / price == backer_reward_token,
  //   }
  and {
    (tkn == name)?,
    (available_tokens == buyer_token_qty + script_token_qty)?,
    (lovelace >= price * buyer_token_qty)?,
  }
}

pub fn find_output_from_PID(
  outputs: List<Output>,
  policy_id: PolicyId,
  name: ByteArray,
) {
  let token_output: List<Output> =
    list.filter(
      outputs,
      fn(output) {
        let has_reward_token = output.value |> assets.tokens(policy_id)
        !dict.is_empty(has_reward_token)
      },
    )

  expect Some(buyer_output) = list.at(token_output, 0)
  let script_token_qty =
    when list.at(token_output, 1) is {
      Some(script_output) ->
        assets.quantity_of(script_output.value, policy_id, name)
      None -> 0
    }
  let buyer_token_qty = assets.quantity_of(buyer_output.value, policy_id, name)
  (buyer_token_qty, script_token_qty)
}

pub fn find_script_output_lovelace(
  outputs: List<Output>,
  self_script: ScriptHash,
  name: ByteArray,
) {
  let address = Address(Script(self_script), None)
  expect [script_output] = transaction.find_script_outputs(outputs, self_script)
  assets.lovelace_of(script_output.value)
}

pub fn input_token(input: Input) {
  expect [(pid, tkn, qty)] = assets.flatten(input.output.value)
  (pid, tkn, qty)
}
