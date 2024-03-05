import { Flex } from "@chakra-ui/react";

import { RelatedTransactionTable } from "../table/RelatedTransactionsTable";

import { VotingPowerChart } from "./VotingPowerChart";

export const BondedTokenChangesSection = () => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
      <VotingPowerChart denom="OSMO" />
      <RelatedTransactionTable />
    </Flex>
  );
};
