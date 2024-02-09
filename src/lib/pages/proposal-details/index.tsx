import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { useProposalVotesInfo } from "lib/services/proposalService";

import { ProposalTop, ProposalOverview, VoteDetail } from "./components";
import { useDerivedProposalData, useDerivedProposalParams } from "./data";
import type { ProposalDetailsQueryParams } from "./type";
import { zProposalDetailsQueryParams, TabIndex } from "./type";

const ProposalDetailsBody = ({
  id,
  tab,
  // voteTab,
}: ProposalDetailsQueryParams) => {
  useGovConfig({ shouldRedirect: true });

  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { data, isLoading } = useDerivedProposalData(id);
  const { data: votesInfo, isLoading: isVotesInfoLoading } =
    useProposalVotesInfo(id);
  const { data: params, isLoading: isParamsLoading } =
    useDerivedProposalParams(isMobile);

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

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="proposal information" />;
  if (!data.info) return <InvalidState title="Proposal does not exist" />;

  return (
    <>
      <ProposalTop proposalData={data.info} />
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
            <ProposalOverview
              proposalData={data.info}
              votesInfo={votesInfo}
              params={params}
              isLoading={isVotesInfoLoading || isParamsLoading}
            />
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

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_PROPOSAL_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

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
