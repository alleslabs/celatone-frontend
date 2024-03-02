import { Flex } from "@chakra-ui/react";

import { VotedProposalsTable } from "./table/VotedProposalsTable";

export const VotesSection = () => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <VotedProposalsTable />
    </Flex>
  );
};
