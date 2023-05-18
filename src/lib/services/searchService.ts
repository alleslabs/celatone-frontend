import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useGetAddressType, useLCDEndpoint } from "lib/app-provider";
import type { ContractAddr } from "lib/types";
import { isBlock, isCodeId, isTxHash } from "lib/utils";

import { useBlockDetailsQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { useTxData } from "./txService";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block";

// TODO: Add Proposal ID, ICNS query
export const useSearchHandler = (
  query: string,
  resetHandlerStates: () => void
): { results: SearchResultType[]; isLoading: boolean } => {
  const [timeoutQuery, setTimeoutQuery] = useState(query);
  const lcdEndpoint = useLCDEndpoint();
  const getAddressType = useGetAddressType();
  const addressType = getAddressType(timeoutQuery);
  const { data: txData, isLoading: txLoading } = useTxData(timeoutQuery);
  const { data: codeData, isLoading: codeLoading } =
    useCodeDataByCodeId(timeoutQuery);
  const { data: contractData, isLoading: contractLoading } = useQuery(
    ["query", "contract", lcdEndpoint, timeoutQuery],
    async () => queryContract(lcdEndpoint, timeoutQuery as ContractAddr),
    {
      enabled: Boolean(timeoutQuery),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: blockData, isLoading: blockLoading } =
    useBlockDetailsQuery(timeoutQuery);
  const txDataLoading = isTxHash(timeoutQuery) && txLoading;
  const codeDataLoading = isCodeId(timeoutQuery) && codeLoading;
  const blockDataLoading = isBlock(timeoutQuery) && blockLoading;
  const isAddr =
    addressType === "user_address" || addressType === "contract_address";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutQuery(query);
      resetHandlerStates();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, resetHandlerStates]);

  return {
    results: [
      isAddr && (contractData ? "Contract Address" : "Wallet Address"),
      txData && "Transaction Hash",
      codeData && "Code ID",
      blockData && "Block",
    ].filter((res) => Boolean(res)) as SearchResultType[],
    isLoading:
      txDataLoading || codeDataLoading || contractLoading || blockDataLoading,
  };
};
