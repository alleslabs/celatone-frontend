import { useEffect, useMemo, useState } from "react";

import {
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
  useInitia,
  useTierConfig,
  useValidateAddress,
} from "lib/app-provider";
import type { Addr, BechAddr, HexAddr32 } from "lib/types";
import { zBechAddr32, zValidatorAddr } from "lib/types";
import type { IcnsNamesByAddress } from "lib/types/name";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  isId,
  isPosDecimal,
  splitModulePath,
} from "lib/utils";

import { useBlockData } from "./block";
import { useModuleByAddressLcd } from "./move/module";
import { useAddressByIcnsNameLcd, useIcnsNamesByAddressLcd } from "./name";
import { useNftByNftAddressLcd } from "./nft";
import { useCollectionByCollectionAddress } from "./nft-collection";
import { usePoolByPoolId } from "./poolService";
import { useProposalData, useProposalDataLcd } from "./proposal";
import { useTxData } from "./tx";
import {
  useAddressByInitiaUsername,
  useInitiaUsernameByAddress,
} from "./username";
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
  | "Module Path"
  | "NFT Address"
  | "NFT Collection Address";

interface ResultMetadata {
  icns?: {
    icnsNames: IcnsNamesByAddress;
    searchedName?: string;
  };
  initiaUsername?: string;
  nft?: {
    collectionAddress?: HexAddr32;
    name: string;
  };
}

export interface SearchResult {
  value: string;
  type: SearchResultType;
  metadata?: ResultMetadata;
}

interface SearchHandlerResponse {
  results: SearchResult[];
  isLoading: boolean;
}

