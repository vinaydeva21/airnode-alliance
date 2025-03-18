import { toast } from "sonner";
import { bech32 } from "bech32";
// Check if different wallet types are installed
export const checkIfEvmWalletIsInstalled = (): boolean => {
  return window.ethereum !== undefined;
};

export const checkIfCaradanoWalletIsInstalled = (
  walletName: "yoroi" | "lace"
): boolean => {
  return window.cardano && window.cardano[walletName] !== undefined;
};

// Connect to Cardano wallets
export const connectToCardanoWallet = async (walletName: "yoroi" | "lace") => {
  if (!checkIfCaradanoWalletIsInstalled(walletName)) {
    toast.error(
      `${
        walletName.charAt(0).toUpperCase() + walletName.slice(1)
      } wallet not installed`
    );
    return null;
  }

  try {
    const walletApi = await window.cardano[walletName].enable();
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
      chainId: null,
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
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex, 16);

    if (accounts.length > 0) {
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
  const bytes = [];
  for (let i = 0; i < data.length; i += 2) {
    bytes.push(parseInt(data.substring(i, i + 2), 16));
  }
  const words = bech32.toWords(bytes);
  const bech32Address = bech32.encode("addr", words, 103);
  return bech32Address;
}
