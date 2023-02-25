import * as naj from "near-api-js";
import config from "./config";

export const getNearConfig = (): naj.ConnectConfig => {
  const keyStore = new naj.keyStores.InMemoryKeyStore();

  return {
    networkId: "mainnet",
    nodeUrl: config.nodeUrl,
    walletUrl: "https://wallet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    keyStore,
    headers: {},
  };
};
