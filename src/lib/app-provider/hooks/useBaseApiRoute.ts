import { useCelatoneApp } from "../contexts";

import { useChainId } from "./useChainId";

export const useBaseApiRoute = (
  type: "txs" | "balances" | "assets" | "projects" | "contracts" | "codes"
): string => {
  const {
    chainConfig: { chain, api },
  } = useCelatoneApp();
  const chainId = useChainId();
  if (!chain || !api)
    throw new Error("Error retrieving chain or api from chain config.");
  switch (type) {
    case "txs":
      return `${api}/txs/${chain}/${chainId}`;
    case "balances":
      return `${api}/balances/${chain}/${chainId}`;
    case "assets":
      return `${api}/assets/${chain}/${chainId}`;
    case "projects":
      return `${api}/projects/${chain}/${chainId}`;
    case "contracts":
      return `${api}/contracts/${chain}/${chainId}`;
    case "codes":
      return `${api}/codes/${chain}/${chainId}`;
    default:
      throw new Error("Error retrieving chain or api from chain config.");
  }
};
