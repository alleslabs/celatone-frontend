import { Flex, SimpleGrid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { TableTitle, ViewMore } from "lib/components/table";

interface ResourcesListsProps {
  onViewMore?: () => void;
  totalAsset: number;
}
const ResourceTitle = ({
  onViewMore,
  totalAsset,
}: {
  onViewMore: ResourcesListsProps["onViewMore"];
  totalAsset: number;
}) => {
  const isMobile = useMobile();
  if (!isMobile && !onViewMore) return null;
  if (isMobile && onViewMore)
    return (
      <Flex
        justify="space-between"
        w="full"
        bg="gray.900"
        borderRadius="8px"
        p={4}
        onClick={onViewMore}
      >
        <TableTitle title="Resources" count={totalAsset} mb={0} />
        <CustomIcon name="chevron-right" color="gray.600" />
      </Flex>
    );
  return (
    <TableTitle
      helperText="Resources stored in this account"
      title="Resources"
      count={totalAsset}
    />
  );
};
export const ResourceLists = ({
  onViewMore,
  totalAsset,
}: ResourcesListsProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <ResourceTitle onViewMore={onViewMore} totalAsset={totalAsset} />
      {!isMobile && (
        // TODO: data
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
          <ResourceCard name="resource ja" amount={3} />
          <ResourceCard name="resource ja" amount={3} />
          <ResourceCard name="resource ja" amount={3} />
          <ResourceCard name="resource ja" amount={3} />
        </SimpleGrid>
      )}
      {!isMobile && onViewMore && <ViewMore onClick={onViewMore} />}
    </Flex>
  );
};
