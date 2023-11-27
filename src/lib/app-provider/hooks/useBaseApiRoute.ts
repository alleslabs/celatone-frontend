import { useCelatoneApp } from "../contexts";
import { CELATONE_API_OVERRIDE as api } from "env";

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
    | "move"
): string => {
  const {
    chainConfig: { chain },
    currentChainId,
  } = useCelatoneApp();

  if (!chain || !currentChainId || !api)
    throw new Error(
      "Error retrieving chain, api, or currentChainId from chain config."
    );

  switch (type) {
    case "txs":
      return `${api}/txs/${chain}/${currentChainId}`;
    case "balances":
      return `${api}/v1/${chain}/${currentChainId}/balances`;
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
    case "move":
      return `${api}/v1/${chain}/${currentChainId}/move`;
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
