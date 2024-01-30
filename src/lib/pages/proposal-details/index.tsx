import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { useProposalData } from "lib/services/proposalService";

import { ProposalTop } from "./components";
import { ProposalOverview } from "./components/ProposalOverview";
import { VoteDetail } from "./components/VoteDetail";
import type { ProposalDetailsQueryParams } from "./type";
import { zProposalDetailsQueryParams, TabIndex } from "./type";

const ProposalDetailsBody = ({
  id,
  tab,
  // voteTab,
}: ProposalDetailsQueryParams) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { data, isLoading } = useProposalData(id);

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

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="proposal information" />;
  if (!data.info) return <InvalidState title="Proposal does not exist" />;

  const proposalData = data.info;
  return (
    <>
      <ProposalTop id={id} proposalData={proposalData} />
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

const ProposalDetails = () => {
  const router = useRouter();

  const validated = zProposalDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {!validated.success ? (
        <InvalidState title="Proposal does not euuuxist" />
      ) : (
        <ProposalDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
};

export default ProposalDetails;
