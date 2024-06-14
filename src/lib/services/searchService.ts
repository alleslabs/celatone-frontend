import { useEffect, useMemo, useState } from "react";

import {
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
  useTierConfig,
  useValidateAddress,
} from "lib/app-provider";
import type { BechAddr, Option } from "lib/types";
import { zBechAddr32, zValidatorAddr } from "lib/types";
import type { IcnsNamesByAddress } from "lib/types/name";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  isId,
  isPosDecimal,
  splitModule,
} from "lib/utils";

import { useBlockData } from "./block";
import { useModuleByAddressLcd } from "./move/module";
import { useAddressByIcnsNameLcd, useIcnsNamesByAddressLcd } from "./name";
import { usePoolByPoolId } from "./poolService";
import { useProposalData, useProposalDataLcd } from "./proposal";
import { useTxData } from "./tx";
import { useValidatorData, useValidatorDataLcd } from "./validator";
import { useCodeLcd } from "./wasm/code";
import { useContractData } from "./wasm/contract";

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
    icnsNames: Option<IcnsNamesByAddress>;
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
  const isFullTier = useTierConfig() === "full";
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
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();

  const getAddressType = useGetAddressType();
  const {
    validateContractAddress,
    validateValidatorAddress,
    isSomeValidAddress,
  } = useValidateAddress();
  const addressType = getAddressType(debouncedKeyword);

  // Contract
  const { data: contractData, isFetching: contractFetching } = useContractData(
    zBechAddr32.parse(debouncedKeyword),
    {
      enabled: isWasm && validateContractAddress(debouncedKeyword) === null,
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
    useAddressByIcnsNameLcd(debouncedKeyword);
  // provide ICNS metadata result
  const address = (
    isAddr ? debouncedKeyword : icnsAddressData?.address
  ) as BechAddr;
  const { data: icnsNames } = useIcnsNamesByAddressLcd(address);

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
  const { data: codeData, isFetching: codeFetching } = useCodeLcd(
    Number(debouncedKeyword),
    {
      enabled: isWasm && isId(debouncedKeyword),
    }
  );

  // Tx
  const { data: txData, isFetching: txFetching } = useTxData(debouncedKeyword);

  // Block
  const blockApi = useBlockData(
    Number(debouncedKeyword),
    isPosDecimal(debouncedKeyword) && isFullTier
  );
  const blockLcd = useBlockData(
    Number(debouncedKeyword),
    isPosDecimal(debouncedKeyword) && !isFullTier
  );
  const { data: blockData, isFetching: blockFetching } = isFullTier
    ? blockApi
    : blockLcd;

  // Proposal
  const { data: proposalApiData, isFetching: proposalApiIsFetching } =
    useProposalData(
      Number(debouncedKeyword),
      isGov && isId(debouncedKeyword) && isFullTier
    );
  const { data: proposalLcdData, isFetching: proposalLcdIsFetching } =
    useProposalDataLcd(
      Number(debouncedKeyword),
      isGov && isId(debouncedKeyword) && !isFullTier
    );
  const [proposalData, proposalFetching] = isFullTier
    ? [proposalApiData, proposalApiIsFetching]
    : [
        proposalLcdData
          ? {
              info: proposalLcdData,
            }
          : undefined,
        proposalLcdIsFetching,
      ];

  // Validator
  const validatorApi = useValidatorData(
    zValidatorAddr.parse(debouncedKeyword),
    isGov && validateValidatorAddress(debouncedKeyword) === null && isFullTier
  );
  const validatorLcd = useValidatorDataLcd(
    zValidatorAddr.parse(debouncedKeyword),
    isGov && validateValidatorAddress(debouncedKeyword) === null && !isFullTier
  );
  const { data: validatorData, isFetching: validatorFetching } = isFullTier
    ? validatorApi
    : validatorLcd;

  // Pool
  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool && isId(debouncedKeyword) && isFullTier
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
        address,
        bech32Prefix,
      },
    },
  };
};
