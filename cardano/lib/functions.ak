use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address.{Address, Inline, Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{Output, Transaction}
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
  (assets.quantity_of(o.value, script_hash, name) == fractions)?
}

pub fn validate_support_campaign(
  tx: Transaction,
  self_script: PolicyId,
  datum: MinterDatum,
) {
  let Transaction { outputs, .. } = tx
  let MinterDatum { name, goal, fraction } = datum
  let fraction_amount = goal / fraction

  let (backer_reward_token, script_reward_token) =
    find_output_from_PID(outputs, self_script, name)

  let (backer_amount, script_token) =
    find_output_from_addr(outputs, self_script, name)

  and {
    script_reward_token == script_token,
    backer_amount / fraction_amount == backer_reward_token,
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

  expect Some(supporter_output) = list.at(token_output, 0)
  let script_token =
    when list.at(token_output, 1) is {
      Some(script_output) ->
        assets.quantity_of(script_output.value, policy_id, name)
      None -> 0
    }
  let reward_token_to_backer =
    assets.quantity_of(supporter_output.value, policy_id, name)
  // let script_token = assets.quantity_of(script_output.value, policy_id, name)
  (reward_token_to_backer, script_token)
}

pub fn find_output_from_addr(
  outputs: List<Output>,
  self_script: PolicyId,
  name: ByteArray,
) {
  let address = Address(Script(self_script), None)
  expect [script_output,
    backers_amount_output] =
    list.filter(outputs, fn(output) { output.address == address })
  let script_token = assets.quantity_of(script_output.value, self_script, name)
  (assets.lovelace_of(backers_amount_output.value), script_token)
}
