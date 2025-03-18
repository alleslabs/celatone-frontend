import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useResourcesByAddressRest } from "lib/services/move/resource";
import type { HexAddr, HexAddr32, Option } from "lib/types";

interface SupplyData {
  current_supply: string;
  total_minted: string;
  max_supply?: string;
}

interface RoyaltyData {
  payee_address: HexAddr;
  royalty: string;
}

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
  const { data: resourcesData, isFetching } =
    useResourcesByAddressRest(address);

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
      royalty: Number(royaltyData?.royalty ?? 0) * 100,
    },
    isLoading: isFetching,
  };
};
