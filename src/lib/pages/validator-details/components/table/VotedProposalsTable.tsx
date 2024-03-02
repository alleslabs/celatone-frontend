import { Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { MobileTitle } from "lib/components/table";

interface VotedProposalsTableProps {
  onViewMore?: () => void;
}
export const VotedProposalsTable = ({
  onViewMore,
}: VotedProposalsTableProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <>
      {isMobileOverview ? (
        <MobileTitle
          title="Voted Proposals"
          count={10}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column" gap={{ base: 4, md: 6 }}>
          <Heading as="h6" variant="h6">
            Voted Proposals
          </Heading>
          {isMobile ? <Flex>mobile table</Flex> : <Flex>table</Flex>}
        </Flex>
      )}
    </>
  );
};
