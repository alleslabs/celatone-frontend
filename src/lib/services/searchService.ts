import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
  useValidateAddress,
} from "lib/app-provider";
import { zBechAddr32, zValidatorAddr } from "lib/types";
import type { BechAddr, Option } from "lib/types";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  isId,
  isPosDecimal,
  splitModule,
} from "lib/utils";

import { useBlockData } from "./block";
import { useModuleByAddressLcd } from "./move/moduleService";
import { useAddressByICNSName, useICNSNamesByAddress } from "./nameService";
import type { ICNSNamesResponse } from "./ns";
import { usePoolByPoolId } from "./poolService";
import { useProposalData } from "./proposalService";
import { useTxData } from "./tx";
import { useValidatorData } from "./validator";
import { useCodeDataByCodeId } from "./wasm/code";
import { queryContract } from "./wasm/contract";

export type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Account Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block"
  | "Pool ID"
  | "Validator Address"
  | "Module Path";

export interface ResultMetadata {
  icns: {
    icnsNames: Option<ICNSNamesResponse>;
    address: Option<BechAddr>;
    bech32Prefix: string;
  };
}

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
        gov: { enabled: isGov },
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
  const { isSomeValidAddress, validateValidatorAddress } = useValidateAddress();
  const addressType = getAddressType(debouncedKeyword);

  // Contract
  const { data: contractData, isFetching: contractFetching } = useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, debouncedKeyword],
    async () => {
      const contractAddr = zBechAddr32.parse(debouncedKeyword);
      return queryContract(lcdEndpoint, contractAddr);
    },
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
    isAddr ? (debouncedKeyword as BechAddr) : icnsAddressData?.address
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
  const { data: codeData, isFetching: codeFetching } = useCodeDataByCodeId(
    Number(debouncedKeyword),
    isWasm && isId(debouncedKeyword)
  );

  // Tx
  const { data: txData, isFetching: txFetching } = useTxData(debouncedKeyword);

  // Block
  const { data: blockData, isFetching: blockFetching } = useBlockData(
    Number(debouncedKeyword),
    isPosDecimal(debouncedKeyword)
  );

  // Proposal
  const { data: proposalData, isFetching: proposalFetching } = useProposalData(
    Number(debouncedKeyword),
    isGov && isId(debouncedKeyword)
  );

  // Validator
  const { data: validatorData, isFetching: validatorFetching } =
    useValidatorData(
      zValidatorAddr.parse(debouncedKeyword),
      isGov && validateValidatorAddress(debouncedKeyword) === null
    );

  // Pool
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool && isId(debouncedKeyword)
  );

  // Move
  const [addr, moduleName, functionName] = splitModule(debouncedKeyword);

  const enableModuleFetching = useMemo(
    () =>
      Boolean(
        isMove &&
          isSomeValidAddress(addr) &&
          moduleName &&
          functionName === undefined
      ),
    [addr, functionName, isMove, isSomeValidAddress, moduleName]
  );

  const { data: moduleData, isFetching: moduleFetching } =
    useModuleByAddressLcd({
      address: addr,
      moduleName: moduleName ?? "",
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
      moduleData && "Module Path",
      txData && "Transaction Hash",
      codeData && "Code ID",
      blockData && "Block",
      proposalData?.info && "Proposal ID",
      validatorData && "Validator Address",
      poolData && "Pool ID",
    ].filter((res) => Boolean(res)) as SearchResultType[],
    isLoading:
      moduleFetching ||
      txFetching ||
      codeFetching ||
      contractFetching ||
      blockFetching ||
      icnsAddressFetching ||
      poolFetching ||
      proposalFetching ||
      validatorFetching,
    metadata: {
      icns: {
        icnsNames,
        address: isAddr
          ? (debouncedKeyword as BechAddr)
          : icnsAddressData?.address,
        bech32Prefix,
      },
    },
  };
};
