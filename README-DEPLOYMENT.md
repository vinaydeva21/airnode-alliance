# AirNode Smart Contracts Deployment Guide

## Updated Smart Contracts

All smart contracts have been updated to be error-free and compatible with OpenZeppelin v5.x:

### 1. AirNodeNFT.sol ✅
- Removed deprecated `Counters` library
- Fixed `_exists()` function implementation
- Added proper input validation and error handling
- Added new functions: `setActiveStatus()`, `updatePerformance()`
- Enhanced security with ReentrancyGuard

### 2. AirNodeFractionalization.sol ✅
- Complete rewrite with proper error handling
- Improved fractionalization logic
- Dynamic ERC20 token creation for each fraction
- Better price and listing management
- Enhanced view functions for marketplace integration

### 3. AirNodeMarketplace.sol ✅
- Fixed token transfer logic with proper ERC20 approval handling
- Added comprehensive listing management
- Implemented platform fee system
- Enhanced user balance tracking
- Added emergency pause functionality

## Deployment Steps

### Prerequisites
1. Install Hardhat: `npm install --save-dev hardhat`
2. Configure `hardhat.config.js` with your network settings
3. Set up environment variables for private keys and API keys

### Deploy Contracts
1. Place the updated contracts in `contracts/` folder
2. Run deployment script:
   ```bash
   npx hardhat run contracts/deployment/deploy.js --network sepolia
   ```

### Update Frontend Configuration
After deployment, update the contract addresses in:
- `src/config/contracts.ts`
- Replace the placeholder addresses with deployed addresses

Example:
```typescript
export const contractAddresses = {
  sepolia: {
    airNodeNFT: "0xYourDeployedNFTAddress",
    fractionalization: "0xYourDeployedFractionalizationAddress",
    marketplace: "0xYourDeployedMarketplaceAddress",
  },
};
```

## Testing the Integration

### 1. Admin Functions (Minting)
- Connect with admin wallet
- Navigate to Admin panel
- Use the minting interface to create new AirNode NFTs

### 2. Fractionalization
- Go to the Admin fractionalization tab
- Select an NFT to fractionalize
- Set fraction count and price per fraction

### 3. Marketplace
- Navigate to Marketplace
- View listed fractions
- Purchase fractions with connected wallet

## Key Features Implemented

### ✅ NFT Minting
- Admin can mint AirNode NFTs with metadata
- Supports location, performance metrics, and pricing

### ✅ Fractionalization
- Convert NFTs into tradeable ERC20 tokens
- Dynamic token creation per fraction
- Price and listing management

### ✅ Marketplace
- Buy/sell fractionalized tokens
- Platform fee system (2.5% default)
- User balance tracking
- Listing management

### ✅ Enhanced Security
- ReentrancyGuard protection
- Proper access controls
- Input validation
- Error handling

## Contract Verification
After deployment, verify contracts on Etherscan:
```bash
npx hardhat verify --network sepolia <contract-address> <constructor-args>
```

## Frontend Integration
The updated hooks and contracts provide:
- Real-time marketplace data
- Enhanced error handling
- Better user experience
- Admin functionality for NFT management

## Support
If you encounter any issues during deployment or integration, the contracts are now designed to provide clear error messages for easier debugging.