import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
} from "lib/app-provider";
import type { Addr, ContractAddr, Option } from "lib/types";
import { isCodeId, isHexAddress, splitModule } from "lib/utils";

import { useBlockInfoQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { useAccountModules } from "./moduleService";
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
  | "Pool ID"
  | "Module Path";

export interface ResultMetadata {
  icns: {
    icnsNames: Option<ICNSNamesResponse>;
    address: Option<Addr>;
    bech32Prefix: string;
  };
}

// TODO: Add Proposal ID
// eslint-disable-next-line complexity
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
        move: { enabled: isMove },
      },
    },
  } = useCelatoneApp();
  const lcdEndpoint = useBaseApiRoute("rest");
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();
  const getAddressType = useGetAddressType();
  const addressType = getAddressType(debouncedKeyword);
  const { data: txData, isFetching: txFetching } = useTxData(debouncedKeyword);
  const { data: codeData, isFetching: codeFetching } = useCodeDataByCodeId({
    codeId: debouncedKeyword,
    enabled: isWasm && isCodeId(debouncedKeyword),
  });
  const { data: contractData, isFetching: contractFetching } = useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, debouncedKeyword],
    async () => queryContract(lcdEndpoint, debouncedKeyword as ContractAddr),
    {
      enabled: isWasm && Boolean(debouncedKeyword),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  const { data: blockData, isFetching: blockFetching } =
    useBlockInfoQuery(debouncedKeyword);
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool &&
      Number.isInteger(Number(debouncedKeyword)) &&
      Number(debouncedKeyword) > 0
  );
  const { data: icnsAddressData, isFetching: icnsAddressFetching } =
    useAddressByICNSName(debouncedKeyword);

  const [initiaAddr, moduleName, functionName] = splitModule(debouncedKeyword);

  const enableModuleFetching = useMemo(
    () =>
      Boolean(
        isMove &&
          (getAddressType(initiaAddr) === "user_address" ||
            isHexAddress(initiaAddr)) &&
          moduleName &&
          functionName === undefined
      ),
    [functionName, getAddressType, initiaAddr, isMove, moduleName]
  );

  const { data: moduleData, isFetching: moduleFetching } = useAccountModules({
    address: initiaAddr,
    moduleName,
    functionName: undefined,
    options: {
      enabled: enableModuleFetching,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  const isAddr =
    addressType === "user_address" ||
    addressType === "contract_address" ||
    isHexAddress(debouncedKeyword);

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
      enableModuleFetching && moduleData && "Module Path",
      txData && "Transaction Hash",
      codeData && "Code ID",
      blockData && "Block",
      poolData && "Pool ID",
    ].filter((res) => Boolean(res)) as SearchResultType[],
    isLoading:
      moduleFetching ||
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
        bech32Prefix,
      },
    },
  };
};
