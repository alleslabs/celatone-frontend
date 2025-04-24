import type { BechAddr, Option, ResourceGroupByAccount } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { TableTitle } from "lib/components/table";

import { ResourceSectionBody } from "./ResourceSectionBody";

interface ResourceSectionProps {
  address: BechAddr;
  isLoading: boolean;
  resourcesByOwner: Option<ResourceGroupByAccount[]>;
  selectedAccountParam: Option<string>;
  selectedGroupNameParam: Option<string>;
  totalCount: Option<number>;
}

export const ResourceSection = ({
  address,
  isLoading,
  resourcesByOwner,
  selectedAccountParam,
  selectedGroupNameParam,
  totalCount,
}: ResourceSectionProps) => (
  <Flex direction="column" mt={8}>
    <TableTitle
      count={totalCount}
      helperText="Resources stored in this account"
      title="Resources"
    />
    <ResourceSectionBody
      address={address}
      isLoading={isLoading}
      resourcesByOwner={resourcesByOwner}
      selectedAccountParam={selectedAccountParam}
      selectedGroupNameParam={selectedGroupNameParam}
    />
  </Flex>
);
