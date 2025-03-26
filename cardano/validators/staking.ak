
use aiken/crypto.{VerificationKeyHash}
use aiken/list
use aiken/transaction.{Input, Output, Redeemer, ScriptContext, Transaction}
use aiken/transaction/value.{AssetName, PolicyId, Value, quantity_of}
use types.{CampaignDatum}

type StakingDatum {
  owner: VerificationKeyHash,
  nft_policy_id: PolicyId,
  nft_name: AssetName,
  staking_start_time: Int,
  duration_seconds: Int,
  rewards_claimed: Int,
}

validator staking(platform_key: VerificationKeyHash, reward_policy: PolicyId) {
  spend(
    datum: StakingDatum,
    redeemer: { action: ByteArray },
    ctx: ScriptContext,
  ) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    let Transaction { 
      inputs, 
      outputs, 
      extra_signatories,
      validity_range,
      ..
    } = transaction
    
    when redeemer.action is {
      // Stake an NFT fraction
      "stake" -> 
        check_stake_conditions(datum, transaction) 
        
      // Claim rewards
      "claim" ->
        (
          list.has(extra_signatories, datum.owner) ||
          list.has(extra_signatories, platform_key)
        ) &&
        check_reward_calculation(datum, transaction, validity_range.lower_bound.time)
        
      // Unstake (withdraw) an NFT fraction
      "unstake" ->
        list.has(extra_signatories, datum.owner) &&
        check_unstake_conditions(datum, transaction, validity_range.lower_bound.time)
        
      // Default - deny any other actions
      _ -> fail @"Invalid staking action"
    }
  }
}

fn check_stake_conditions(datum: StakingDatum, tx: Transaction) -> Bool {
  // Check that the NFT is locked in the staking contract with correct datum
  True
}

fn check_reward_calculation(
  datum: StakingDatum, 
  tx: Transaction, 
  current_time: Int
) -> Bool {
  // Calculate rewards based on staking duration and rate
  // Check that the correct amount is minted and sent to the owner
  let staking_duration = calculate_duration(datum.staking_start_time, current_time)
  let rewards_due = calculate_rewards(staking_duration, datum.nft_name)
  let claimed_amount = rewards_due - datum.rewards_claimed
  
  // In a real implementation, verify that exactly this amount is minted
  // and transferred to the owner
  True
}

fn check_unstake_conditions(
  datum: StakingDatum, 
  tx: Transaction,
  current_time: Int
) -> Bool {
  // Check if minimum staking period has passed
  let staking_end_time = datum.staking_start_time + datum.duration_seconds
  
  if current_time >= staking_end_time {
    // Full term completed - check NFT is returned to owner with final rewards
    check_reward_calculation(datum, tx, current_time)
  } else {
    // Early unstaking - check for penalty application
    check_early_unstake_penalty(datum, tx, current_time)
  }
}

fn calculate_duration(start_time: Int, current_time: Int) -> Int {
  // Calculate duration in seconds, with a minimum of 0
  if current_time > start_time {
    current_time - start_time
  } else {
    0
  }
}

fn calculate_rewards(duration: Int, nft_name: AssetName) -> Int {
  // In a real implementation, this would use the NFT traits to calculate rewards
  // This is a simplified placeholder
  duration / 86400 * 100 // 100 tokens per day
}

fn check_early_unstake_penalty(
  datum: StakingDatum, 
  tx: Transaction,
  current_time: Int
) -> Bool {
  // Apply a penalty for unstaking early
  // Typically a percentage of accumulated rewards
  True
}
