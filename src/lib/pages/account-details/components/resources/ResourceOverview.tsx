import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { MobileTitle, TableTitle } from "lib/components/table";
import type { BechAddr, Option, ResourceGroup } from "lib/types";

import { ResourceOverviewBody } from "./ResourceOverviewBody";

interface ResourceOverviewProps {
  address: BechAddr;
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

  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobile ? (
        <MobileTitle
          title="Resources"
          count={totalCount}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <TableTitle
            title="Resources"
            helperText="Resources stored in this account"
            showCount={false}
          />
          <ResourceOverviewBody
            address={address}
            resourcesByName={resourcesByName}
            isLoading={isLoading}
            onViewMore={onViewMore}
          />
        </>
      )}
    </Box>
  );
};
