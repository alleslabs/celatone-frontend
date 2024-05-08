/* eslint-disable complexity */
import { useCelatoneApp } from "../contexts";
import { CELATONE_API_OVERRIDE as api } from "env";

export const useBaseApiRoute = (
  type:
    | "overviews"
    | "txs"
    | "accounts"
    | "assets"
    | "blocks"
    | "codes"
    | "contracts"
    | "proposals"
    | "validators"
    | "projects"
    | "public_codes"
    | "legacy.accounts"
    | "rest"
    | "icns_names"
    | "icns_address"
    | "cosmwasm"
    | "move_modules"
    | "staking"
    | "move"
    | "modules"
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
    case "overviews":
      return `${api}/v1/${chain}/${currentChainId}/overviews`;
    case "txs":
      return `${api}/v1/${chain}/${currentChainId}/txs`;
    case "accounts":
      return `${api}/v1/${chain}/${currentChainId}/accounts`;
    case "assets":
      return `${api}/v1/${chain}/${currentChainId}/assets`;
    case "blocks":
      return `${api}/v1/${chain}/${currentChainId}/blocks`;
    case "codes":
      return `${api}/v1/${chain}/${currentChainId}/wasm/codes`;
    case "contracts":
      return `${api}/v1/${chain}/${currentChainId}/wasm/contracts`;
    case "proposals":
      return `${api}/v1/${chain}/${currentChainId}/proposals`;
    case "validators":
      return `${api}/v1/${chain}/${currentChainId}/validators`;
    case "projects":
      return `${api}/projects/${chain}/${currentChainId}`;
    case "public_codes":
      return `${api}/codes/${chain}/${currentChainId}`;
    case "legacy.accounts":
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
    case "modules":
      return `${api}/v1/${chain}/${currentChainId}/move/modules`;
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
