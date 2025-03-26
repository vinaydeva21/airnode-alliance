
use aiken/crypto.{VerificationKeyHash}

pub type PaymentKeyHash =
  VerificationKeyHash

pub type StakeKeyHash =
  VerificationKeyHash

pub type CampaignDatum {
  name: ByteArray,
  goal: Int,
  fraction: Int,
}

pub type NFTMetadata {
  airnode_id: ByteArray,
  location: ByteArray,
  performance: Performance,
  fractions: Int,
}

pub type Performance {
  uptime: Int,
  earnings: Int,
  roi: Int,
}

pub type NFTFraction {
  id: ByteArray,
  airnode_id: ByteArray,
  owner: VerificationKeyHash,
  listed: Bool,
  list_price: Option<Int>,
  staked: Bool,
  staking_period: Option<Int>,
  collateralized: Bool,
  loan_amount: Option<Int>,
}

pub type MarketplaceListing {
  fraction_id: ByteArray,
  seller: VerificationKeyHash,
  price: Int,
  listing_type: ListingType,
  lease_duration: Option<Int>,
}

pub type ListingType {
  Sale,
  Lease,
}

pub type Reward {
  fraction_id: ByteArray,
  amount: Int,
  timestamp: Int,
  claimed: Bool,
}
