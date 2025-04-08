import type { BechAddr, Option, ResourceGroup } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { MobileTitle } from "lib/components/table";

import AccountSectionWrapper from "../AccountSectionWrapper";
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
          count={totalCount}
          title="Resources"
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper
          hasHelperText={!!resourcesByName?.length}
          helperText="This account stored the following resources"
          showCount={false}
          title="Resources"
        >
          <ResourceOverviewBody
            address={address}
            isLoading={isLoading}
            resourcesByName={resourcesByName}
            onViewMore={onViewMore}
          />
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
