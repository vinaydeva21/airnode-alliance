use aiken/crypto.{VerificationKeyHash}

pub type PaymentKeyHash =
  VerificationKeyHash

pub type StakeKeyHash =
  VerificationKeyHash

pub type CampaignDatum {
  name: ByteArray,
  goal: Int,
  creator: (PaymentKeyHash, StakeKeyHash),
  fraction: Int,
}
