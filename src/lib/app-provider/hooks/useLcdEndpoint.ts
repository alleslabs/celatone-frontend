import { useCelatoneApp } from "../contexts";

import { useCurrentChain } from "./useCurrentChain";

export const useLcdEndpoint = () => {
  const { chainWallet } = useCurrentChain();
  const { chainConfig } = useCelatoneApp();
  const restRecord = chainWallet?.chainRecord.preferredEndpoints?.rest?.[0];
  const endpoint =
    typeof restRecord === "string" ? restRecord : restRecord?.url;

  return endpoint ?? chainConfig.lcd;
};