// eslint-disable-next-line complexity
export const useSearchHandler = (
  keyword: string,
  resetHandlerStates: () => void
  // eslint-disable-next-line sonarjs/cognitive-complexity
): SearchHandlerResponse => {
  const { isFullTier, isLiteTier } = useTierConfig();
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const {
    chainConfig: {
      features: {
        gov: { enabled: isGov },
        wasm: { enabled: isWasm },
        pool: { enabled: isPool },
        move: { enabled: isMove },
        nft: { enabled: isNft },
      },
    },
  } = useCelatoneApp();
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();
  const isInitia = useInitia();

  const getAddressType = useGetAddressType();
  const {
    validateContractAddress,
    validateValidatorAddress,
    isSomeValidAddress,
  } = useValidateAddress();

  /// /////////////////////////////////////////////////////
  //                      Account
  /// /////////////////////////////////////////////////////
  const addressType = getAddressType(debouncedKeyword);
  const isAddr =
    addressType === "user_address" ||
    addressType === "contract_address" ||
    (isMove &&
      (isHexWalletAddress(debouncedKeyword) ||
        isHexModuleAddress(debouncedKeyword)));

  // ICNS
  const { data: icnsAddrByKeyword, isFetching: icnsAddrByKeywordFetching } =
    useAddressByIcnsNameLcd(debouncedKeyword, isWasm);
  const { data: icnsNamesByIcnsAddr, isFetching: icnsNamesByIcnsAddrFetching } =
    useIcnsNamesByAddressLcd(
      icnsAddrByKeyword?.address as BechAddr,
      !isInitia && icnsAddrByKeyword !== undefined
    );
  const { data: icnsNamesByKeyword, isFetching: icnsNamesByKeywordFetching } =
    useIcnsNamesByAddressLcd(debouncedKeyword as BechAddr, !isInitia && isAddr);

  // Initia Username (IU)
  const { data: iuAddrByKeyword, isFetching: iuAddrByKeywordFetching } =
    useAddressByInitiaUsername(debouncedKeyword);
  const { data: iuNameByKeyword, isFetching: iuNameByKeywordFetching } =
    useInitiaUsernameByAddress(debouncedKeyword as Addr, isInitia && isAddr);

  /// /////////////////////////////////////////////////////
  //                       NFT
  /// /////////////////////////////////////////////////////

  const { data: nftData, isFetching: nftFetching } = useNftByNftAddressLcd(
    debouncedKeyword as HexAddr32,
    isNft && isHexModuleAddress(debouncedKeyword) && !isLiteTier
  );

  const { data: nftCollectionData, isFetching: nftCollectionFetching } =
    useCollectionByCollectionAddress(
      debouncedKeyword as HexAddr32,
      isNft && isHexModuleAddress(debouncedKeyword) && !isLiteTier
    );

  /// /////////////////////////////////////////////////////
  //                       Move
  /// /////////////////////////////////////////////////////

  const [addr, moduleName, functionName] = splitModulePath(debouncedKeyword);

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

  /// /////////////////////////////////////////////////////
  //                       Wasm
  /// /////////////////////////////////////////////////////

  const { data: codeData, isFetching: codeFetching } = useCodeLcd(
    Number(debouncedKeyword),
    {
      enabled: isWasm && isId(debouncedKeyword),
    }
  );

  const { data: contractData, isFetching: contractFetching } = useContractData(
    zBechAddr32.parse(debouncedKeyword),
    {
      enabled: isWasm && validateContractAddress(debouncedKeyword) === null,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  /// /////////////////////////////////////////////////////
  //                       Transaction
  /// /////////////////////////////////////////////////////

  const { data: txData, isFetching: txFetching } = useTxData(debouncedKeyword);

  /// /////////////////////////////////////////////////////
  //                         Block
  /// /////////////////////////////////////////////////////

  const blockApi = useBlockData(
    Number(debouncedKeyword),
    isPosDecimal(debouncedKeyword) && isFullTier
  );
  const { foundBlock, isFetching: blockFetching } = useMemo(() => {
    if (isPosDecimal(debouncedKeyword) && !isFullTier)
      return { foundBlock: true, isFetching: false };
    return { foundBlock: blockApi.data, isFetching: blockApi.isFetching };
  }, [blockApi.data, blockApi.isFetching, debouncedKeyword, isFullTier]);

  /// /////////////////////////////////////////////////////
  //                         Proposal
  /// /////////////////////////////////////////////////////

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

  /// /////////////////////////////////////////////////////
  //                         Validator
  /// /////////////////////////////////////////////////////

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

  /// /////////////////////////////////////////////////////
  //                     Osmosis Pool
  /// /////////////////////////////////////////////////////

  const { data: poolData, isFetching: poolFetching } = usePoolByPoolId(
    Number(debouncedKeyword),
    isPool && isId(debouncedKeyword) && isFullTier
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keyword);
      resetHandlerStates();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, resetHandlerStates]);

  if (
    icnsAddrByKeywordFetching ||
    icnsNamesByIcnsAddrFetching ||
    icnsNamesByKeywordFetching ||
    iuAddrByKeywordFetching ||
    iuNameByKeywordFetching ||
    nftFetching ||
    nftCollectionFetching ||
    moduleFetching ||
    codeFetching ||
    contractFetching ||
    txFetching ||
    blockFetching ||
    proposalFetching ||
    validatorFetching ||
    poolFetching
  )
    return {
      results: [],
      isLoading: true,
    };

  const results: SearchResult[] = [];

  if (nftCollectionData)
    results.push({
      value: debouncedKeyword,
      type: "NFT Collection Address",
      metadata: {
        nft: {
          name: nftCollectionData.name,
        },
      },
    });

  if (nftData)
    results.push({
      value: debouncedKeyword,
      type: "NFT Address",
      metadata: {
        nft: {
          collectionAddress: nftData.collectionAddress,
          name: nftData.tokenId,
        },
      },
    });

  if (isAddr)
    results.push({
      value: debouncedKeyword,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      type: contractData ? "Contract Address" : "Account Address",
      metadata: {
        icns:
          icnsNamesByKeyword && icnsNamesByKeyword.names.length > 0
            ? {
                icnsNames: icnsNamesByKeyword,
              }
            : undefined,
        initiaUsername: iuNameByKeyword?.username ?? undefined,
      },
    });

  if (icnsAddrByKeyword && icnsAddrByKeyword.address !== "")
    results.push({
      value: icnsAddrByKeyword.address,
      type:
        icnsAddrByKeyword.addressType === "contract_address"
          ? "Contract Address"
          : "Account Address",
      metadata: {
        icns:
          icnsNamesByIcnsAddr && icnsNamesByIcnsAddr.names.length > 0
            ? {
                icnsNames: icnsNamesByIcnsAddr,
                searchedName: debouncedKeyword.endsWith(`.${bech32Prefix}`)
                  ? debouncedKeyword
                  : `${debouncedKeyword}.${bech32Prefix}`,
              }
            : undefined,
      },
    });

  if (iuAddrByKeyword && iuAddrByKeyword.address !== null)
    results.push({
      value: iuAddrByKeyword.address,
      type: "Account Address",
      metadata: {
        initiaUsername: debouncedKeyword.endsWith(`.${bech32Prefix}`)
          ? debouncedKeyword
          : `${debouncedKeyword}.${bech32Prefix}`,
      },
    });

  if (moduleData)
    results.push({
      value: debouncedKeyword,
      type: "Module Path",
    });

  if (codeData)
    results.push({
      value: debouncedKeyword,
      type: "Code ID",
    });

  if (txData)
    results.push({
      value: debouncedKeyword,
      type: "Transaction Hash",
    });

  if (foundBlock)
    results.push({
      value: debouncedKeyword,
      type: "Block",
    });

  if (proposalData)
    results.push({
      value: debouncedKeyword,
      type: "Proposal ID",
    });

  if (validatorData)
    results.push({
      value: debouncedKeyword,
      type: "Validator Address",
    });

  if (poolData)
    results.push({
      value: debouncedKeyword,
      type: "Pool ID",
    });

  return {
    results,
    isLoading: false,
  };
};
