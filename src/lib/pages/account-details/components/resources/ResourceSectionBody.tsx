import {
  Accordion,
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { trackUseExpandAll } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceDetailCard } from "lib/components/resource";
import { EmptyState, ErrorFetching } from "lib/components/state";
import type { BechAddr, Option, ResourceGroupByAccount } from "lib/types";

import { ResourceLeftPanel } from "./ResourceLeftPanel";

interface ResourceSectionBodyProps {
  address: BechAddr;
  isLoading: boolean;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  selectedAccountParam: Option<string>;
  selectedGroupNameParam: Option<string>;
}

export const ResourceSectionBody = ({
  address,
  isLoading,
  resourcesByOwner,
  selectedAccountParam,
  selectedGroupNameParam,
}: ResourceSectionBodyProps) => {
  const isMobile = useMobile();

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const selectedAccount = selectedAccountParam ?? resourcesByOwner?.[0]?.owner;
  const selectedGroupName =
    selectedGroupNameParam ?? resourcesByOwner?.[0]?.resources[0]?.group;

  const selectedResource = resourcesByOwner
    ?.find((resource) => resource.owner === selectedAccount)
    ?.resources?.find((resource) => resource.group === selectedGroupName);

  useEffect(() => {
    setExpandedIndexes(selectedResource?.items.length === 1 ? [0] : []);
  }, [resourcesByOwner, selectedResource]);

  if (isLoading) return <Loading />;
  if (!resourcesByOwner) return <ErrorFetching dataName="resources" />;
  if (!resourcesByOwner.length)
    return <EmptyState imageVariant="empty" message="No resources found" />;
  return (
    <Grid gap={6} templateColumns={{ base: "1fr", md: "320px 1fr" }}>
      <GridItem>
        <ResourceLeftPanel
          address={address}
          resourcesByOwner={resourcesByOwner}
          selectedAccount={selectedAccount}
          selectedGroupName={selectedGroupName}
        />
      </GridItem>
      {selectedResource && (
        <GridItem>
          <Flex
            alignItems={{ base: "start", md: "center" }}
            gap={4}
            pb={{ base: 4, md: 6 }}
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Flex className="copier-wrapper" alignItems="center" w="full">
              <Heading as="h6" variant="h6" wordBreak="break-word">
                {selectedResource.account}::{selectedResource.group}
              </Heading>
              <Badge ml={2} variant="primary">
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
              minW={{ base: "auto", md: 32 }}
              size="sm"
              variant={{ base: "ghost-primary", md: "outline-primary" }}
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
              rightIcon={
                <CustomIcon
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                  boxSize={3}
                />
              }
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
          <Accordion
            width="full"
            index={expandedIndexes}
            allowMultiple
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
    </Grid>
  );
};
