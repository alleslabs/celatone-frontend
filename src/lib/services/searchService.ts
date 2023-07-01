import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useGetAddressType,
} from "lib/app-provider";
import type { Addr, ContractAddr, Option } from "lib/types";
import { isBlock, isCodeId, isTxHash } from "lib/utils";

import { useBlockDetailsQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { useAddressByICNSName } from "./nameService";
import { useTxData } from "./txService";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block";

export interface ResultMetadata {
  icns: {
    address: Option<Addr>;
  };
}

// TODO: Add Proposal ID
export const useSearchHandler = (
  keyword: string,
  resetHandlerStates: () => void
): {
  results: SearchResultType[];
  isLoading: boolean;
  metadata: ResultMetadata;
} => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const {
    chainConfig: {
      features: {
        wasm: { enabled: isWasm },
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
  const { data: icnsAddressData, isLoading: icnsAddressLoading } =
    useAddressByICNSName(debouncedKeyword);

  const txDataLoading = isTxHash(debouncedKeyword) && txLoading;
  const codeDataLoading = isWasm && isCodeId(debouncedKeyword) && codeLoading;
  const contractDataLoading = isWasm && contractLoading;
  const blockDataLoading = isBlock(debouncedKeyword) && blockLoading;
  const isAddr =
    addressType === "user_address" || addressType === "contract_address";

  const addressResult = useMemo(() => {
    if (isAddr) {
      return contractData ? "Contract Address" : "Wallet Address";
    }

    return (
      icnsAddressData?.address &&
      (icnsAddressData.addressType === "contract_address"
        ? "Contract Address"
        : "Wallet Address")
    );
  }, [isAddr, contractData, icnsAddressData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keyword);
      resetHandlerStates();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, resetHandlerStates]);

  return {
    results: [
      addressResult,
      txData && "Transaction Hash",
      codeData && "Code ID",
      blockData && "Block",
    ].filter((res) => Boolean(res)) as SearchResultType[],
    isLoading:
      txDataLoading ||
      codeDataLoading ||
      contractDataLoading ||
      blockDataLoading ||
      icnsAddressLoading,
    metadata: {
      icns: {
        address: icnsAddressData?.address,
      },
    },
  };
};
