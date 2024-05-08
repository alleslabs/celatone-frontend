import { useCelatoneApp } from "../contexts";

import { useCurrentChain } from "./useCurrentChain";

export const useRpcEndpoint = () => {
  const { chainWallet } = useCurrentChain();
  const { chainConfig } = useCelatoneApp();
  const rpcRecord = chainWallet?.chainRecord.preferredEndpoints?.rpc?.[0];
  const endpoint = typeof rpcRecord === "string" ? rpcRecord : rpcRecord?.url;

  return endpoint ?? chainConfig.rpc;
};
