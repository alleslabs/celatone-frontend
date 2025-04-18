import type { BechAddr, Option, ResourceGroup } from "lib/types";

import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource";
import { ErrorFetching } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import { scrollToTop } from "lib/utils";
import { useCallback } from "react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";

interface ResourceOverviewBodyProps {
  address: BechAddr;
  resourcesByName: Option<ResourceGroup[]>;
  isLoading: boolean;
  onViewMore: () => void;
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
        hasBorderTop={false}
        my={2}
        withBorder
      />
    );
  if (!resourcesByName.length)
    return (
      <AccountDetailsEmptyState message="No resources are stored on this account." />
    );

  return (
    <Flex
      borderBottomColor="gray.700"
      borderBottomWidth="1px"
      direction="column"
      mb={12}
      mt={6}
      pb={6}
    >
      <SimpleGrid columns={{ lg: 4, md: 2, sm: 1 }} mb={6} spacing={4}>
        {resourcesByName.slice(0, 8).map((item) => (
          <ResourceCard
            key={item.displayName}
            amount={item.items.length}
            name={item.displayName}
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
