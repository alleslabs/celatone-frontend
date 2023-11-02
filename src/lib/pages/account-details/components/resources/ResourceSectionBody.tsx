import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { truncate } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard, ResourceDetailCard } from "lib/components/resource";
import { EmptyState } from "lib/components/state";
import type {
  HumanAddr,
  Option,
  ResourceGroup,
  ResourceGroupByAccount,
} from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface ResourceSectionBodyProps {
  address: HumanAddr;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  isLoading: boolean;
}

export const ResourceSectionBody = ({
  address,
  resourcesByOwner,
  isLoading,
}: ResourceSectionBodyProps) => {
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
        replace: true,
        options: {
          shallow: true,
        },
      });
    },
    [selectedNameParam, selectedAccountParam, address, navigate]
  );

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  useEffect(() => {
    const resourcesLength = resourcesByOwner?.find(
      (resource) => resource.owner === selectedAccountParam
    )?.resources?.[selectedNameParam].items.length;

    if (resourcesLength === 1) {
      setExpandedIndexes([0]);
    } else {
      setExpandedIndexes([]);
    }
  }, [resourcesByOwner, selectedNameParam, selectedAccountParam]);

  if (isLoading) return <Loading />;
  if (!resourcesByOwner) return <ErrorFetching />;
  if (!resourcesByOwner.length)
    return <EmptyState imageVariant="empty" message="No resources found" />;

  const selectedIndex = !selectedAccountParam
    ? 0
    : resourcesByOwner.findIndex((item) => item.owner === selectedAccountParam);
  const selectedGroup = resourcesByOwner[selectedIndex];
  const selectedGroupArray = Object.values(selectedGroup.resources);
  const selectedResources =
    selectedGroupArray.find((item) => item.group === selectedNameParam) ??
    selectedGroupArray[0];
  return (
    <>
      <Flex minW={{ base: "full", md: 80 }}>
        <Accordion allowMultiple defaultIndex={[selectedIndex]} width="full">
          {resourcesByOwner.map((item) => (
            <AccordionItem mb={4} key={item.owner}>
              <AccordionButton>
                <Flex p={4} justifyContent="space-between" w="full">
                  <Text variant="body1" fontWeight={600}>
                    {truncate(item.owner)}
                  </Text>
                  <AccordionIcon color="gray.600" />
                </Flex>
              </AccordionButton>
              <AccordionPanel>
                <Flex direction="column" gap={3} maxW={80}>
                  {Object.values(item.resources).map((subitem) => (
                    <ResourceCard
                      key={subitem.group}
                      name={subitem.group}
                      amount={subitem.items.length}
                      isSelected={selectedResources.group === subitem.group}
                      onClick={() =>
                        handleSelectResource(item.owner, subitem.group)
                      }
                      hasBorder
                    />
                  ))}
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
      <Flex direction="column" w="full">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          pb={6}
          gap={12}
        >
          <Flex alignItems="center">
            <Heading as="h6" variant="h6" wordBreak="break-word">
              {selectedGroup.owner}::{selectedResources.group}
            </Heading>
            <Badge variant="primary" ml={2}>
              {selectedResources.items.length}
            </Badge>
          </Flex>
          <Button
            variant="outline-primary"
            minW={28}
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
    </>
  );
};
