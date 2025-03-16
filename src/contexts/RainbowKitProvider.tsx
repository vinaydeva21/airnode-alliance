
import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Use default project ID
}) => {
  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()]
  );
  
  const { wallets } = getDefaultWallets({
    appName: 'AirNode Alliance',
    projectId,
    chains
  });
  
  const connectors = connectorsForWallets([
    ...wallets,
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
