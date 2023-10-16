import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr } from "lib/types";
import { truncate } from "lib/utils";

import type { ResourceGroup } from "./types";

interface ResourcesListsProps {
  address: HumanAddr;
  onViewMore?: () => void;
}

export const ResourceLists = ({ address, onViewMore }: ResourcesListsProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { data: resources, isLoading } = useAccountResources({
    address,
  });

  const handleSelectResource = useCallback(
    (resource: ResourceGroup) => {
      navigate({
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          accountAddress: address,
          tab: "resources",
          account: resource.account,
          selected: resource.group,
        },
        options: {
          shallow: true,
        },
      });
    },
    [address, navigate]
  );
  if (isLoading) return <Loading />;
  if (!resources) return <ErrorFetching />;
  if (resources.length === 0)
    return <EmptyState imageVariant="empty" message="No resources found." />;

  const restructuredResources = resources.reduce<Record<string, ResourceGroup>>(
    (acc, resource) => {
      const [accountName, groupName] = resource.structTag.split("::");
      const groupResources = acc[groupName] ?? {};
      const items = groupResources?.items ?? [];
      items.push(resource);

      return {
        ...acc,
        [groupName]: {
          displayName: `${truncate(accountName)}::${groupName}`,
          account: accountName,
          group: groupName,
          items,
        },
      };
    },
    {} as Record<string, ResourceGroup>
  );
  const groupedResources = Object.values(restructuredResources);

  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      {isMobileOverview ? (
        <Flex
          justify="space-between"
          w="full"
          bg="gray.900"
          borderRadius="8px"
          p={4}
          onClick={onViewMore}
        >
          <TableTitle title="Resources" count={resources.length} mb={0} />
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          <TableTitle
            helperText="Resources stored in this account"
            title="Resources"
            count={resources.length}
          />
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
            {groupedResources.slice(0, 8).map((item) => (
              <ResourceCard
                key={item.displayName}
                name={item.displayName}
                amount={item.items.length}
                onClick={() => handleSelectResource(item)}
              />
            ))}
          </SimpleGrid>
          {onViewMore && groupedResources.length > 8 && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Flex>
  );
};
