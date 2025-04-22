import { CELATONE_API_OVERRIDE as api } from "env";

import { useCelatoneApp } from "../contexts";

export const useBaseApiRoute = (
  type:
    | "accounts"
    | "assets"
    | "blocks"
    | "codes"
    | "contracts"
    | "cosmwasm"
    | "icns_address"
    | "icns_names"
    | "legacy.accounts"
    | "modules"
    | "move"
    | "move_modules"
    | "nft_collections"
    | "nfts"
    | "overviews"
    | "pools"
    | "projects"
    | "proposals"
    | "public_codes"
    | "rest"
    | "staking"
    | "txs"
    | "validators"
): string => {
  const {
    chainConfig: { chain },
    currentChainId,
  } = useCelatoneApp();

  if (!chain || !currentChainId)
    throw new Error(
      "Error retrieving chain, or currentChainId from chain config."
    );

  switch (type) {
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
    case "cosmwasm":
      return `${api}/cosmwasm/${chain}/${currentChainId}`;
    case "icns_address":
      return `${api}/icns/address`;
    case "icns_names":
      return `${api}/icns/names`;
    case "legacy.accounts":
      return `${api}/accounts/${chain}/${currentChainId}`;
    case "modules":
      return `${api}/v1/${chain}/${currentChainId}/move/modules`;
    case "move":
      return `${api}/v1/${chain}/${currentChainId}/move`;
    case "move_modules":
      return `${api}/${chain}/${currentChainId}/move_modules`;
    case "nft_collections":
      return `${api}/v1/${chain}/${currentChainId}/nft-collections`;
    case "nfts":
      return `${api}/v1/${chain}/${currentChainId}/nfts`;
    case "overviews":
      return `${api}/v1/${chain}/${currentChainId}/overviews`;
    case "pools":
      return `${api}/v1/${chain}/${currentChainId}/pools`;
    case "projects":
      return `${api}/projects/${chain}/${currentChainId}`;
    case "proposals":
      return `${api}/v1/${chain}/${currentChainId}/proposals`;
    case "public_codes":
      return `${api}/codes/${chain}/${currentChainId}`;
    case "rest":
      return `${api}/rest/${chain}/${currentChainId}`;
    case "staking":
      return `${api}/${chain}/${currentChainId}/staking`;
    case "txs":
      return `${api}/v1/${chain}/${currentChainId}/txs`;
    case "validators":
      return `${api}/v1/${chain}/${currentChainId}/validators`;
    default:
      throw new Error(
        "Error retrieving chain, api, or currentChainId from chain config."
      );
  }
};
