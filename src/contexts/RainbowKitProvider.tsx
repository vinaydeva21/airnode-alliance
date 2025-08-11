
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { defineChain } from 'viem';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

// Define World Mobile Chain Testnet as a custom chain
const wmcTestnet = defineChain({
  id: 323432,
  name: 'World Mobile Chain Testnet',
  nativeCurrency: { name: 'WOMOX', symbol: 'WOMOX', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://worldmobile-testnet.g.alchemy.com/v2/DzZUBKUFFmr_PE7VxyaRMlAZGUujAfyB'],
    },
  },
  testnet: true,
});

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Reown WalletConnect Project ID
}) => {
  // Define all chains we want to support as a readonly array, with WMC testnet as the first/default
  const chains = [wmcTestnet, sepolia, mainnet, polygon, optimism, arbitrum] as const;
  
  // Get connectors for wallets from RainbowKit - in v2 syntax
  const { connectors } = getDefaultWallets({
    projectId,
    appName: 'Airnode Alliance',
  });

  // Create wagmi config - in v2 we need to include chains as a readonly array
  const wagmiConfig = createConfig({
    chains,
    transports: {
      [wmcTestnet.id]: http('https://worldmobile-testnet.g.alchemy.com/v2/DzZUBKUFFmr_PE7VxyaRMlAZGUujAfyB'),
      [sepolia.id]: http(),
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
    },
    connectors
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider 
        initialChain={wmcTestnet}
        appInfo={{
          appName: 'Airnode Alliance',
          learnMoreUrl: 'https://www.airnodealliance.com/',
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
