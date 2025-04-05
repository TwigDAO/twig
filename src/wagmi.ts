// src/wagmi.config.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  zircuitGarfieldTestnet,
  zircuit,
  celo,
  polygon,
  optimism,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Twig",
  projectId: "51c7a03ad29fbe9db19e8dbaa78c877b",
  chains: [mainnet, zircuitGarfieldTestnet, zircuit, celo, polygon, optimism],
});
