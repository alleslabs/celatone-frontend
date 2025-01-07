import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useLcdEndpoint,
  useMoveConfig,
} from "lib/app-provider";
import type {
  Addr,
  HexAddr,
  ResourceGroup,
  ResourceGroupByAccount,
} from "lib/types";
import { truncate } from "lib/utils";

import { getAccountResourcesLcd } from "./lcd";

export interface ResourcesByAddressReturn {
  groupedByName: ResourceGroup[];
  groupedByOwner: ResourceGroupByAccount[];
  totalCount: number;
}

export const useResourcesByAddressLcd = (
  address: Addr
): UseQueryResult<ResourcesByAddressReturn> => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useMoveConfig({ shouldRedirect: false });

  const queryFn: QueryFunction<ResourcesByAddressReturn> = () =>
    getAccountResourcesLcd(endpoint, address).then((resources) => {
      const groupedByOwner = resources.items.reduce<
        Record<string, ResourceGroupByAccount>
      >((acc, resource) => {
        const [ownerName, groupName] = resource.structTag.split("::");

        const ownerResources = acc[ownerName]?.resources ?? [];
        const groupResourcesIndex = ownerResources.findIndex(
          (ownerResource) => ownerResource.group === groupName
        );
        if (groupResourcesIndex === -1)
          ownerResources.push({
            account: ownerName as HexAddr,
            displayName: `${truncate(ownerName)}::${groupName}`,
            group: groupName,
            items: [resource],
          });
        else ownerResources[groupResourcesIndex].items.push(resource);

        return {
          ...acc,
          [ownerName]: {
            owner: ownerName as HexAddr,
            resources: ownerResources,
          },
        };
      }, {});

      const groupedByName = resources.items.reduce<
        Record<string, ResourceGroup>
      >((acc, resource) => {
        const [accountName, groupName] = resource.structTag.split("::");
        const resourceKey = `${accountName}::${groupName}`;

        const groupResources = acc[resourceKey] ?? {};
        const items = groupResources?.items ?? [];
        items.push(resource);

        return {
          ...acc,
          [resourceKey]: {
            account: accountName as HexAddr,
            displayName: `${truncate(accountName)}::${groupName}`,
            group: groupName,
            items,
          },
        };
      }, {});

      return {
        groupedByName: Object.values(groupedByName),
        groupedByOwner: Object.values(groupedByOwner),
        totalCount: resources.total,
      };
    });
  return useQuery(
    [CELATONE_QUERY_KEYS.RESOURCES_BY_ADDRESS, endpoint, address],
    queryFn,
    { enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};
