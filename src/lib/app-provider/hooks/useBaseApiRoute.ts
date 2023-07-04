import { useCelatoneApp } from "../contexts";

export const useBaseApiRoute = (
  type:
    | "txs"
    | "balances"
    | "assets"
    | "projects"
    | "contracts"
    | "codes"
    | "accounts"
    | "rest"
    | "native_tokens"
): string => {
  const {
    chainConfig: { chain, api },
    currentChainId,
  } = useCelatoneApp();
  if (!chain || !api || !currentChainId)
    throw new Error(
      "Error retrieving chain, api, or currentChainId from chain config."
    );
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
    case "accounts":
      return `${api}/accounts/${chain}/${currentChainId}`;
    case "rest":
      return `${api}/rest/${chain}/${currentChainId}`;
    case "native_tokens":
      return `${api}/native-assets/${chain}/${currentChainId}`;
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
