
import { toast } from 'sonner';

// Check if different wallet types are installed
export const checkIfEvmWalletIsInstalled = (): boolean => {
  return window.ethereum !== undefined;
};

export const checkIfYoroiIsInstalled = (): boolean => {
  return window.cardano && window.cardano.yoroi !== undefined;
};

// Connect to Cardano wallets
export const connectToYoroi = async () => {
  if (!checkIfYoroiIsInstalled()) {
    toast.error("Yoroi wallet not installed");
    return null;
  }
  
  try {
    const yoroiAPI = await window.cardano.yoroi.enable();
    const address = await yoroiAPI.getChangeAddress();
    const addressHex = Buffer.from(address, 'hex').toString('hex');
    
    toast.success("Yoroi wallet connected", {
      description: `Address: ${addressHex.substring(0, 6)}...${addressHex.substring(addressHex.length - 4)}`
    });
    
    return {
      account: addressHex,
      chainId: null,
      connected: true
    };
  } catch (error) {
    console.error('Yoroi connection error:', error);
    toast.error("Failed to connect to Yoroi wallet");
    return null;
  }
};

// Connect to EVM wallet (MetaMask or similar)
export const connectToEvmWallet = async () => {
  if (!checkIfEvmWalletIsInstalled()) {
    toast.error("Please install MetaMask or another web3 wallet");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const chainIdHex = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    const chainId = parseInt(chainIdHex, 16);

    if (accounts.length > 0) {
      toast.success("Wallet connected", {
        description: `Address: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`
      });
      
      return {
        account: accounts[0],
        chainId: chainId,
        connected: true
      };
    }
    return null;
  } catch (error) {
    console.error('EVM wallet connection error:', error);
    toast.error("Failed to connect to wallet");
    return null;
  }
};
