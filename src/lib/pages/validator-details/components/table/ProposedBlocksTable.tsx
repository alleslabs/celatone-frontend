import { Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { MobileTitle } from "lib/components/table";

interface ProposedBlocksTableProps {
  onViewMore?: () => void;
}
export const ProposedBlocksTable = ({
  onViewMore,
}: ProposedBlocksTableProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <>
      {isMobileOverview ? (
        <MobileTitle
          title="Recently Proposed Blocks"
          count={10}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column" gap={{ base: 4, md: 6 }}>
          <Heading as="h6" variant="h6">
            Recently Proposed Blocks
          </Heading>
          {isMobile ? <Flex>mobile table</Flex> : <Flex>table</Flex>}
        </Flex>
      )}
    </>
  );
};
