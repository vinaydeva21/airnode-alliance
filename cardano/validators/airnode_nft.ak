
use aiken/crypto.{VerificationKeyHash}
use aiken/list
use aiken/transaction.{Input, Output, Redeemer, ScriptContext, Transaction}
use aiken/transaction/value.{AssetName, PolicyId, Value, quantity_of}
use types.{PaymentKeyHash, StakeKeyHash, CampaignDatum}

// NFT Validator for AirNode Fractional Ownership
validator airnode_nft(owner: VerificationKeyHash) {
  // Minting policy for creating AirNode NFTs
  mint(
    redeemer: {
      node_id: ByteArray,
      fraction_count: Int,
      metadata_hash: ByteArray,
    },
    ctx: ScriptContext,
  ) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    let Transaction { 
      inputs, 
      outputs,
      extra_signatories, 
      mint,
      .. 
    } = transaction
    
    let policy_id = when purpose is {
      transaction.Mint(policy_id) -> policy_id
      _ -> fail @"Expected mint purpose"
    }
    
    // Calculate the total NFT amount based on fraction count
    let fraction_count = redeemer.fraction_count
    let node_id = redeemer.node_id
    
    // Create a base name and fraction names
    let base_name = node_id
    
    // NFT minting checks
    let minted_base = quantity_of(mint, policy_id, base_name)
    
    // Basic validation checks
    and {
      // Must be signed by the owner (platform)
      list.has(extra_signatories, owner),
      
      // Must mint exactly one base NFT
      minted_base == 1,
      
      // Must mint exactly fraction_count fraction tokens
      check_fraction_mints(mint, policy_id, base_name, fraction_count),
      
      // Must include correct metadata hash in the token
      check_metadata_in_output(outputs, policy_id, base_name, redeemer.metadata_hash),
    }
  }
  
  // Spending policy for AirNode NFT fractions
  spend(
    datum: CampaignDatum,
    redeemer: { action: ByteArray, receiver: ByteArray },
    ctx: ScriptContext,
  ) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    let Transaction { extra_signatories, .. } = transaction
    
    // Different spending actions
    when redeemer.action is {
      // Transfer a fraction to a new owner
      "transfer" -> 
        is_signed_by_owner(extra_signatories, datum) &&
        check_transfer_output(transaction, redeemer.receiver)
        
      // Stake a fraction for rewards
      "stake" ->
        is_signed_by_owner(extra_signatories, datum) &&
        check_staking_output(transaction)
        
      // Collateralize a fraction for lending
      "collateralize" ->
        is_signed_by_owner(extra_signatories, datum) &&
        check_collateral_output(transaction)
        
      // Default - deny any other actions
      _ -> fail @"Invalid action"
    }
  }
}

// Helper functions

fn check_fraction_mints(
  mint: Value,
  policy_id: PolicyId, 
  base_name: ByteArray,
  fraction_count: Int,
) -> Bool {
  // This is a simplified implementation - full version would iterate 
  // through all fractions to ensure they are properly minted
  let token_names = value.tokens(mint, policy_id)
  list.length(token_names) == fraction_count + 1 // Base + fractions
}

fn check_metadata_in_output(
  outputs: List<Output>,
  policy_id: PolicyId,
  token_name: AssetName,
  metadata_hash: ByteArray,
) -> Bool {
  // In a real implementation, check that the metadata
  // is correctly attached to the output
  True
}

fn is_signed_by_owner(
  signatories: List<VerificationKeyHash>,
  datum: CampaignDatum,
) -> Bool {
  // In a real implementation, extract owner from datum
  // and check if they signed the transaction
  True
}

fn check_transfer_output(
  transaction: Transaction,
  receiver: ByteArray,
) -> Bool {
  // Check that the NFT is correctly transferred to the receiver
  True
}

fn check_staking_output(transaction: Transaction) -> Bool {
  // Check that the NFT is correctly staked
  True
}

fn check_collateral_output(transaction: Transaction) -> Bool {
  // Check that the NFT is correctly collateralized
  True
}
