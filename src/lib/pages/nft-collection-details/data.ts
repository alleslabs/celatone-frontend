import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useResourcesByAddress } from "lib/services/move";
import type { HexAddr32, Option } from "lib/types";

interface CollectionInfos {
  isUnlimited: boolean;
  supplies: { currentSupply: number; totalMinted: number; maxSupply?: number };
  royalty: number;
}

export const useCollectionInfos = (
  collectionAddress: HexAddr32
): { collectionInfos: Option<CollectionInfos>; isLoading: boolean } => {
  const formatAddress = useFormatAddresses();
  const { address } = formatAddress(collectionAddress);
  const { data: resourcesData, isFetching } = useResourcesByAddress(address);

  if (!resourcesData)
    return { collectionInfos: undefined, isLoading: isFetching };

  const { groupedByName } = resourcesData;
  const royalty = groupedByName.find((group) => group.group === "royalty");
  const collectionRoyalty = royalty
    ? JSON.parse(royalty.items[0].moveResource)
    : undefined;

  const collectionSupplyResource = groupedByName
    .find((group) => group.group === "collection")
    ?.items.find(
      (resource) =>
        resource.structTag === "0x1::collection::FixedSupply" ||
        resource.structTag === "0x1::collection::UnlimitedSupply"
    );

  const isUnlimited =
    collectionSupplyResource?.structTag === "0x1::collection::UnlimitedSupply";
  const supplyData = collectionSupplyResource
    ? JSON.parse(collectionSupplyResource.moveResource).data
    : undefined;
  return {
    collectionInfos: {
      isUnlimited,
      supplies: {
        currentSupply: Number(supplyData?.current_supply ?? 0),
        totalMinted: Number(supplyData?.total_minted ?? 0),
        maxSupply: supplyData?.max_supply
          ? Number(supplyData.max_supply)
          : undefined,
      },
      royalty: collectionRoyalty?.data?.royalty ?? 0,
    },
    isLoading: isFetching,
  };
};
