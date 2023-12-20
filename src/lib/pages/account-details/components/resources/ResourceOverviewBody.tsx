import { SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource";
import { ErrorFetching, EmptyState } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import type { MoveAccountAddr, Option, ResourceGroup } from "lib/types";
import { scrollToTop } from "lib/utils";

interface ResourceOverviewBodyProps {
  address: MoveAccountAddr;
  resourcesByName: Option<ResourceGroup[]>;
  isLoading: boolean;
  onViewMore: () => void;
}

export const ResourceOverviewBody = ({
  address,
  resourcesByName,
  isLoading,
  onViewMore,
}: ResourceOverviewBodyProps) => {
  const navigate = useInternalNavigate();

  const handleSelectResource = useCallback(
    (resource: ResourceGroup) => {
      navigate({
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          accountAddress: address,
          tab: "resources",
          account: resource.account,
          selected: resource.group,
        },
        options: {
          shallow: true,
        },
      });
    },
    [address, navigate]
  );

  if (isLoading) return <Loading />;
  if (!resourcesByName) return <ErrorFetching dataName="resources" />;
  if (!resourcesByName.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="No resources found"
        withBorder
        my={6}
      />
    );

  return (
    <>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
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
    </>
  );
};
