import {
  Accordion,
  Badge,
  Button,
  Flex,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { trackUseExpandAll } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceDetailCard } from "lib/components/resource";
import { ErrorFetching, EmptyState } from "lib/components/state";
import type { BechAddr, Option, ResourceGroupByAccount } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { ResourceLeftPanel } from "./ResourceLeftPanel";

interface ResourceSectionBodyProps {
  address: BechAddr;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  isLoading: boolean;
}

export const ResourceSectionBody = ({
  address,
  resourcesByOwner,
  isLoading,
}: ResourceSectionBodyProps) => {
  const router = useRouter();
  const isMobile = useMobile();

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
  if (!resourcesByOwner) return <ErrorFetching dataName="resources" />;
  if (!resourcesByOwner.length)
    return <EmptyState imageVariant="empty" message="No resources found" />;
  return (
    <>
      <GridItem>
        <ResourceLeftPanel
          address={address}
          resourcesByOwner={resourcesByOwner}
        />
      </GridItem>
      {selectedResource && (
        <GridItem>
          <Flex
            justifyContent="space-between"
            alignItems={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            pb={{ base: 4, md: 6 }}
            gap={4}
          >
            <Flex alignItems="center" w="full" className="copier-wrapper">
              <Heading as="h6" variant="h6" wordBreak="break-word">
                {selectedResource.account}::{selectedResource.group}
              </Heading>
              <Badge variant="primary" ml={2}>
                {selectedResource.items.length}
              </Badge>
              <Copier
                display={!isMobile ? "none" : "inline"}
                type="resource"
                value={`${selectedResource.account}::${selectedResource.group}`}
                copyLabel="Copied!"
              />
            </Flex>
            <Button
              variant={{ base: "ghost-primary", md: "outline-primary" }}
              minW={{ base: "auto", md: 32 }}
              size="sm"
              rightIcon={
                <CustomIcon
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                  boxSize={3}
                />
              }
              onClick={() => {
                trackUseExpandAll(
                  expandedIndexes.length ? "collapse" : "expand",
                  "account detail resources Tab"
                );
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
        </GridItem>
      )}
    </>
  );
};
