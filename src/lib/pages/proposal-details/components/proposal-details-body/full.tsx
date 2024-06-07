import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback } from "react";

import { useDerivedProposalData } from "../../data";
import { TabIndex } from "../../types";
import type { ProposalDetailsQueryParams } from "../../types";
import { InvalidProposal } from "../InvalidProposal";
import { ProposalOverview } from "../proposal-overview";
import { ProposalTop } from "../proposal-top";
import { VoteDetails } from "../vote-details";
import { trackUseTab } from "lib/amplitude";
import { useGovConfig, useInternalNavigate, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useDerivedProposalParams } from "lib/model/proposal";
import { useProposalVotesInfo } from "lib/services/proposal";

export const ProposalDetailsBodyFull = ({
  proposalId,
  tab,
}: ProposalDetailsQueryParams) => {
  useGovConfig({ shouldRedirect: true });

  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { data, isLoading } = useDerivedProposalData(proposalId);
  const { data: votesInfo, isLoading: isVotesInfoLoading } =
    useProposalVotesInfo(proposalId);
  const { data: params, isLoading: isParamsLoading } =
    useDerivedProposalParams(!isMobile);

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
