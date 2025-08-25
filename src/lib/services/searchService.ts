import type { Addr, BechAddr } from "lib/types";
import type { IcnsNamesByAddress } from "lib/types/name";

import {
  useCelatoneApp,
  useCurrentChain,
  useGetAddressType,
  useInitia,
  useTierConfig,
  useValidateAddress,
} from "lib/app-provider";
import { zBechAddr32, zHexAddr20, zHexAddr32, zValidatorAddr } from "lib/types";
import {
  isHex,
  isHex20Bytes,
  isHexModuleAddress,
  isHexWalletAddress,
  isId,
  isMovePrefixHexModuleAddress,
  isPosDecimal,
  splitModulePath,
  toChecksumAddress,
} from "lib/utils";
import { useEffect, useMemo, useState } from "react";

import { useBlockData, useBlockDataRest } from "./block";
import { useEvmCodesByAddress } from "./evm";
import { useModuleByAddressRest } from "./move/module";
import { useAddressByIcnsNameRest, useIcnsNamesByAddressRest } from "./name";
import { useNftByNftAddressMoveRest } from "./nft";
import { useNftCollectionByCollectionAddress } from "./nft-collection";
import { usePoolData } from "./pools";
import { useProposalData, useProposalDataRest } from "./proposal";
import { useEvmTxDataJsonRpc, useTxData } from "./tx";
import {
  useAddressByInitiaUsername,
  useInitiaUsernameByAddress,
} from "./username";
import { useValidatorData, useValidatorDataRest } from "./validator";
import { useCodeRest } from "./wasm/code";
import { useContractData } from "./wasm/contract";

export type SearchResultType =
  | "Account address"
  | "Block"
  | "Code ID"
  | "Contract address"
  | "EVM transaction hash"
  | "Module path"
  | "NFT address"
  | "NFT collection address"
  | "Pool ID"
  | "Proposal ID"
  | "Transaction hash"
  | "Validator address";

interface ResultMetadata {
  icns?: {
    icnsNames: IcnsNamesByAddress;
    searchedName?: string;
  };
  initiaUsername?: string;
  nft?: {
    collectionAddress?: Addr;
    name: string;
  };
}

export interface SearchResult {
  metadata?: ResultMetadata;
  type: SearchResultType;
  value: string;
}

interface SearchHandlerResponse {
  isLoading: boolean;
  results: SearchResult[];
}

