import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useGovConfig, useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useProposalVotesInfo } from "lib/services/proposal";

import { ProposalOverview, ProposalTop, VoteDetails } from "./components";
import { useDerivedProposalData, useDerivedProposalParams } from "./data";
import type { ProposalDetailsQueryParams } from "./types";
import { TabIndex, zProposalDetailsQueryParams } from "./types";

const InvalidProposal = () => <InvalidState title="Proposal does not exist" />;

const ProposalDetailsBody = ({
  proposalId,
  tab,
}: ProposalDetailsQueryParams) => {
  useGovConfig({ shouldRedirect: true });

  const navigate = useInternalNavigate();
  const { data, isLoading } = useDerivedProposalData(proposalId);
  const { data: votesInfo, isLoading: isVotesInfoLoading } =
    useProposalVotesInfo(proposalId);
  const { data: params, isLoading: isParamsLoading } =
    useDerivedProposalParams();

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/proposals/[proposalId]/[tab]",
        query: {
          proposalId,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [navigate, proposalId, tab]
  );

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="proposal information" />;
  if (!data.info) return <InvalidProposal />;

  return (
    <>
      <CelatoneSeo
        pageName={
          data.info.id ? `Proposal #${data.info.id}` : "Proposal Detail"
        }
      />
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
            Voting Details
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
            <UserDocsLink
              title="What is a Proposal?"
              cta="Read more about Proposal Details"
              href="general/proposals/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <VoteDetails
              proposalData={data.info}
              votesInfo={votesInfo}
              params={params}
              isLoading={isVotesInfoLoading || isParamsLoading}
            />
            <UserDocsLink
              title="What is the CosmWasm proposal vote progress?"
              cta="Read more about Vote Details"
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
