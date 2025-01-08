import { Flex } from "@chakra-ui/react";

import { TableTitle } from "lib/components/table";
import type { BechAddr, Option, ResourceGroupByAccount } from "lib/types";

import { ResourceSectionBody } from "./ResourceSectionBody";

interface ResourceSectionProps {
  address: BechAddr;
  totalCount: Option<number>;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  isLoading: boolean;
  selectedAccountParam: Option<string>;
  selectedGroupNameParam: Option<string>;
}

export const ResourceSection = ({
  address,
  totalCount,
  resourcesByOwner,
  isLoading,
  selectedAccountParam,
  selectedGroupNameParam,
}: ResourceSectionProps) => (
  <Flex direction="column" mt={8}>
    <TableTitle
      helperText="Resources stored in this account"
      title="Resources"
      count={totalCount}
    />
    <ResourceSectionBody
      address={address}
      resourcesByOwner={resourcesByOwner}
      isLoading={isLoading}
      selectedAccountParam={selectedAccountParam}
      selectedGroupNameParam={selectedGroupNameParam}
    />
  </Flex>
);
