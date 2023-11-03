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
import {
  isCodeId,
  isHexWalletAddress,
  isHexModuleAddress,
  splitModule,
} from "lib/utils";

import { useBlockInfoQuery } from "./blockService";
import { useCodeDataByCodeId } from "./codeService";
import { queryContract } from "./contract";
import { useAccountModules } from "./move/moduleService";
import { useAddressByICNSName, useICNSNamesByAddress } from "./nameService";
import type { ICNSNamesResponse } from "./ns";
import { usePoolByPoolId } from "./poolService";
import { useTxData } from "./txService";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Account Address"
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

  // Contract
  const { data: contractData, isFetching: contractFetching } = useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, debouncedKeyword],
    async () => queryContract(lcdEndpoint, debouncedKeyword as ContractAddr),
    {
      enabled: isWasm && Boolean(debouncedKeyword),
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const isAddr =
    addressType === "user_address" ||
    addressType === "contract_address" ||
    (isMove &&
      (isHexWalletAddress(debouncedKeyword) ||
        isHexModuleAddress(debouncedKeyword)));

  // ICNS
  const { data: icnsAddressData, isFetching: icnsAddressFetching } =
    useAddressByICNSName(debouncedKeyword);
  // provide ICNS metadata result
  const { data: icnsNames } = useICNSNamesByAddress(
    (isAddr ? debouncedKeyword : icnsAddressData?.address) as Addr
  );

  const addressResult = useMemo(() => {
    if (isAddr) {
      return contractData ? "Contract Address" : "Account Address";
    }
    return (
      icnsAddressData?.address &&
      (icnsAddressData.addressType === "contract_address"
        ? "Contract Address"
        : "Account Address")
    );
  }, [isAddr, contractData, icnsAddressData]);

  // Code
  const { data: codeData, isFetching: codeFetching } = useCodeDataByCodeId({
    codeId: debouncedKeyword,
    enabled: isWasm && isCodeId(debouncedKeyword),
  });

  // Tx
  const { data: txData, isFetching: txFetching } = useTxData(debouncedKeyword);

  // Block
  const { data: blockData, isFetching: blockFetching } =
    useBlockInfoQuery(debouncedKeyword);

  // Pool
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool &&
      !debouncedKeyword.startsWith("0x") &&
      Number.isInteger(Number(debouncedKeyword)) &&
      Number(debouncedKeyword) > 0
  );

  // Move
  const [addr, moduleName, functionName] = splitModule(debouncedKeyword);

  const enableModuleFetching = useMemo(
    () =>
      Boolean(
        isMove &&
          (getAddressType(addr) === "user_address" ||
            isHexWalletAddress(addr)) &&
          moduleName &&
          functionName === undefined
      ),
    [functionName, getAddressType, addr, isMove, moduleName]
  );

  const { data: moduleData, isFetching: moduleFetching } = useAccountModules({
    address: addr,
    moduleName,
    functionName: undefined,
    options: {
      enabled: enableModuleFetching,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  // TODO: handle module function later

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
      moduleName && moduleData && "Module Path",
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
