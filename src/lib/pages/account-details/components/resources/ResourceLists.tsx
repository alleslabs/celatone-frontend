import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr, InternalResource } from "lib/types";
import { truncate } from "lib/utils";

export interface ResourceGroup {
  group: string;
  account: string;
  displayName: string;
  items: InternalResource[];
}

export interface ResourceGroupByAccount {
  owner: string;
  resources: Record<string, ResourceGroup>;
}

interface ResourcesListsProps {
  onViewMore?: () => void;
  totalAsset: number;
  address: HumanAddr;
}

const ResourceTitle = ({
  onViewMore,
  totalAsset,
}: {
  onViewMore: ResourcesListsProps["onViewMore"];
  totalAsset: number;
}) => {
  const isMobile = useMobile();
  if (!isMobile && !onViewMore) return null;
  if (isMobile && onViewMore)
    return (
      <Flex
        justify="space-between"
        w="full"
        bg="gray.900"
        borderRadius="8px"
        p={4}
        onClick={onViewMore}
      >
        <TableTitle title="Resources" count={totalAsset} mb={0} />
        <CustomIcon name="chevron-right" color="gray.600" />
      </Flex>
    );
  return (
    <TableTitle
      helperText="Resources stored in this account"
      title="Resources"
      count={totalAsset}
    />
  );
};
export const ResourceLists = ({
  onViewMore,
  totalAsset,
  address,
}: ResourcesListsProps) => {
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

  return (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <ResourceTitle onViewMore={onViewMore} totalAsset={totalAsset} />
      {!isMobile && (
        <>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
            {groupedResources.slice(0, 8).map((item) => (
              <ResourceCard
                name={item.displayName}
                amount={item.items.length}
                onClick={() => handleSelectResource(item)}
              />
            ))}
          </SimpleGrid>
          {onViewMore && <ViewMore onClick={onViewMore} />}
        </>
      )}
    </Flex>
  );
};
