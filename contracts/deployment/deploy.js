// Deployment script for AirNode contracts
// Run with: npx hardhat run scripts/deploy.js --network sepolia

const { ethers } = require("hardhat");

async function main() {
  console.log("Starting AirNode contracts deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy AirNodeNFT contract
  console.log("\n1. Deploying AirNodeNFT contract...");
  const AirNodeNFT = await ethers.getContractFactory("AirNodeNFT");
  const airNodeNFT = await AirNodeNFT.deploy();
  await airNodeNFT.deployed();
  console.log("AirNodeNFT deployed to:", airNodeNFT.address);

  // Deploy AirNodeFractionalization contract
  console.log("\n2. Deploying AirNodeFractionalization contract...");
  const AirNodeFractionalization = await ethers.getContractFactory("AirNodeFractionalization");
  const fractionalization = await AirNodeFractionalization.deploy(airNodeNFT.address);
  await fractionalization.deployed();
  console.log("AirNodeFractionalization deployed to:", fractionalization.address);

  // Deploy AirNodeMarketplace contract
  console.log("\n3. Deploying AirNodeMarketplace contract...");
  const AirNodeMarketplace = await ethers.getContractFactory("AirNodeMarketplace");
  const marketplace = await AirNodeMarketplace.deploy(fractionalization.address);
  await marketplace.deployed();
  console.log("AirNodeMarketplace deployed to:", marketplace.address);

  // Verify contracts on Etherscan (optional)
  console.log("\n4. Contract deployment summary:");
  console.log("================================");
  console.log("AirNodeNFT:", airNodeNFT.address);
  console.log("AirNodeFractionalization:", fractionalization.address);
  console.log("AirNodeMarketplace:", marketplace.address);
  
  console.log("\n5. Update your frontend config with these addresses:");
  console.log(`
export const contractAddresses = {
  sepolia: {
    airNodeNFT: "${airNodeNFT.address}",
    fractionalization: "${fractionalization.address}",
    marketplace: "${marketplace.address}",
  },
};
  `);

  // Save deployment info to file
  const fs = require('fs');
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      airNodeNFT: airNodeNFT.address,
      fractionalization: fractionalization.address,
      marketplace: marketplace.address,
    },
    deployer: deployer.address,
  };
  
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });