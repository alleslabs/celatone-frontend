import type { CollectionByCollectionAddressResponse } from "lib/services/types";
import type {
  BechAddr32,
  HexAddr,
  HexAddr32,
  Nullish,
  Option,
} from "lib/types";

import { useEvmConfig, useMoveConfig, useWasmConfig } from "lib/app-provider";
import { useResourcesByAddressRest } from "lib/services/move/resource";
import { useNftRoyaltyInfoEvmSequencer } from "lib/services/nft";
import {
  useNftCollectionByCollectionAddress,
  useNftCollectionInfosWasm,
} from "lib/services/nft-collection";
import { isUndefined } from "lodash";

interface SupplyData {
  current_supply: string;
  max_supply?: string;
  total_minted: string;
}

interface RoyaltyData {
  payee_address: HexAddr;
  royalty: string;
}

interface CollectionInfos {
  isUnlimited: boolean;
  royalty: number;
  supplies: {
    currentSupply: number;
    maxSupply: Option<number>;
    totalBurned: number;
    totalMinted: number;
  };
}

interface CollectionInfosResponse {
  collectionInfos?: CollectionInfos;
  isLoading: boolean;
}

interface CollectionDataResponse extends CollectionInfosResponse {
  collection: Nullish<CollectionByCollectionAddressResponse>;
}

// MOVE
const useNftCollectionInfosMove = (
  collectionAddress: BechAddr32
): CollectionInfosResponse => {
  const { data: resourcesData, isFetching } =
    useResourcesByAddressRest(collectionAddress);

  if (!resourcesData)
    return { collectionInfos: undefined, isLoading: isFetching };

  const collectionSupplyResource = resourcesData.groupedByName
    .find((group) => group.group === "collection")
    ?.items.find(
      (resource) =>
        resource.structTag === "0x1::collection::FixedSupply" ||
        resource.structTag === "0x1::collection::UnlimitedSupply"
    );
  const isUnlimited =
    collectionSupplyResource?.structTag === "0x1::collection::UnlimitedSupply";
  const supplyData: Option<SupplyData> = collectionSupplyResource
    ? JSON.parse(collectionSupplyResource.moveResource).data
    : undefined;

  const collectionRoyaltyResource = resourcesData.groupedByName
    .find((group) => group.group === "royalty")
    ?.items.find((resource) => resource.structTag === "0x1::royalty::Royalty");
  const royaltyData: Option<RoyaltyData> = collectionRoyaltyResource
    ? JSON.parse(collectionRoyaltyResource.moveResource).data
    : undefined;

  const totalMinted = Number(supplyData?.total_minted ?? 0);
  const currentSupply = Number(supplyData?.current_supply ?? 0);
  const totalBurned = totalMinted - currentSupply;

  return {
    collectionInfos: {
      isUnlimited,
      royalty: Number(royaltyData?.royalty ?? 0) * 100,
      supplies: {
        currentSupply,
        maxSupply: !isUndefined(supplyData?.max_supply)
          ? Number(supplyData.max_supply)
          : undefined,
        totalBurned,
        totalMinted,
      },
    },
    isLoading: isFetching,
  };
};

export const useNftCollectionData = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
): CollectionDataResponse => {
  const { enabled: isMoveEnabled } = useMoveConfig({ shouldRedirect: false });
  const { enabled: isWasmEnabled } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isEvmEnabled } = useEvmConfig({ shouldRedirect: false });

  // ############################################################
  // ########################## Base ############################
  // ############################################################
  const { data: collection, isLoading: isCollectionLoading } =
    useNftCollectionByCollectionAddress(
      collectionAddressBech,
      collectionAddressHex
    );

  // ############################################################
  // ###################### VM Specific #########################
  // ############################################################
  const {
    collectionInfos: collectionInfosMove,
    isLoading: isCollectionInfosMoveLoading,
  } = useNftCollectionInfosMove(collectionAddressBech);

  const {
    data: collectionInfosWasm,
    isFetching: isCollectionInfosWasmLoading,
  } = useNftCollectionInfosWasm(collectionAddressBech);

  const {
    data: collectionRoyaltyInfoEvm,
    isFetching: isCollectionInfosEvmLoading,
  } = useNftRoyaltyInfoEvmSequencer(
    collectionAddressHex,
    collectionAddressBech
  );

  if (isMoveEnabled)
    return {
      collection,
      collectionInfos: collectionInfosMove,
      isLoading: isCollectionLoading || isCollectionInfosMoveLoading,
    };

  const collectionInfosDefault: CollectionInfos = {
    isUnlimited: false,
    royalty: 0,
    supplies: {
      currentSupply: collection?.currentSupply ?? 0,
      maxSupply: undefined,
      totalBurned: 0,
      totalMinted: 0,
    },
  };

  if (isWasmEnabled)
    return {
      collection: collection
        ? {
            ...collection,
            description:
              collectionInfosWasm?.description || collection.description,
          }
        : null,
      collectionInfos: collectionInfosWasm
        ? {
            ...collectionInfosDefault,
            royalty: Number(collectionInfosWasm.royaltyInfo?.share ?? 0) * 100,
          }
        : undefined,
      isLoading: isCollectionLoading || isCollectionInfosWasmLoading,
    };

  if (isEvmEnabled) {
    return {
      collection,
      collectionInfos: !isUndefined(collectionRoyaltyInfoEvm)
        ? {
            ...collectionInfosDefault,
            royalty: collectionRoyaltyInfoEvm,
          }
        : undefined,
      isLoading: isCollectionLoading || isCollectionInfosEvmLoading,
    };
  }

  throw new Error(
    "Required at least one VM to get collection data (useNftCollectionData)"
  );
};
