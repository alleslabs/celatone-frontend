import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { ModuleHistoryTable } from "../history";
import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { HexAddr, Option } from "lib/types";

import { ModuleRelatedProposalsTable } from "./ModuleRelatedProposalsTable";
import { ModuleTxsTable } from "./ModuleTxsTable";

export enum ModuleTablesTabIndex {
  Transactions = "transactions",
  PublishedEvents = "published-events",
  RelatedProposals = "related-proposals",
}

interface ModuleTablesProps {
  vmAddress: HexAddr;
  moduleName: string;
  txsCount: Option<number>;
  historiesCount: Option<number>;
  relatedProposalsCount: Option<number>;
  tab: ModuleTablesTabIndex;
  setTab: (nextTab: ModuleTablesTabIndex) => void;
  onViewMore?: (nextTab: ModuleTablesTabIndex) => void;
}

const tableHeaderId = "moduleDetailsTableHeader";

export const ModuleTables = ({
  vmAddress,
  moduleName,
  txsCount,
  historiesCount,
  relatedProposalsCount,
  tab,
  setTab,
  onViewMore,
}: ModuleTablesProps) => {
  const gov = useGovConfig({ shouldRedirect: false });

  const handleOnViewMore = useCallback(
    (nextTab: ModuleTablesTabIndex) =>
      onViewMore
        ? () => {
            track(AmpEvent.USE_VIEW_MORE, {
              table: nextTab,
            });
            onViewMore(nextTab);
          }
        : undefined,
    [onViewMore]
  );
  const handleTabChange = useCallback(
    (nextTab: ModuleTablesTabIndex) => () => {
      if (nextTab === tab) return;
      track(AmpEvent.USE_SUBTAB, {
        isOverview: !!onViewMore,
        subtab: nextTab,
      });
      setTab(nextTab);
    },
    [onViewMore, setTab, tab]
  );

  return (
    <Flex flexDirection="column" mt={6}>
      <Heading as="h6" variant="h6" mb={6} fontWeight={600} id={tableHeaderId}>
        Transactions & Histories
      </Heading>
      <Tabs
        index={Object.values(ModuleTablesTabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX={{ base: "scroll", md: "auto" }}
        >
          <CustomTab
            count={txsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.Transactions)}
            isDisabled={txsCount === 0}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={historiesCount}
            onClick={handleTabChange(ModuleTablesTabIndex.PublishedEvents)}
            isDisabled={historiesCount === 0}
          >
            Published Events
          </CustomTab>
          <CustomTab
            count={relatedProposalsCount}
            onClick={handleTabChange(ModuleTablesTabIndex.RelatedProposals)}
            isDisabled={relatedProposalsCount === 0}
            hidden={!gov.enabled}
          >
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ModuleTxsTable
              vmAddress={vmAddress}
              moduleName={moduleName}
              txCount={txsCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(ModuleTablesTabIndex.Transactions)}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleHistoryTable
              vmAddress={vmAddress}
              moduleName={moduleName}
              historyCount={historiesCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.PublishedEvents
              )}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleRelatedProposalsTable
              vmAddress={vmAddress}
              moduleName={moduleName}
              relatedProposalsCount={relatedProposalsCount}
              scrollComponentId={tableHeaderId}
              onViewMore={handleOnViewMore(
                ModuleTablesTabIndex.RelatedProposals
              )}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
