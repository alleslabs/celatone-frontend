import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useResourcesByAddress } from "lib/services/move";
import type { HexAddr, Option } from "lib/types";
import { snakeToCamel } from "lib/utils";

interface CollectinInfos {
  isUnlimited: boolean;
  supplies: { currentSupply: number; totalMinted: number; maxSupply?: number };
  royalty: number;
}

export const useCollectionInfos = (
  collectionAddress: HexAddr
): { collectionInfos: Option<CollectinInfos>; isLoading: boolean } => {
  const formatAddress = useFormatAddresses();
  const { address } = formatAddress(collectionAddress);
  const { data: resourcesData, isFetching } = useResourcesByAddress(address);

  if (!resourcesData)
    return { collectionInfos: undefined, isLoading: isFetching };

  const { groupedByName } = resourcesData;
  const resources = groupedByName
    .filter((resource) => resource.group === "collection")
    .map((resource) => resource.items)
    .flat();

  const collectionSupplies = resources.filter(
    (resource) => !resource.structTag?.includes("0x1::collection::Collection")
  );

  const royalty = groupedByName.find((group) => group.group === "royalty");

  const collectionRoyalty =
    royalty && JSON.parse(royalty.items[0].moveResource);

  const parsed = collectionSupplies
    .map((resource) => {
      try {
        return JSON.parse(resource.moveResource);
      } catch {
        return {};
      }
    })
    .map((data) => data?.data);

  const [type] = collectionSupplies;
  const isUnlimited = type?.structTag === "0x1::collection::UnlimitedSupply";

  const [supplyData] = parsed;
  const supplies = snakeToCamel(supplyData);
  return {
    collectionInfos: {
      isUnlimited,
      supplies,
      royalty: collectionRoyalty?.data?.royalty ?? 0,
    },
    isLoading: isFetching,
  };
};
