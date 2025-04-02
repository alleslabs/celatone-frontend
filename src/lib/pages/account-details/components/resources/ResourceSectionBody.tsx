import type { BechAddr, Option, ResourceGroupByAccount } from "lib/types";

import {
  Accordion,
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { trackUseExpandAll } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceDetailCard } from "lib/components/resource";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useEffect, useState } from "react";

import { ResourceLeftPanel } from "./ResourceLeftPanel";

interface ResourceSectionBodyProps {
  address: BechAddr;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  isLoading: boolean;
  selectedAccountParam: Option<string>;
  selectedGroupNameParam: Option<string>;
}

export const ResourceSectionBody = ({
  address,
  resourcesByOwner,
  isLoading,
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
            direction={{ base: "column", md: "row" }}
            gap={4}
            justifyContent="space-between"
            pb={{ base: 4, md: 6 }}
          >
            <Flex className="copier-wrapper" alignItems="center" w="full">
              <Heading as="h6" variant="h6" wordBreak="break-word">
                {selectedResource.account}::{selectedResource.group}
              </Heading>
              <Badge ml={2} variant="primary">
                {selectedResource.items.length}
              </Badge>
              <Copier
                copyLabel="Copied!"
                display={!isMobile ? "none" : "inline"}
                type="resource"
                value={`${selectedResource.account}::${selectedResource.group}`}
              />
            </Flex>
            <Button
              minW={{ base: "auto", md: 32 }}
              rightIcon={
                <CustomIcon
                  boxSize={3}
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                />
              }
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
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
          <Accordion
            allowMultiple
            index={expandedIndexes}
            width="full"
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
