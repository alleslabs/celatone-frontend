import { CHAIN, SUPPORTED_NETWORK_TYPES } from "env";
import { useApiChainConfigs } from "lib/services/chain-config";
import { useCelatoneApp } from "../contexts";
import { useInternalNavigate } from ".";

export const useIsApiChain = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const { data: apiChainConfigs } = useApiChainConfigs(
    SUPPORTED_NETWORK_TYPES,
    CHAIN
  );
  const navigate = useInternalNavigate();
  const { currentChainId } = useCelatoneApp();

  const isApiChain = apiChainConfigs?.some(
    (chainConfig) => chainConfig.chainId === currentChainId
  );

  if (!isApiChain && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isApiChain;
};
