
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Use default project ID
}) => {
  // Define all chains we want to support
  const chains = [mainnet, polygon, optimism, arbitrum];
  
  // Get connectors for wallets from RainbowKit
  const { connectors } = getDefaultWallets({
    projectId,
    appName: 'AirNode Alliance',
    // In RainbowKit v2, chains is no longer directly passed here
  });

  // Create wagmi config
  const wagmiConfig = createConfig({
    // In wagmi v2, chains are specified per transport
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
    },
    connectors
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
