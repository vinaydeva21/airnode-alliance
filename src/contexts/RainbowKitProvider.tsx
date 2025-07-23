
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Use default project ID
}) => {
  // Define all chains we want to support as a readonly array, with Sepolia as the first/default
  const chains = [sepolia, mainnet, polygon, optimism, arbitrum] as const;
  
  // Get connectors for wallets from RainbowKit - in v2 syntax
  const { connectors } = getDefaultWallets({
    projectId,
    appName: 'Airnode Alliance',
  });

  // Create wagmi config - in v2 we need to include chains as a readonly array
  const wagmiConfig = createConfig({
    chains,
    transports: {
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
      <RainbowKitProvider initialChain={sepolia}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
