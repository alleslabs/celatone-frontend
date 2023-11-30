import { Accordion, Badge, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceDetailCard } from "lib/components/resource";
import { EmptyState } from "lib/components/state";
import type { HumanAddr, Option, ResourceGroupByAccount } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { ResourceLeftPanel } from "./ResourceLeftPanel";

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

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const selectedAccountParam = getFirstQueryParam(
    router.query.account,
    resourcesByOwner?.[0]?.owner
  );
  const selectedNameParam = getFirstQueryParam(
    router.query.selected,
    resourcesByOwner?.[0]?.resources[0]?.group
  );

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  useEffect(() => {
    const resourcesLength = resourcesByOwner
      ?.find((resource) => resource.owner === selectedAccountParam)
      ?.resources?.find((resource) => resource.group === selectedNameParam)
      ?.items.length;

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

  const selectedResource = resourcesByOwner
    ?.find((resource) => resource.owner === selectedAccountParam)
    ?.resources?.find((resource) => resource.group === selectedNameParam);
  return (
    <>
      <ResourceLeftPanel
        address={address}
        resourcesByOwner={resourcesByOwner}
      />
      {selectedResource && (
        <Flex direction="column" w="full">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            pb={6}
            gap={12}
          >
            <Flex alignItems="center">
              <Heading as="h6" variant="h6" wordBreak="break-word">
                {selectedResource.account}::{selectedResource.group}
              </Heading>
              <Badge variant="primary" ml={2}>
                {selectedResource.items.length}
              </Badge>
            </Flex>
            <Button
              variant="outline-primary"
              minW={32}
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
                    ? Array.from(Array(selectedResource.items.length).keys())
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
            {selectedResource.items.map((item) => (
              <ResourceDetailCard
                resourceData={item}
                key={`${item.structTag}`}
              />
            ))}
          </Accordion>
        </Flex>
      )}
    </>
  );
};
