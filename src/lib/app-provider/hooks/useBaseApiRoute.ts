import { useCelatoneApp } from "../contexts";
import { OVERRIDE_API_ENDPOINT } from "env";

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
): string => {
  const {
    chainConfig: { chain, api: configApi },
    currentChainId,
  } = useCelatoneApp();

  if (!chain || !currentChainId || !configApi)
    throw new Error(
      "Error retrieving chain, api, or currentChainId from chain config."
    );

  const api = OVERRIDE_API_ENDPOINT || configApi;

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
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
