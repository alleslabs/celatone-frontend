import { Flex } from "@chakra-ui/react";

import { VotingPowerChart } from "./VotingPowerChart";

export const BondedTokenChangesSection = () => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <VotingPowerChart denom="OSMO" />
    </Flex>
  );
};
