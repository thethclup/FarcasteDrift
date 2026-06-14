// @ts-nocheck
import { AgentKit, CdpWalletProvider, wethActionProvider, walletActionProvider, erc20ActionProvider, cdpApiActionProvider, cdpWalletActionProvider, pythActionProvider } from "@coinbase/agentkit";

/**
 * Initializes the Coinbase AgentKit for the Base MCP server.
 * 
 * Prerequisites:
 * 1. npm install @coinbase/agentkit @coinbase/agentkit-model-context-protocol
 * 2. Set CDP_API_KEY_NAME, CDP_API_KEY_PRIVATE_KEY, and NETWORK_ID in your .env
 */
export async function initializeAgent() {
  try {
    // Initialize CDP Wallet Provider
    const walletProvider = await CdpWalletProvider.configureWithWallet({
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      networkId: process.env.NETWORK_ID || "base-sepolia",
    });

    // Initialize AgentKit with action providers
    const agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider(),
        cdpWalletActionProvider(),
      ],
    });

    console.log("Coinbase AgentKit initialized successfully.");
    return agentKit;
  } catch (error) {
    console.error("Failed to initialize AgentKit:", error);
    throw error;
  }
}
