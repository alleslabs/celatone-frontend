import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import type { ProposalDetailsQueryParams } from "../type";
import { TabIndex } from "../type";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";

import { ProposalOverview } from "./ProposalOverview";
import { VoteDetail } from "./VoteDetail";

export const ProposalDetailBody = ({
  id,
  tab,
  // voteTab,
}: ProposalDetailsQueryParams) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      navigate({
        pathname: "/proposals/[id]/[tab]",
        query: {
          id,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [id, tab, navigate]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/proposals/[id]/[tab]",
        query: {
          id,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, navigate, id]);

  return (
    <Tabs
      index={Object.values(TabIndex).indexOf(tab)}
      isLazy
      lazyBehavior="keepMounted"
    >
      <TabList
        borderBottom="1px solid"
        borderColor="gray.700"
        overflowX="scroll"
      >
        <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
          Proposal Overview
        </CustomTab>
        <CustomTab onClick={handleTabChange(TabIndex.Vote)}>
          Vote Detail
        </CustomTab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <ProposalOverview />
        </TabPanel>
        <TabPanel p={0}>
          <VoteDetail />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
