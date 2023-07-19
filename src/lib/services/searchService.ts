import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGetAddressType,
} from "lib/app-provider";
import type { Addr, ContractAddr, Option } from "lib/types";
import { isBlock, isCodeId, isTxHash } from "lib/utils";

import { useBlockInfoQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { useAddressByICNSName, useICNSNamesByAddress } from "./nameService";
import type { ICNSNamesResponse } from "./ns";
import { useTxData } from "./txService";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block";

export interface ResultMetadata {
  icns: { icnsNames: Option<ICNSNamesResponse>; address: Option<Addr> };
}

const resolveLoadingState = ({
  keyword,
  txLoading,
  codeLoading,
  contractLoading,
  blockLoading,
  icnsAddressLoading,
  isWasm,
}: {
  keyword: string;
  txLoading: boolean;
  codeLoading: boolean;
  contractLoading: boolean;
  blockLoading: boolean;
  icnsAddressLoading: boolean;
  isWasm: boolean;
}) => {
  const txDataLoading = isTxHash(keyword) && txLoading;
  const codeDataLoading = isWasm && isCodeId(keyword) && codeLoading;
  const contractDataLoading = isWasm && contractLoading;
  const blockDataLoading = isBlock(keyword) && blockLoading;

  return (
    txDataLoading ||
    codeDataLoading ||
    contractDataLoading ||
    blockDataLoading ||
    icnsAddressLoading
  );
};

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
    [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, debouncedKeyword],
    async () => queryContract(lcdEndpoint, debouncedKeyword as ContractAddr),
    {
      enabled: isWasm && Boolean(debouncedKeyword),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: blockData, isLoading: blockLoading } =
    useBlockInfoQuery(debouncedKeyword);
  const { data: icnsAddressData, isLoading: icnsAddressLoading } =
    useAddressByICNSName(debouncedKeyword);

  const isAddr =
    addressType === "user_address" || addressType === "contract_address";

  // provide ICNS metadata result
  const { data: icnsNames } = useICNSNamesByAddress(
    (isAddr ? debouncedKeyword : icnsAddressData?.address) as Addr
  );

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
    isLoading: resolveLoadingState({
      keyword: debouncedKeyword,
      txLoading,
      codeLoading,
      contractLoading,
      blockLoading,
      icnsAddressLoading,
      isWasm,
    }),
    metadata: {
      icns: {
        icnsNames,
        address: (isAddr ? debouncedKeyword : icnsAddressData?.address) as Addr,
      },
    },
  };
};
