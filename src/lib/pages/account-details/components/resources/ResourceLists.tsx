import { Flex, SimpleGrid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { TableTitle, ViewMore } from "lib/components/table";
import {
  useAccountResources,
  type IndexedResource,
} from "lib/services/move/resourceService";
import type { HumanAddr } from "lib/types";
import { truncate } from "lib/utils";

export interface ResourceGroup {
  group: string;
  items: IndexedResource[];
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
  const { data: resourcesData = [] } = useAccountResources({
    address,
  });
  const resources = resourcesData as IndexedResource[];

  const restructuredResources = resources.reduce<Record<string, ResourceGroup>>(
    (acc, resource) => {
      const [ownerName, groupName] = resource.structTag.split("::");

      const name = `${truncate(ownerName)}::${groupName}`;
      const groupResources = acc[name] ?? {};
      const items = groupResources?.items ?? [];
      items.push(resource);

      return {
        ...acc,
        [name]: {
          group: name,
          items,
        },
      };
    },
    {} as Record<string, ResourceGroup>
  );
  const groupedResources = Object.values(restructuredResources);

  if (!resources) return <Loading />;
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
              <ResourceCard name={item.group} amount={item.items.length} />
            ))}
          </SimpleGrid>
          {onViewMore && <ViewMore onClick={onViewMore} />}
        </>
      )}
    </Flex>
  );
};
