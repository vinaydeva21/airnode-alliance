
import { toast } from "sonner";
import { bech32 } from "bech32";

// Check if different wallet types are installed
export const checkIfEvmWalletIsInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

export const checkIfCaradanoWalletIsInstalled = (
  walletName: "yoroi" | "lace" | "nami"
): boolean => {
  return typeof window !== 'undefined' && !!window.cardano && !!window.cardano[walletName];
};

// Connect to Cardano wallets
export const connectToCardanoWallet = async (
  walletName: "yoroi" | "lace" | "nami"
) => {
  if (!checkIfCaradanoWalletIsInstalled(walletName)) {
    toast.error(
      `${
        walletName.charAt(0).toUpperCase() + walletName.slice(1)
      } wallet not installed`
    );
    return null;
  }

  try {
    // Safe access to cardano wallet
    if (typeof window === 'undefined' || !window.cardano) {
      throw new Error(`Cardano API not available`);
    }
    
    const cardanoWallet = window.cardano[walletName];
    if (!cardanoWallet) {
      throw new Error(`${walletName} wallet not available`);
    }
    
    const walletApi = await cardanoWallet.enable();
    const addressHex = await walletApi.getChangeAddress();

    const address = hexToBech32(addressHex);
    toast.success(
      `${
        walletName.charAt(0).toUpperCase() + walletName.slice(1)
      } wallet connected`,
      {
        description: `Address: ${address.substring(
          0,
          12
        )}...${address.substring(address.length - 4)}`,
      }
    );

    return {
      account: address,
      chainId: 0, // Use a default chainId for Cardano
      connected: true,
    };
  } catch (error) {
    console.error(
      `${
        walletName.charAt(0).toUpperCase() + walletName.slice(1)
      } connection error:`,
      error
    );
    toast.error(
      `Failed to connect to ${
        walletName.charAt(0).toUpperCase() + walletName.slice(1)
      } wallet`
    );
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
    // Safe access to ethereum object
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("Ethereum object not available");
    }
    
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex as string, 16);

    if (accounts && accounts.length > 0) {
      toast.success("Wallet connected", {
        description: `Address: ${accounts[0].substring(
          0,
          6
        )}...${accounts[0].substring(accounts[0].length - 4)}`,
      });

      return {
        account: accounts[0],
        chainId: chainId,
        connected: true,
      };
    }
    return null;
  } catch (error) {
    console.error("EVM wallet connection error:", error);
    toast.error("Failed to connect to wallet");
    return null;
  }
};

export function hexToBech32(data: string) {
  const bytes: number[] = [];
  for (let i = 0; i < data.length; i += 2) {
    bytes.push(parseInt(data.substring(i, i + 2), 16));
  }
  const words = bech32.toWords(new Uint8Array(bytes));
  const bech32Address = bech32.encode("addr", words, 103);
  return bech32Address;
}
