import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useGovConfig, useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useDerivedProposalParams } from "lib/model/proposal";

import {
  InvalidProposal,
  ProposalOverview,
  ProposalTop,
  VoteDetails,
} from "./components";
import { useDerivedProposalData, useDerivedProposalVotesInfo } from "./data";
import type { ProposalDetailsQueryParams } from "./types";
import { TabIndex, zProposalDetailsQueryParams } from "./types";

const ProposalDetailsBody = ({
  proposalId,
  tab,
}: ProposalDetailsQueryParams) => {
  useGovConfig({ shouldRedirect: true });

  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { data, isDepositsLoading, isLoading } =
    useDerivedProposalData(proposalId);
  const { data: votesInfo, isLoading: isVotesInfoLoading } =
    useDerivedProposalVotesInfo(proposalId, data, isLoading);
  const { data: params, isLoading: isParamsLoading } =
    useDerivedProposalParams(!isMobile);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        options: {
          shallow: true,
        },
        pathname: "/proposals/[proposalId]/[tab]",
        query: {
          proposalId,
          tab: nextTab,
        },
      });
    },
    [navigate, proposalId, tab]
  );

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="proposal information" />;

  const { info } = data;
  if (info === null) return <InvalidProposal />;

  return (
    <>
      <CelatoneSeo
        pageName={info.id ? `Proposal #${info.id}` : "Proposal Detail"}
      />
      <ProposalTop proposalData={info} />
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
            Voting Details
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ProposalOverview
              params={params}
              isDepositsLoading={isDepositsLoading}
              isLoading={isVotesInfoLoading || isParamsLoading}
              proposalData={info}
              votesInfo={votesInfo}
            />
            <UserDocsLink
              cta="Read more about Proposal Details"
              title="What is a Proposal?"
              href="general/proposals/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <VoteDetails
              params={params}
              isDepositsLoading={isDepositsLoading}
              isLoading={isVotesInfoLoading || isParamsLoading}
              proposalData={info}
              votesInfo={votesInfo}
            />
            <UserDocsLink
              cta="Read more about Vote Details"
              title="What is the CosmWasm proposal vote progress?"
              href="general/proposals/detail-page#proposal-vote-details"
            />
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
        <InvalidProposal />
      ) : (
        <ProposalDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
};

export default ProposalDetails;
