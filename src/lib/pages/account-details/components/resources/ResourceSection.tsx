import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { ResourceDetailCard } from "lib/components/resource/ResourceDetailCard";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr } from "lib/types";
import { getFirstQueryParam, truncate } from "lib/utils";

import type { ResourceGroup, ResourceGroupByAccount } from "./ResourceLists";

interface ResourceSectionProps {
  address: HumanAddr;
}
export const ResourceSection = ({ address }: ResourceSectionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const selectedAccountParam = getFirstQueryParam(router.query.account);
  const selectedNameParam = getFirstQueryParam(router.query.selected);

  const handleSelectResource = useCallback(
    (
      account: ResourceGroupByAccount["owner"],
      resource: ResourceGroup["group"]
    ) => {
      if (account === selectedAccountParam && resource === selectedNameParam)
        return;
      navigate({
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          accountAddress: address,
          tab: "resources",
          account,
          selected: resource,
        },
        options: {
          shallow: true,
        },
      });
    },
    [selectedNameParam, selectedAccountParam, address, navigate]
  );

  const { data: resources, isLoading } = useAccountResources({
    address,
  });

  if (isLoading) return <Loading />;
  if (!resources) return <ErrorFetching />;
  if (resources.length === 0)
    return <EmptyState imageVariant="empty" message="No resources found." />;

  const sortedResource = resources.reduce<
    Record<string, ResourceGroupByAccount>
  >((acc, resource) => {
    const [ownerName, groupName] = resource.structTag.split("::");

    const ownerResources = acc[ownerName]?.resources ?? {};
    const groupResources = ownerResources[groupName] ?? {};
    const items = groupResources?.items ?? [];

    items.push(resource);

    return {
      ...acc,
      [ownerName]: {
        owner: ownerName,
        resources: {
          ...ownerResources,
          [groupName]: {
            group: groupName,
            account: ownerName,
            displayName: `${truncate(ownerName)}::${groupName}`,
            items,
          },
        },
      },
    };
  }, {} as Record<string, ResourceGroupByAccount>);

  const groupedResources = Object.values(sortedResource);

  const selectedGroup =
    groupedResources.find((item) => item.owner === selectedAccountParam) ??
    groupedResources[0];
  const selectedGroupArray = Object.values(selectedGroup.resources);

  const selectedResources =
    selectedGroupArray.find((item) => item.group === selectedNameParam) ??
    selectedGroupArray[0];

  const selectedIndex = !selectedAccountParam
    ? 0
    : groupedResources.findIndex((item) => item.owner === selectedAccountParam);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  return (
    <Flex direction="column" mt={8}>
      <Flex>
        <TableTitle
          helperText="Resources stored in this account"
          title="Resources"
          count={12}
        />
      </Flex>
      <Flex
        gap={6}
        flexDirection={{ base: "column", md: "row" }}
        position="relative"
      >
        <Flex minW={{ base: "full", md: 80 }}>
          <Accordion allowMultiple defaultIndex={[selectedIndex]} width="full">
            {groupedResources.map((item) => (
              <AccordionItem mb={4} key={item.owner}>
                <AccordionButton>
                  <Flex p={4} justifyContent="space-between" w="full">
                    <Text variant="body1" fontWeight={600}>
                      {truncate(item.owner)}
                    </Text>
                    <CustomIcon name="chevron-down" color="gray.600" />
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  <Flex direction="column" gap={3}>
                    {Object.values(item.resources).map((subitem) => (
                      <ResourceCard
                        hasBorder
                        name={subitem.group}
                        key={subitem.group}
                        amount={subitem.items.length}
                        isSelected={selectedResources.group === subitem.group}
                        onClick={() =>
                          handleSelectResource(item.owner, subitem.group)
                        }
                      />
                    ))}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
        <Flex direction="column" w="full">
          <Flex justifyContent="space-between" alignItems="center" pb={6}>
            <Flex alignItems="center">
              <Heading as="h6" variant="h6">
                {selectedGroup.owner}::{selectedResources.group}
              </Heading>
              <Badge variant="primary" ml={2}>
                {selectedResources.items.length}
              </Badge>
            </Flex>
            <Button
              variant="outline-primary"
              size="sm"
              rightIcon={
                <CustomIcon
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                  boxSize={3}
                />
              }
              onClick={() => {
                setExpandedIndexes((prev) =>
                  !prev.length
                    ? Array.from(Array(selectedResources.items.length).keys())
                    : []
                );
              }}
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
          <Accordion
            allowMultiple
            width="full"
            index={expandedIndexes}
            onChange={updateExpandedIndexes}
          >
            {selectedResources.items.map((item) => (
              <ResourceDetailCard resourceData={item} key={item.structTag} />
            ))}
          </Accordion>
        </Flex>
      </Flex>
    </Flex>
  );
};
