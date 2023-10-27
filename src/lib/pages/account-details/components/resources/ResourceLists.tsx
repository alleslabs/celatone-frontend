import { Flex, SimpleGrid, Box } from "@chakra-ui/react";
import { useCallback } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr, ResourceGroup } from "lib/types";
import { scrollToTop } from "lib/utils";

interface ResourcesListsProps {
  address: HumanAddr;
  onViewMore?: () => void;
}

export const ResourceLists = ({ address, onViewMore }: ResourcesListsProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { data: resourcesData, isLoading } = useAccountResources({
    address,
  });

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
  if (!resourcesData) return <ErrorFetching />;

  const resources = resourcesData.groupedByName;
  const isMobileOverview = isMobile && !!onViewMore;

  if (resourcesData.totalCount === 0 && !isMobileOverview)
    return (
      <Box w="full" mt={8}>
        <TableTitle title="Resources" count={resourcesData.totalCount} mb={0} />
        <EmptyState
          imageVariant="empty"
          message="No resources found"
          withBorder
          my={6}
        />
      </Box>
    );

  return (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      {isMobileOverview ? (
        <Flex
          justify="space-between"
          w="full"
          bg="gray.900"
          borderRadius="8px"
          p={4}
          onClick={onViewMore}
        >
          <TableTitle
            title="Resources"
            count={resourcesData.totalCount}
            mb={0}
          />
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          <TableTitle
            helperText="Resources stored in this account"
            title="Resources"
            count={resourcesData.totalCount}
          />
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
            {resources.slice(0, 8).map((item) => (
              <ResourceCard
                key={item.displayName}
                name={item.displayName}
                amount={item.items.length}
                onClick={() => handleSelectResource(item)}
              />
            ))}
          </SimpleGrid>
          {onViewMore && resources.length > 8 && (
            <ViewMore
              onClick={() => {
                onViewMore();
                scrollToTop();
              }}
            />
          )}
        </>
      )}
    </Flex>
  );
};
