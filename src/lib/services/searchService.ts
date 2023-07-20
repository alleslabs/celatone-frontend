import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useGetAddressType,
} from "lib/app-provider";
import type { Addr, ContractAddr, Option } from "lib/types";
import { isCodeId, isTxHash } from "lib/utils";

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
  const { data: txData, isFetching: txFetching } = useTxData(
    debouncedKeyword,
    isTxHash(debouncedKeyword)
  );
  const { data: codeData, isFetching: codeFetching } = useCodeDataByCodeId(
    debouncedKeyword,
    isWasm && isCodeId(debouncedKeyword)
  );
  const { data: contractData, isFetching: contractFetching } = useQuery(
    ["query", "contract", lcdEndpoint, debouncedKeyword],
    async () => queryContract(lcdEndpoint, debouncedKeyword as ContractAddr),
    {
      enabled: isWasm && Boolean(debouncedKeyword),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: blockData, isFetching: blockFetching } =
    useBlockDetailsQuery(debouncedKeyword);
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool &&
      Number.isInteger(Number(debouncedKeyword)) &&
      Number(debouncedKeyword) > 0
  );
  const { data: icnsAddressData, isFetching: icnsAddressFetching } =
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
    isLoading:
      txFetching ||
      codeFetching ||
      contractFetching ||
      blockFetching ||
      icnsAddressFetching ||
      poolFetching,
    metadata: {
      icns: {
        icnsNames,
        address: (isAddr ? debouncedKeyword : icnsAddressData?.address) as Addr,
      },
    },
  };
};
