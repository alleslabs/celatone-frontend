import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import type { MoveAccountAddr, Option, ResourceGroup } from "lib/types";

import { ResourceOverviewBody } from "./ResourceOverviewBody";

interface ResourceOverviewProps {
  address: MoveAccountAddr;
  totalCount: Option<number>;
  resourcesByName: Option<ResourceGroup[]>;
  isLoading: boolean;
  onViewMore: () => void;
}

export const ResourceOverview = ({
  address,
  totalCount,
  resourcesByName,
  isLoading,
  onViewMore,
}: ResourceOverviewProps) => {
  const isMobile = useMobile();

  return isMobile ? (
    <Flex
      justify="space-between"
      w="full"
      bg="gray.900"
      borderRadius="8px"
      p={4}
      onClick={onViewMore}
    >
      <TableTitle title="Resources" count={totalCount} mb={0} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <TableTitle
        title="Resources"
        helperText="Resources stored in this account"
        count={totalCount}
      />
      <ResourceOverviewBody
        address={address}
        resourcesByName={resourcesByName}
        isLoading={isLoading}
        onViewMore={onViewMore}
      />
    </Flex>
  );
};
