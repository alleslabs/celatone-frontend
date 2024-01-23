import { Flex, Grid } from "@chakra-ui/react";

import { TableTitle } from "lib/components/table";
import type { BechAddr, ResourceGroupByAccount, Option } from "lib/types";

import { ResourceSectionBody } from "./ResourceSectionBody";

interface ResourceSectionProps {
  address: BechAddr;
  totalCount: Option<number>;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  isLoading: boolean;
}

export const ResourceSection = ({
  address,
  totalCount,
  resourcesByOwner,
  isLoading,
}: ResourceSectionProps) => (
  <Flex direction="column" mt={8}>
    <TableTitle
      helperText="Resources stored in this account"
      title="Resources"
      count={totalCount}
    />
    <Grid gap={6} templateColumns={{ base: "1fr", md: "320px 1fr" }}>
      <ResourceSectionBody
        address={address}
        resourcesByOwner={resourcesByOwner}
        isLoading={isLoading}
      />
    </Grid>
  </Flex>
);
