import type { CollectionByCollectionAddressResponse } from "lib/services/types";
import type {
  BechAddr32,
  HexAddr,
  HexAddr32,
  Nullable,
  Option,
} from "lib/types";

import { useMoveConfig } from "lib/app-provider";
import { useResourcesByAddressRest } from "lib/services/move/resource";
import { useNftCollectionByCollectionAddress } from "lib/services/nft-collection";
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
  collection: Nullable<CollectionByCollectionAddressResponse>;
}

// MOVE
const useCollectionInfosMove = (
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

export const useCollectionData = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
): CollectionDataResponse => {
  const { enabled: isMoveEnabled } = useMoveConfig({ shouldRedirect: false });

  const { data: collection = null, isLoading: isCollectionLoading } =
    useNftCollectionByCollectionAddress(
      collectionAddressBech,
      collectionAddressHex
    );

  const {
    collectionInfos: collectionInfosMove,
    isLoading: isCollectionInfosMoveLoading,
  } = useCollectionInfosMove(collectionAddressBech);

  if (isMoveEnabled)
    return {
      collection,
      collectionInfos: collectionInfosMove,
      isLoading: isCollectionLoading || isCollectionInfosMoveLoading,
    };

  // TODO: implement WASM and EVM collection data

  return {
    collection,
    collectionInfos: {
      isUnlimited: false,
      royalty: 0,
      supplies: {
        currentSupply: collection?.currentSupply ?? 0,
        maxSupply: undefined,
        totalBurned: 0,
        totalMinted: 0,
      },
    },
    isLoading: isCollectionLoading,
  };
};
