import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useMoveConfig,
} from "lib/app-provider";
import type { Addr, ResourceGroup, ResourceGroupByAccount } from "lib/types";
import { zHexAddr } from "lib/types";
import { truncate } from "lib/utils";

import { getAccountResourcesLcd } from "./lcd";

export interface ResourcesByAddressReturn {
  groupedByOwner: ResourceGroupByAccount[];
  groupedByName: ResourceGroup[];
  totalCount: number;
}

export const useResourcesByAddressLcd = (
  address: Addr
): UseQueryResult<ResourcesByAddressReturn> => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const { enabled } = useMoveConfig({ shouldRedirect: false });

  const queryFn: QueryFunction<ResourcesByAddressReturn> = () =>
    getAccountResourcesLcd(lcdEndpoint, address).then((resources) => {
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
            group: groupName,
            account: zHexAddr.parse(ownerName),
            displayName: `${truncate(ownerName)}::${groupName}`,
            items: [resource],
          });
        else ownerResources[groupResourcesIndex].items.push(resource);

        return {
          ...acc,
          [ownerName]: {
            owner: zHexAddr.parse(ownerName),
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
            displayName: `${truncate(accountName)}::${groupName}`,
            account: zHexAddr.parse(accountName),
            group: groupName,
            items,
          },
        };
      }, {});

      return {
        totalCount: resources.total,
        groupedByOwner: Object.values(groupedByOwner),
        groupedByName: Object.values(groupedByName),
      };
    });
  return useQuery(
    [CELATONE_QUERY_KEYS.RESOURCES_BY_ADDRESS, lcdEndpoint, address],
    queryFn,
    { enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};
