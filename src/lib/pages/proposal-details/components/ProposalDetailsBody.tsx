import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { TabIndex } from "../type";
import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { getFirstQueryParam } from "lib/utils";

import { ProposalOverview } from "./ProposalOverview";
import { ProposalTop } from "./ProposalTop";
import { VoteDetail } from "./VoteDetail";

interface ProposalDetailBodyProps {
  id?: number;
}
export const ProposalDetailBody = ({ id = 123 }: ProposalDetailBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const tab = getFirstQueryParam(router.query.tab) as TabIndex;

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      navigate({
        pathname: "/proposals/[id]/[tab]",
        query: {
          // To get from route
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
    <>
      <ProposalTop />
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
    </>
  );
};
