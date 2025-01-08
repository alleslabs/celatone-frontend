import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useResourcesByAddressLcd } from "lib/services/move/resource";
import type { HexAddr, HexAddr32, Option } from "lib/types";

interface CollectionInfos {
  isUnlimited: boolean;
  royalty: number;
  supplies: { currentSupply: number; maxSupply?: number; totalMinted: number };
}

interface RoyaltyData {
  payee_address: HexAddr;
  royalty: string;
}

interface SupplyData {
  current_supply: string;
  max_supply?: string;
  total_minted: string;
}

export const useCollectionInfos = (
  collectionAddress: HexAddr32
): { collectionInfos: Option<CollectionInfos>; isLoading: boolean } => {
  const formatAddress = useFormatAddresses();
  const { address } = formatAddress(collectionAddress);
  const { data: resourcesData, isFetching } = useResourcesByAddressLcd(address);

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
      royalty: Number(royaltyData?.royalty ?? 0) * 100,
      supplies: {
        currentSupply: Number(supplyData?.current_supply ?? 0),
        maxSupply: supplyData?.max_supply
          ? Number(supplyData.max_supply)
          : undefined,
        totalMinted: Number(supplyData?.total_minted ?? 0),
      },
    },
    isLoading: isFetching,
  };
};
