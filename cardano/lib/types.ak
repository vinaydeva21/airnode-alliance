use aiken/crypto.{VerificationKeyHash}

pub type PaymentKeyHash =
  VerificationKeyHash

pub type StakeKeyHash =
  VerificationKeyHash

pub type MinterDatum {
  name: ByteArray,
  price: Int,
  fraction: Int,
}

pub type MarketplaceDatum =
  MinterDatum
