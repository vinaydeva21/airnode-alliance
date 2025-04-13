
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
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "airNodeId",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          }
        ],
        "name": "AirNodeMinted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approved",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "airNodeId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "uptime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "earnings",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "roi",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalFractions",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          }
        ],
        "name": "mintAirNode",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getAirNodeMetadata",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "airNodeId",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "location",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "uptime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "earnings",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "roi",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "fractionalized",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "totalFractions",
                "type": "uint256"
              }
            ],
            "internalType": "struct AirNodeNFT.AirNodeMetadata",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
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
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "markFractionalized",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "safeTransferFrom",
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
            "internalType": "address",
            "name": "_airNodeNFTAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "nftId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "fractionToken",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalFractions",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "pricePerFraction",
            "type": "uint256"
          }
        ],
        "name": "NFTFractionalized",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "nftId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fractionCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pricePerFraction",
            "type": "uint256"
          }
        ],
        "name": "fractionalizeNFT",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllFractionIds",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          }
        ],
        "name": "getFractionDetails",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "nftId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "fractionToken",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "totalFractions",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "availableFractions",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "pricePerFraction",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isListed",
                "type": "bool"
              }
            ],
            "internalType": "struct AirNodeFractionalization.FractionDetails",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isListed",
            "type": "bool"
          }
        ],
        "name": "listFractions",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "newPrice",
            "type": "uint256"
          }
        ],
        "name": "setPricePerFraction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
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
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "listingId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "FractionListed",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "fractionId",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "listFractionForSale",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "listingId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          }
        ],
        "name": "buyFractions",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "listingId",
            "type": "uint256"
          }
        ],
        "name": "cancelListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllListings",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "fractionId",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "seller",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "listingTime",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              }
            ],
            "internalType": "struct AirNodeMarketplace.Listing[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
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
