import type { SearchResultType } from "lib/services/searchService";
import type { Nullable, Option } from "lib/types";

export const getRouteOptions = (
  type: Option<SearchResultType>,
  isEvm: boolean
): Nullable<{ pathname: string; query: string[] }> => {
  switch (type) {
    case "Account address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: ["accountAddress"],
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: ["height"] };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: ["codeId"] };
    case "Contract address":
      return {
        pathname: isEvm
          ? "/evm-contracts/[contractAddress]"
          : "/contracts/[contractAddress]",
        query: ["contractAddress"],
      };
    case "EVM transaction hash":
      return { pathname: "/evm-txs/[txHash]", query: ["txHash"] };
    case "Module path":
      return {
        pathname: "/modules/[address]/[moduleName]",
        query: ["address", "moduleName"],
      };
    case "NFT address":
      return {
        pathname: "/nft-collections/[collectionAddress]/nft/[tokenId]",
        query: ["collectionAddress", "tokenId"],
      };
    case "NFT collection address":
      return {
        pathname: "/nft-collections/[collectionAddress]",
        query: ["collectionAddress"],
      };
    case "Pool ID":
      return { pathname: "/pools/[poolId]", query: ["poolId"] };
    case "Proposal ID":
      return { pathname: "/proposals/[proposalId]", query: ["proposalId"] };
    case "Transaction hash":
      return { pathname: "/txs/[txHash]", query: ["txHash"] };
    case "Validator address":
      return {
        pathname: "/validators/[validatorAddress]",
        query: ["validatorAddress"],
      };
    default:
      return null;
  }
};

export const getNextCursor = (
  key: string,
  current: Option<number>,
  lastIndex: number
) => {
  switch (key) {
    case "ArrowDown":
      if (current === undefined) return 0;
      return current >= lastIndex ? 0 : current + 1;
    case "ArrowUp":
      if (current === undefined) return lastIndex;
      return current <= 0 ? lastIndex : current - 1;
    default:
      return undefined;
  }
};

export const generateQueryObject = (
  params: string[],
  value: string | string[]
) =>
  typeof value === "string"
    ? { [params[0]]: value }
    : params.reduce((acc, curr, idx) => ({ ...acc, [curr]: value[idx] }), {});
