import * as naj from "near-api-js";

export const getNearConfig = (): naj.ConnectConfig => {
  const keyStore = new naj.keyStores.InMemoryKeyStore();

  return {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    keyStore,
    headers: {},
  };
};
