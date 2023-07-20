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
import { useAddressByICNSName, useICNSNamesByAddress } from "./nameService";
import type { ICNSNamesResponse } from "./ns";
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
  icnsAddressLoading,
}: {
  debouncedKeyword: string;
  isWasm: boolean;
  isPool: boolean;
  txLoading: boolean;
  codeLoading: boolean;
  contractLoading: boolean;
  blockLoading: boolean;
  poolFetching: boolean;
  icnsAddressLoading: boolean;
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
    icnsAddressLoading ||
    poolLoading
  );
};

export interface ResultMetadata {
  icns: { icnsNames: Option<ICNSNamesResponse>; address: Option<Addr> };
}

// TODO: Add Proposal ID
export const useSearchHandler = (
  keyword: string,
  resetHandlerStates: () => void
): {
  results: SearchResultType[];
  isLoading: boolean;
  metadata: ResultMetadata;
  // eslint-disable-next-line sonarjs/cognitive-complexity
} => {
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
      icnsAddressLoading,
    }),
    metadata: {
      icns: {
        icnsNames,
        address: (isAddr ? debouncedKeyword : icnsAddressData?.address) as Addr,
      },
    },
  };
};
