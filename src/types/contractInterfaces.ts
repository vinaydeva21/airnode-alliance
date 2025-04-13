
// Contract interface types for AirNode contracts

export interface AirNodeNFTContract {
  mintAirNode: (
    to: string,
    airNodeId: string,
    location: string,
    uptime: number,
    earnings: number,
    roi: number,
    totalFractions: number,
    metadataURI: string
  ) => Promise<{
    tokenId: number;
    transactionHash: string;
  }>;
  
  updateMetadata: (
    tokenId: number,
    newMetadataURI: string
  ) => Promise<{
    transactionHash: string;
  }>;
  
  getAirNodeMetadata: (
    tokenId: number
  ) => Promise<{
    airNodeId: string;
    location: string;
    uptime: number;
    earnings: number;
    roi: number;
    fractionalized: boolean;
    totalFractions: number;
  }>;
}

export interface AirNodeFractionalizationContract {
  fractionalizeNFT: (
    nftId: number,
    fractionCount: number,
    pricePerFraction: number
  ) => Promise<{
    fractionId: string;
    transactionHash: string;
  }>;
  
  setPricePerFraction: (
    fractionId: string,
    newPrice: number
  ) => Promise<{
    transactionHash: string;
  }>;
  
  listFractions: (
    fractionId: string,
    isListed: boolean
  ) => Promise<{
    transactionHash: string;
  }>;
  
  getAllFractionIds: () => Promise<string[]>;
  
  getFractionDetails: (
    fractionId: string
  ) => Promise<{
    nftId: number;
    fractionToken: string;
    totalFractions: number;
    availableFractions: number;
    pricePerFraction: number;
    isListed: boolean;
  }>;
}

export interface AirNodeMarketplaceContract {
  listFractionForSale: (
    fractionId: string,
    price: number,
    quantity: number
  ) => Promise<{
    listingId: number;
    transactionHash: string;
  }>;
  
  buyFractions: (
    listingId: number,
    quantity: number,
    value: number
  ) => Promise<{
    transactionHash: string;
  }>;
  
  cancelListing: (
    listingId: number
  ) => Promise<{
    transactionHash: string;
  }>;
  
  getActiveListingsCount: () => Promise<number>;
  
  getAllListings: () => Promise<{
    fractionId: string;
    seller: string;
    price: number;
    quantity: number;
    listingTime: number;
    isActive: boolean;
  }[]>;
}

export interface DeployedContracts {
  airNodeNFT: {
    address: string;
    abi: any[];
  };
  airNodeFractionalization: {
    address: string;
    abi: any[];
  };
  airNodeMarketplace: {
    address: string;
    abi: any[];
  };
}
