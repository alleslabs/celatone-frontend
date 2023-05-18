import { useCelatoneApp } from "../contexts";

export const useBaseApiRoute = (
  type: "txs" | "balances" | "assets" | "projects" | "contracts" | "codes"
): string => {
  const {
    chainConfig: { chain, api },
    currentChainId,
  } = useCelatoneApp();
  if (!chain || !api || !currentChainId) return "";
  switch (type) {
    case "txs":
      return `${api}/txs/${chain}/${currentChainId}`;
    case "balances":
      return `${api}/balances/${chain}/${currentChainId}`;
    case "assets":
      return `${api}/assets/${chain}/${currentChainId}`;
    case "projects":
      return `${api}/projects/${chain}/${currentChainId}`;
    case "contracts":
      return `${api}/contracts/${chain}/${currentChainId}`;
    case "codes":
      return `${api}/codes/${chain}/${currentChainId}`;
    default:
      return "";
  }
};
