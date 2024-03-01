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
  return (
    <>
      {isMobile ? (
        <MobileTitle
          title="Recently Proposed Blocks"
          count={10}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column" gap={6}>
          <Heading as="h6" variant="h6">
            Recently Proposed Blocks
          </Heading>
          <Flex>table</Flex>
        </Flex>
      )}
    </>
  );
};
