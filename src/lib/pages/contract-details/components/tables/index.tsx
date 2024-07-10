import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { useGovConfig, useTierConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { useContractTableCounts } from "lib/services/wasm/contract";
import type { BechAddr32 } from "lib/types";

import { MigrationTable } from "./migration";
import { RelatedProposalsTable } from "./RelatedProposalsTable";
import { TxsTable } from "./TxsTable";

interface ContractTablesProps {
  contractAddress: BechAddr32;
}

const tableHeaderId = "contractDetailsTableHeader";

export const ContractTables = ({ contractAddress }: ContractTablesProps) => {
  const { isFullTier } = useTierConfig();

  const gov = useGovConfig({ shouldRedirect: false });
  const { data, refetch: refetchCount } = useContractTableCounts(
    contractAddress,
    { enabled: isFullTier }
  );

  return (
    <Flex direction="column" gap={6}>
      {/* History Table section */}
      <Heading as="h6" variant="h6" id={tableHeaderId}>
        Transactions & Histories
      </Heading>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX={{ base: "scroll", md: "auto" }}
        >
          <CustomTab count={data?.tx} isDisabled={data?.tx === 0}>
            Transactions
          </CustomTab>
          <CustomTab count={data?.migration} isDisabled={data?.migration === 0}>
            Migrations
          </CustomTab>
          <CustomTab
            count={data?.relatedProposal}
            isDisabled={data?.relatedProposal === 0}
            whiteSpace="nowrap"
            hidden={!gov.enabled || !isFullTier}
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <TxsTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={data?.tx ?? undefined}
              refetchCount={refetchCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <MigrationTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={data?.migration ?? undefined}
              refetchCount={refetchCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <RelatedProposalsTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={data?.relatedProposal ?? undefined}
              refetchCount={refetchCount}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
