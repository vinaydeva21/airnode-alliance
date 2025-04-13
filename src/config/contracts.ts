
// Contract configuration with deployed addresses and ABIs

export const contractConfig = {
  airNodeNFT: {
    address: "0x9e890cd19c35b053893aae48ab92480724240cdf",
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      // ... ABI truncated for brevity 
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "newMetadataURI",
            "type": "string"
          }
        ],
        "name": "updateMetadata",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  airNodeFractionalization: {
    address: "0xd97857b2884c9586a0569801a14b493c23c0235d",
    abi: [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "initialSupply",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      // ... ABI truncated for brevity
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  airNodeMarketplace: {
    address: "0xc7846706e75614927d37eb4432a58559dd222b3e",
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_fractionalizationAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      // ... ABI truncated for brevity
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "withdrawFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }
};
