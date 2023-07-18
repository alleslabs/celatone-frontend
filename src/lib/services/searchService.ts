import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useGetAddressType,
} from "lib/app-provider";
import type { ContractAddr } from "lib/types";
import { isBlock, isCodeId, isTxHash } from "lib/utils";

import { useBlockDetailsQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { usePoolByPoolId } from "./poolService";
import { useTxData } from "./txService";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block"
  | "Pool ID";

const loadingStateResolver = ({
  debouncedKeyword,
  isWasm,
  isPool,
  txLoading,
  codeLoading,
  contractLoading,
  blockLoading,
  poolFetching,
}: {
  debouncedKeyword: string;
  isWasm: boolean;
  isPool: boolean;
  txLoading: boolean;
  codeLoading: boolean;
  contractLoading: boolean;
  blockLoading: boolean;
  poolFetching: boolean;
}) => {
  const txDataLoading = isTxHash(debouncedKeyword) && txLoading;
  const codeDataLoading = isWasm && isCodeId(debouncedKeyword) && codeLoading;
  const contractDataLoading = isWasm && contractLoading;
  const blockDataLoading = isBlock(debouncedKeyword) && blockLoading;
  const poolLoading = isPool && poolFetching;

  return (
    txDataLoading ||
    codeDataLoading ||
    contractDataLoading ||
    blockDataLoading ||
    poolLoading
  );
};

// TODO: Add Proposal ID, ICNS query
export const useSearchHandler = (
  keyword: string,
  resetHandlerStates: () => void
): { results: SearchResultType[]; isLoading: boolean } => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const {
    chainConfig: {
      features: {
        wasm: { enabled: isWasm },
        pool: { enabled: isPool },
      },
    },
  } = useCelatoneApp();
  const lcdEndpoint = useBaseApiRoute("rest");
  const getAddressType = useGetAddressType();
  const addressType = getAddressType(debouncedKeyword);
  const { data: txData, isLoading: txLoading } = useTxData(debouncedKeyword);
  const { data: codeData, isLoading: codeLoading } = useCodeDataByCodeId(
    debouncedKeyword,
    isWasm
  );
  const { data: contractData, isLoading: contractLoading } = useQuery(
    ["query", "contract", lcdEndpoint, debouncedKeyword],
    async () => queryContract(lcdEndpoint, debouncedKeyword as ContractAddr),
    {
      enabled: isWasm && Boolean(debouncedKeyword),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: blockData, isLoading: blockLoading } =
    useBlockDetailsQuery(debouncedKeyword);
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool &&
      Number.isInteger(Number(debouncedKeyword)) &&
      Number(debouncedKeyword) > 0
  );

  const isAddr =
    addressType === "user_address" || addressType === "contract_address";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keyword);
      resetHandlerStates();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, resetHandlerStates]);

  return {
    results: [
      isAddr && (contractData ? "Contract Address" : "Wallet Address"),
      txData && "Transaction Hash",
      codeData && "Code ID",
      blockData && "Block",
      poolData && "Pool ID",
    ].filter((res) => Boolean(res)) as SearchResultType[],
    isLoading: loadingStateResolver({
      debouncedKeyword,
      isWasm,
      isPool,
      txLoading,
      codeLoading,
      contractLoading,
      blockLoading,
      poolFetching,
    }),
  };
};
