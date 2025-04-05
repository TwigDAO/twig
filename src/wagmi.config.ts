// src/wagmi.config.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Crypto AI Assistant",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
  chains: [mainnet, polygon, optimism],
});
