import { CHAIN, SUPPORTED_NETWORK_TYPES } from "env";
import { useApiChainConfigs } from "lib/services/chain-config";

import { useInternalNavigate } from ".";
import { useCelatoneApp } from "../contexts";

export const useIsApiChain = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}): boolean => {
  const { data: apiChainConfigs } = useApiChainConfigs(
    SUPPORTED_NETWORK_TYPES,
    CHAIN
  );
  const navigate = useInternalNavigate();
  const { currentChainId } = useCelatoneApp();

  const isApiChain =
    apiChainConfigs?.some(
      (chainConfig) => chainConfig.chainId === currentChainId
    ) ?? false;

  if (!isApiChain && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isApiChain;
};
