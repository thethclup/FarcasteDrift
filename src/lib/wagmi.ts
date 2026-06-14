import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: 'Farcaster Drift' }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
});
