import { Button, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";

import type { VoteDetailsProps } from "..";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import { useProposalAnswerCounts } from "lib/services/proposalService";

import { ProposalVotesPanel } from "./ProposalVotesPanel";
import { ValidatorVotesPanel } from "./ValidatorVotesPanel";
import { ProposalVotesTable } from "./votes-table";
import { VotingQuorum } from "./VotingQuorum";
import { VotingThreshold } from "./VotingThreshold";

const ContentContainer = ({
  children,
  transparent = false,
}: {
  children: ReactNode;
  transparent?: boolean;
}) => (
  <Flex
    direction="column"
    background={transparent ? "transparent" : "gray.900"}
    border="1px solid"
    borderColor={transparent ? "transparent" : "gray.700"}
    borderRadius="8px"
    p={{ base: 4, md: 6 }}
    gap={4}
  >
    {children}
  </Flex>
);

export const VotingPeriod = ({
  proposalData,
  ...props
}: Omit<VoteDetailsProps, "period">) => {
  const isMobile = useMobile();
  const validatorVoteDisclosure = useDisclosure();
  const allVoteDisclosure = useDisclosure();

  const { data: answers } = useProposalAnswerCounts(proposalData.id);

  return (
    <Flex position="relative" overflow="hidden" width="full">
      <Flex
        direction="column"
        w="full"
        position={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "absolute"
            : "relative"
        }
        opacity={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen ? 0 : 1
        }
        left={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "-100%"
            : "0"
        }
        transition="all 0.25s ease-in-out"
        gap={4}
      >
        {/* Vote Participations */}
        <ContentContainer transparent={isMobile}>
          <VotingQuorum proposalData={proposalData} {...props} />
        </ContentContainer>
        {/* Vote Results */}
        <ContentContainer transparent={isMobile}>
          <VotingThreshold proposalData={proposalData} {...props} />
        </ContentContainer>
        <Grid gridTemplateColumns={isMobile ? "1fr " : "1fr 1fr"} gridGap={4}>
          {/* Validator Votes */}
          <GridItem>
            <ContentContainer>
              <Flex alignItems="center" justifyContent="space-between">
                <TableTitle
                  title="Validator Votes"
                  mb={0}
                  count={answers?.validator.total}
                />
                <Button
                  variant="ghost-primary"
                  onClick={() => validatorVoteDisclosure.onToggle()}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              Validator Votes Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Necessitatibus ipsam perspiciatis eius illo
              maiores, magnam architecto nesciunt esse animi obcaecati
              voluptates delectus doloribus magni alias a eligendi odio nam
              iure?
            </ContentContainer>
          </GridItem>
          {/* Recent Votes */}
          <GridItem>
            <ContentContainer>
              <Flex alignItems="center" justifyContent="space-between">
                <TableTitle
                  title="Recent Votes"
                  mb={0}
                  count={answers?.all.total}
                />
                <Button
                  variant="ghost-primary"
                  onClick={() => allVoteDisclosure.onToggle()}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              <ProposalVotesTable
                id={proposalData.id}
                answers={answers?.all}
                fullVersion={false}
              />
            </ContentContainer>
          </GridItem>
        </Grid>
      </Flex>
      <ValidatorVotesPanel
        w="full"
        position={validatorVoteDisclosure.isOpen ? "relative" : "absolute"}
        opacity={validatorVoteDisclosure.isOpen ? 1 : 0}
        left={validatorVoteDisclosure.isOpen ? "0" : "100%"}
        onBack={validatorVoteDisclosure.onToggle}
      />
      <ProposalVotesPanel
        answers={answers?.all}
        isOpen={allVoteDisclosure.isOpen}
        id={proposalData.id}
        onBack={allVoteDisclosure.onToggle}
      />
    </Flex>
  );
};
