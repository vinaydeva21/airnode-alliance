
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { defineChain } from 'viem';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

// Use Base network
import { base } from 'wagmi/chains';

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Reown WalletConnect Project ID
}) => {
  // Define all chains we want to support as a readonly array, with Base as the first/default
  const chains = [base, sepolia, mainnet, polygon, optimism, arbitrum] as const;
  
  // Get connectors for wallets from RainbowKit - in v2 syntax
  const { connectors } = getDefaultWallets({
    projectId,
    appName: 'Airnode Alliance',
  });

  // Create wagmi config - in v2 we need to include chains as a readonly array
  const wagmiConfig = createConfig({
    chains,
    transports: {
      [base.id]: http(),
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
        initialChain={base}
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
