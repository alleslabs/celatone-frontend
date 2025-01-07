import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource";
import { ErrorFetching } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import type { BechAddr, Option, ResourceGroup } from "lib/types";
import { scrollToTop } from "lib/utils";

interface ResourceOverviewBodyProps {
  address: BechAddr;
  isLoading: boolean;
  onViewMore: () => void;
  resourcesByName: Option<ResourceGroup[]>;
}

export const ResourceOverviewBody = ({
  address,
  isLoading,
  onViewMore,
  resourcesByName,
}: ResourceOverviewBodyProps) => {
  const navigate = useInternalNavigate();

  const handleSelectResource = useCallback(
    (resource: ResourceGroup) => {
      navigate({
        options: {
          shallow: true,
        },
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          account: resource.account,
          accountAddress: address,
          selected: resource.group,
          tab: "resources",
        },
      });
    },
    [address, navigate]
  );

  if (isLoading) return <Loading />;
  if (!resourcesByName)
    return (
      <ErrorFetching
        dataName="resources"
        my={2}
        hasBorderTop={false}
        withBorder
      />
    );
  if (!resourcesByName.length)
    return (
      <AccountDetailsEmptyState message="No resources are stored on this account." />
    );

  return (
    <Flex
      mb={12}
      mt={6}
      pb={6}
      borderBottom="1px solid"
      borderBottomColor="gray.700"
      direction="column"
    >
      <SimpleGrid mb={6} spacing={4} columns={{ lg: 4, md: 2, sm: 1 }}>
        {resourcesByName.slice(0, 8).map((item) => (
          <ResourceCard
            key={item.displayName}
            name={item.displayName}
            amount={item.items.length}
            onClick={() => handleSelectResource(item)}
          />
        ))}
      </SimpleGrid>
      {resourcesByName.length > 8 && (
        <ViewMore
          onClick={() => {
            onViewMore();
            scrollToTop();
          }}
        />
      )}
    </Flex>
  );
};
