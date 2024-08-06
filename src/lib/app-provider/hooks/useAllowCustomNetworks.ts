import { useChainConfigs } from "./useChainConfigs";
import { useInternalNavigate } from "./useInternalNavigate";

export const useAllowCustomNetworks = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const navigate = useInternalNavigate();
  const { supportedChainIds } = useChainConfigs();

  const isAllow = supportedChainIds.some(
    (chainId) => chainId === "initiation-1"
  );

  if (!isAllow && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isAllow;
};
