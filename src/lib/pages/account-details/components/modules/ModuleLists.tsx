import { Flex, SimpleGrid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
// import { ModuleCard } from "lib/components/module/ModuleCard";
import { TableTitle, ViewMore } from "lib/components/table";

interface ModuleListsProps {
  onViewMore?: () => void;
  totalAsset: number;
}

const ModuleTitle = ({
  onViewMore,
  totalAsset,
}: {
  onViewMore: ModuleListsProps["onViewMore"];
  totalAsset: number;
}) => {
  const isMobile = useMobile();
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
        <TableTitle title="Modules" count={totalAsset} mb={0} />
        <CustomIcon name="chevron-right" color="gray.600" />
      </Flex>
    );
  return (
    <TableTitle
      title="Module Instances"
      helperText="Modules are ‘smart contracts' deployed by this account"
      count={totalAsset}
    />
  );
};
export const ModuleLists = ({ onViewMore, totalAsset }: ModuleListsProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <ModuleTitle onViewMore={onViewMore} totalAsset={totalAsset} />
      {!(isMobile && onViewMore) && (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} mb={6}>
          {/* <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
          <ModuleCard /> */}
        </SimpleGrid>
      )}
      {!isMobile && onViewMore && <ViewMore onClick={onViewMore} />}
    </Flex>
  );
};
