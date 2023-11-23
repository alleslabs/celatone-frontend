import { useCelatoneApp } from "../contexts";
import { CELATONE_API_OVERRIDE } from "env";

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
    | "icns_names"
    | "icns_address"
    | "cosmwasm"
    | "move_modules"
    | "staking"
): string => {
  const {
    chainConfig: { chain, api: configApi },
    currentChainId,
  } = useCelatoneApp();

  if (!chain || !currentChainId || !configApi)
    throw new Error(
      "Error retrieving chain, api, or currentChainId from chain config."
    );

  const api = CELATONE_API_OVERRIDE || configApi;

  switch (type) {
    case "txs":
      return `${api}/txs/${chain}/${currentChainId}`;
    case "balances":
      return `${api}/balances/${chain}/${currentChainId}`;
    case "assets":
      return `${api}/v1/${chain}/${currentChainId}/assets`;
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
    case "icns_names":
      return `${api}/icns/names`;
    case "icns_address":
      return `${api}/icns/address`;
    case "cosmwasm":
      return `${api}/cosmwasm/${chain}/${currentChainId}`;
    case "move_modules":
      return `${api}/${chain}/${currentChainId}/move_modules`;
    case "staking":
      return `${api}/${chain}/${currentChainId}/staking`;
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
