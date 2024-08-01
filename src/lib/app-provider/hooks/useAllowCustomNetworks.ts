import { SUPPORTED_CHAIN_IDS } from "env";

import { useInternalNavigate } from "./useInternalNavigate";

export const useAllowCustomNetworks = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const navigate = useInternalNavigate();

  const isAllow = SUPPORTED_CHAIN_IDS.some(
    (chainId) => chainId === "initiation-1"
  );

  if (!isAllow && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isAllow;
};
