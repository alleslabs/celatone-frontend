import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";
import { useContractDetailsTableCounts } from "lib/model/contract";
import type { ContractAddr } from "lib/types";

import { MigrationTable } from "./migration";
import { RelatedProposalsTable } from "./RelatedProposalsTable";
import { TxsTable } from "./TxsTable";

interface ContractTablesProps {
  contractAddress: ContractAddr;
}

export const ContractTables = ({ contractAddress }: ContractTablesProps) => {
  const tableHeaderId = "contractDetailsTableHeader";
  const {
    tableCounts,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  } = useContractDetailsTableCounts(contractAddress);

  return (
    <Flex direction="column" gap={6}>
      {/* History Table section */}
      <Heading as="h6" variant="h6" id={tableHeaderId}>
        Transaction & History
      </Heading>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX={{ base: "scroll", md: "auto" }}
        >
          <CustomTab count={tableCounts.transactionsCount}>
            Transactions
          </CustomTab>
          <CustomTab count={tableCounts.migrationCount}>Migrations</CustomTab>
          <CustomTab
            count={tableCounts.relatedProposalsCount}
            whiteSpace="nowrap"
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <TxsTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.transactionsCount}
              refetchCount={refetchTransactions}
            />
          </TabPanel>
          <TabPanel p={0}>
            <MigrationTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.migrationCount}
              refetchCount={refetchMigration}
            />
          </TabPanel>
          <TabPanel p={0}>
            <RelatedProposalsTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.relatedProposalsCount}
              refetchCount={refetchRelatedProposals}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
