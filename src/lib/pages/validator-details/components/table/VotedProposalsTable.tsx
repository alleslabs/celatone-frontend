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
  return (
    <>
      {isMobile ? (
        <MobileTitle
          title="Voted Proposals"
          count={10}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column" gap={6}>
          <Heading as="h6" variant="h6">
            Voted Proposals
          </Heading>
          <Flex>table</Flex>
        </Flex>
      )}
    </>
  );
};
