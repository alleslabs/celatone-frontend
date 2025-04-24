import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import type { Addr, ResourceGroup, ResourceGroupByAccount } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useMoveConfig,
} from "lib/app-provider";
import { zHexAddr } from "lib/types";
import { truncate } from "lib/utils";

import { getAccountResourcesRest } from "./rest";

export interface ResourcesByAddressReturn {
  groupedByName: ResourceGroup[];
  groupedByOwner: ResourceGroupByAccount[];
  totalCount: number;
}

export const useResourcesByAddressRest = (
  address: Addr
): UseQueryResult<ResourcesByAddressReturn> => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { enabled } = useMoveConfig({ shouldRedirect: false });

  const queryFn: QueryFunction<ResourcesByAddressReturn> = () =>
    getAccountResourcesRest(restEndpoint, address).then((resources) => {
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
            account: zHexAddr.parse(ownerName),
            displayName: `${truncate(ownerName)}::${groupName}`,
            group: groupName,
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
            account: zHexAddr.parse(accountName),
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
    [CELATONE_QUERY_KEYS.RESOURCES_BY_ADDRESS, restEndpoint, address],
    queryFn,
    { enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};
