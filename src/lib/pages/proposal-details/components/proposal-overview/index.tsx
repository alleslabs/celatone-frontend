import { Flex, Grid, GridItem, Heading } from "@chakra-ui/react";

import type {
  ProposalData,
  Option,
  ProposalVotesInfo,
  ProposalParams,
} from "lib/types";

import { ProposalDescription } from "./ProposalDescription";
import { ProposalMessages } from "./ProposalMessages";
import { ProposalMetadata } from "./ProposalMetadata";
import { StatusSummary } from "./status-summary";

export interface ProposalOverviewProps {
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
  params: Option<ProposalParams>;
  isLoading: boolean;
}

export const ProposalOverview = ({
  proposalData,
  votesInfo,
  params,
  isLoading,
}: ProposalOverviewProps) => (
  <Grid
    gridTemplateColumns={{ base: "1fr", xl: "2fr 1fr" }}
    gridGap={16}
    mt={8}
  >
    <GridItem>
      <Flex direction="column" gap={8}>
        <StatusSummary
          proposalData={proposalData}
          votesInfo={votesInfo}
          params={params}
          isLoading={isLoading}
        />
        <ProposalDescription description={proposalData.description} />
        <ProposalMetadata metadata={proposalData.metadata} />
        <ProposalMessages messages={proposalData.messages} />
      </Flex>
    </GridItem>
    <GridItem>
      <Heading as="h6" variant="h6" mb={4}>
        Proposal Period
      </Heading>
      <Flex
        background="gray.900"
        minH={64}
        alignItems="center"
        justifyContent="center"
      >
        Proposal period content
      </Flex>
    </GridItem>
  </Grid>
);
