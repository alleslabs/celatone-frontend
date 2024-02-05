import { Flex, Grid, GridItem, Heading } from "@chakra-ui/react";

import type { ProposalData, Option, ProposalVotesInfo } from "lib/types";

import { ProposalDescription } from "./ProposalDescription";
import { ProposalMetadata } from "./ProposalMetadata";
import { StatusSummary } from "./status-summary";

export interface ProposalOverviewProps {
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
  isLoading: boolean;
}

export const ProposalOverview = ({
  proposalData,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  return (
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
            isLoading={isLoading}
          />
          <ProposalDescription description={proposalData.description} />
          <ProposalMetadata metadata={proposalData.metadata} />
          <Flex
            direction="column"
            gap={4}
            pt={8}
            borderTop="1px solid"
            borderColor="gray.700"
          >
            <Heading as="h6" variant="h6">
              Proposal Messages
            </Heading>
            <Flex
              background="gray.900"
              minH={64}
              alignItems="center"
              justifyContent="center"
            >
              Proposal message content
            </Flex>
          </Flex>
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
};
