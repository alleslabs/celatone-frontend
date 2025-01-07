import { Box } from "@chakra-ui/react";

import AccountSectionWrapper from "../AccountSectionWrapper";
import { useMobile } from "lib/app-provider";
import { MobileTitle } from "lib/components/table";
import type { BechAddr, Option, ResourceGroup } from "lib/types";

import { ResourceOverviewBody } from "./ResourceOverviewBody";

interface ResourceOverviewProps {
  address: BechAddr;
  isLoading: boolean;
  onViewMore: () => void;
  resourcesByName: Option<ResourceGroup[]>;
  totalCount: Option<number>;
}

export const ResourceOverview = ({
  address,
  isLoading,
  onViewMore,
  resourcesByName,
  totalCount,
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
        <AccountSectionWrapper
          hasHelperText={!!resourcesByName?.length}
          helperText="This account stored the following resources"
          title="Resources"
          showCount={false}
        >
          <ResourceOverviewBody
            address={address}
            isLoading={isLoading}
            onViewMore={onViewMore}
            resourcesByName={resourcesByName}
          />
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
