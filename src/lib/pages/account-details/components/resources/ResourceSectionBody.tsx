import { Accordion, Badge, Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceDetailCard } from "lib/components/resource";
import { ErrorFetching, EmptyState } from "lib/components/state";
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

  const selectedResource = resourcesByOwner
    ?.find((resource) => resource.owner === selectedAccountParam)
    ?.resources?.find((resource) => resource.group === selectedNameParam);
  useEffect(() => {
    setExpandedIndexes(selectedResource?.items.length === 1 ? [0] : []);
  }, [resourcesByOwner, selectedResource]);

  if (isLoading) return <Loading />;
  if (!resourcesByOwner)
    return (
      <ErrorFetching message="There is an error during fetching resources." />
    );
  if (!resourcesByOwner.length)
    return <EmptyState imageVariant="empty" message="No resources found" />;

  return (
    <>
      <ResourceLeftPanel
        address={address}
        resourcesByOwner={resourcesByOwner}
      />
      {selectedResource && (
        <Box w="full">
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
            onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          >
            {selectedResource.items.map((item) => (
              <ResourceDetailCard
                key={`${item.structTag}`}
                resourceData={item}
              />
            ))}
          </Accordion>
        </Box>
      )}
    </>
  );
};
