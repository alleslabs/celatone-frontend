import type { SearchResultType } from "lib/services/searchService";
import type { Nullable, Option } from "lib/types";

export const getRouteOptions = (
  type: Option<SearchResultType>,
  isEvm: boolean
): Nullable<{ pathname: string; query: string[] }> => {
  switch (type) {
    case "Account Address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: ["accountAddress"],
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: ["height"] };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: ["codeId"] };
    case "Contract Address":
      return {
        pathname: isEvm
          ? "/evm-contracts/[contractAddress]"
          : "/contracts/[contractAddress]",
        query: ["contractAddress"],
      };
    case "EVM Transaction Hash":
      return { pathname: "/evm-txs/[txHash]", query: ["txHash"] };
    case "Module Path":
      return {
        pathname: "/modules/[address]/[moduleName]",
        query: ["address", "moduleName"],
      };
    case "NFT Address":
      return {
        pathname: "/nft-collections/[collectionAddress]/nft/[nftAddress]",
        query: ["collectionAddress", "nftAddress"],
      };
    case "NFT Collection Address":
      return {
        pathname: "/nft-collections/[collectionAddress]",
        query: ["collectionAddress"],
      };
    case "Pool ID":
      return { pathname: "/pools/[poolId]", query: ["poolId"] };
    case "Proposal ID":
      return { pathname: "/proposals/[proposalId]", query: ["proposalId"] };
    case "Transaction Hash":
      return { pathname: "/txs/[txHash]", query: ["txHash"] };
    case "Validator Address":
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
