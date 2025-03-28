
// Ethereum network configuration
export const ETHEREUM_NETWORK = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || 'sepolia';
export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY || '';
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || '';

// Contract addresses
export const NFT_CONTRACT_ADDRESS = "0xd8b927cf2a1628c087383274bff3b2a011ebaa04";
export const MARKETPLACE_CONTRACT_ADDRESS = "0x04dfdc0a81b9aedeb2780ee1ba4723c88fb57ace";
export const TOKEN_CONTRACT_ADDRESS = "0xc2fdc83aea820f75dc1e89e8c92c3d451d90fca9";

// Define the provider URL based on network
export const getProviderUrl = () => {
  if (INFURA_KEY) {
    return `https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_KEY}`;
  } else if (ALCHEMY_KEY) {
    return `https://eth-${ETHEREUM_NETWORK}.alchemyapi.io/v2/${ALCHEMY_KEY}`;
  }
  // Fallback to public RPC
  return `https://${ETHEREUM_NETWORK}.ethereum.io`;
};