export const useSearchHandler = (
  keyword: string,
  resetHandlerStates: () => void
): SearchHandlerResponse => {
  const { isFullTier, isLiteTier } = useTierConfig();
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const {
    chainConfig: {
      features: {
        evm: { enabled: isEvm },
        gov: { enabled: isGov },
        move: { enabled: isMove },
        nft: { enabled: isNft },
        pool: { enabled: isPool },
        wasm: { enabled: isWasm },
      },
    },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();
  const isInitia = useInitia();

  const getAddressType = useGetAddressType();
  const {
    isSomeValidAddress,
    validateContractAddress,
    validateValidatorAddress,
  } = useValidateAddress();

  /// /////////////////////////////////////////////////////
  //                      Account
  /// /////////////////////////////////////////////////////
  const addressType = getAddressType(debouncedKeyword);
  const isMoveHexAddr =
    isMove &&
    (isHexWalletAddress(debouncedKeyword) ||
      isHexModuleAddress(debouncedKeyword));
  const isEvmHexAddr = isEvm && isHexWalletAddress(debouncedKeyword);
  const isAddr =
    addressType === "user_address" ||
    addressType === "contract_address" ||
    isMoveHexAddr ||
    isEvmHexAddr;

  // handle "move/" prefix hex module address
  const isMovePrefixHexModuleAddr =
    isMove && isMovePrefixHexModuleAddress(debouncedKeyword);
  const addressByMovePrefixKeyword = isMovePrefixHexModuleAddr
    ? `0x${debouncedKeyword.slice(5)}`
    : undefined;

  // ICNS
  const { data: icnsAddrByKeyword, isFetching: icnsAddrByKeywordFetching } =
    useAddressByIcnsNameRest(debouncedKeyword, isWasm);
  const { data: icnsNamesByIcnsAddr, isFetching: icnsNamesByIcnsAddrFetching } =
    useIcnsNamesByAddressRest(
      icnsAddrByKeyword?.address as BechAddr,
      !isInitia && icnsAddrByKeyword !== undefined
    );
  const { data: icnsNamesByKeyword, isFetching: icnsNamesByKeywordFetching } =
    useIcnsNamesByAddressRest(
      debouncedKeyword as BechAddr,
      !isInitia && isAddr
    );

  // Initia Username (IU)
  const { data: iuAddrByKeyword, isFetching: iuAddrByKeywordFetching } =
    useAddressByInitiaUsername(debouncedKeyword);
  const { data: iuNameByKeyword, isFetching: iuNameByKeywordFetching } =
    useInitiaUsernameByAddress(debouncedKeyword as Addr, isInitia && isAddr);

  /// /////////////////////////////////////////////////////
  //                       NFT
  /// /////////////////////////////////////////////////////

  // Search by NFT address is only available for Move
  const { data: nftData, isFetching: nftFetching } = useNftByNftAddressMoveRest(
    zHexAddr32.parse(debouncedKeyword),
    isNft && isHexModuleAddress(debouncedKeyword) && !isLiteTier && isMove
  );

  const enableNftCollectionFetching = useMemo(() => {
    if (!isNft || isLiteTier) return false;
    if (
      isMove &&
      (isHexModuleAddress(debouncedKeyword) ||
        validateContractAddress(debouncedKeyword) === null)
    )
      return true;
    if (isWasm && validateContractAddress(debouncedKeyword) === null)
      return true;
    if (isEvm && isHexWalletAddress(debouncedKeyword)) return true;

    return false;
  }, [
    debouncedKeyword,
    isEvm,
    isLiteTier,
    isMove,
    isNft,
    isWasm,
    validateContractAddress,
  ]);

  const { data: nftCollectionData, isFetching: nftCollectionFetching } =
    useNftCollectionByCollectionAddress(
      zHexAddr32.parse(debouncedKeyword),
      enableNftCollectionFetching
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
    useModuleByAddressRest({
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

  const { data: codeData, isFetching: codeFetching } = useCodeRest(
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
  //                       EVM
  /// /////////////////////////////////////////////////////
  const { data: evmCodes, isFetching: evmCodesFetching } = useEvmCodesByAddress(
    zHexAddr20.parse(debouncedKeyword),
    isHexWalletAddress(debouncedKeyword)
  );

  const { data: evmTxData, isFetching: evmTxFetching } = useEvmTxDataJsonRpc(
    debouncedKeyword,
    debouncedKeyword.startsWith("0x") &&
      debouncedKeyword.length === 66 &&
      isHex(debouncedKeyword.slice(2))
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
  const blockRest = useBlockDataRest(
    Number(debouncedKeyword),
    isPosDecimal(debouncedKeyword) && !isFullTier
  );
  const { data: blockData, isFetching: blockFetching } = isFullTier
    ? blockApi
    : blockRest;

  /// /////////////////////////////////////////////////////
  //                         Proposal
  /// /////////////////////////////////////////////////////

  const { data: proposalApiData, isFetching: proposalApiIsFetching } =
    useProposalData(
      Number(debouncedKeyword),
      isGov && isId(debouncedKeyword) && isFullTier
    );
  const { data: proposalRestData, isFetching: proposalRestIsFetching } =
    useProposalDataRest(
      Number(debouncedKeyword),
      isGov && isId(debouncedKeyword) && !isFullTier
    );
  const [proposalData, proposalFetching] = isFullTier
    ? [proposalApiData, proposalApiIsFetching]
    : [
        proposalRestData
          ? {
              info: proposalRestData,
            }
          : undefined,
        proposalRestIsFetching,
      ];

  /// /////////////////////////////////////////////////////
  //                         Validator
  /// /////////////////////////////////////////////////////

  const validatorApi = useValidatorData(
    zValidatorAddr.parse(debouncedKeyword),
    isGov && validateValidatorAddress(debouncedKeyword) === null && isFullTier
  );
  const validatorRest = useValidatorDataRest(
    zValidatorAddr.parse(debouncedKeyword),
    isGov && validateValidatorAddress(debouncedKeyword) === null && !isFullTier
  );
  const { data: validatorData, isFetching: validatorFetching } = isFullTier
    ? validatorApi
    : validatorRest;

  /// /////////////////////////////////////////////////////
  //                     Osmosis Pool
  /// /////////////////////////////////////////////////////

  const { data: poolData, isFetching: poolFetching } = usePoolData(
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
    evmCodesFetching ||
    evmTxFetching ||
    txFetching ||
    blockFetching ||
    proposalFetching ||
    validatorFetching ||
    poolFetching
  )
    return {
      isLoading: true,
      results: [],
    };

  const results: SearchResult[] = [];

  if (nftCollectionData)
    results.push({
      metadata: {
        nft: {
          name: nftCollectionData.name,
        },
      },
      type: "NFT collection address",
      value: debouncedKeyword,
    });

  if (nftData)
    results.push({
      metadata: {
        nft: {
          collectionAddress: nftData.collectionAddress,
          name: nftData.tokenId,
        },
      },
      type: "NFT address",
      value: debouncedKeyword,
    });

  if (isAddr)
    results.push({
      metadata: {
        icns:
          icnsNamesByKeyword && icnsNamesByKeyword.names.length > 0
            ? {
                icnsNames: icnsNamesByKeyword,
              }
            : undefined,
        initiaUsername: iuNameByKeyword?.username ?? undefined,
      },
      type:
        contractData || evmCodes?.code ? "Contract address" : "Account address",
      value:
        isEvm && isHex20Bytes(debouncedKeyword)
          ? toChecksumAddress(debouncedKeyword)
          : debouncedKeyword,
    });

  // handle "move/" prefix hex module address
  if (addressByMovePrefixKeyword)
    results.push({
      type: "Account address",
      value: addressByMovePrefixKeyword,
    });

  if (icnsAddrByKeyword && icnsAddrByKeyword.address !== "")
    results.push({
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
      type:
        icnsAddrByKeyword.addressType === "contract_address"
          ? "Contract address"
          : "Account address",
      value: icnsAddrByKeyword.address,
    });

  if (iuAddrByKeyword && iuAddrByKeyword.address !== null)
    results.push({
      metadata: {
        initiaUsername: debouncedKeyword.endsWith(`.${bech32Prefix}`)
          ? debouncedKeyword
          : `${debouncedKeyword}.${bech32Prefix}`,
      },
      type: "Account address",
      value: iuAddrByKeyword.address,
    });

  if (moduleData)
    results.push({
      type: "Module path",
      value: debouncedKeyword,
    });

  if (codeData)
    results.push({
      type: "Code ID",
      value: debouncedKeyword,
    });

  if (txData)
    results.push({
      type: "Transaction hash",
      value: debouncedKeyword,
    });

  if (evmTxData)
    results.push({
      type: "EVM transaction hash",
      value: debouncedKeyword,
    });

  if (blockData)
    results.push({
      type: "Block",
      value: debouncedKeyword,
    });

  if (proposalData?.info)
    results.push({
      type: "Proposal ID",
      value: debouncedKeyword,
    });

  if (validatorData)
    results.push({
      type: "Validator address",
      value: debouncedKeyword,
    });

  if (poolData?.info)
    results.push({
      type: "Pool ID",
      value: debouncedKeyword,
    });

  return {
    isLoading: false,
    results,
  };
};
