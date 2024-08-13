import { useChainConfigs } from "lib/app-provider";
import { useNetworkStore } from "lib/providers/store";

export const usePinnedNetworks = () => {
  const { getPinnedNetworks } = useNetworkStore();
  const { isChainIdExist } = useChainConfigs();

  return getPinnedNetworks().filter(isChainIdExist);
};
