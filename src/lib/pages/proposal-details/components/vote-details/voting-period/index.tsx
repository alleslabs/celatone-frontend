import {
  Alert,
  AlertDescription,
  Button,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { isNull } from "lodash";
import type { ReactNode } from "react";

import type { VoteDetailsProps } from "..";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import { useProposalAnswerCounts } from "lib/services/wasm/proposal";
import { scrollToComponent, scrollYPosition } from "lib/utils";

import { ProposalVotesPanel } from "./ProposalVotesPanel";
import { ValidatorVotesTable } from "./validator-votes-table";
import { ValidatorVotesPanel } from "./ValidatorVotesPanel";
import { ProposalVotesTable } from "./votes-table";
import { VotingQuorum } from "./VotingQuorum";
import { VotingThreshold } from "./VotingThreshold";

type VoterVariant = "validator" | "all";

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

const scrollComponentId = "voting-period";

export const VotingPeriod = ({ proposalData, ...props }: VoteDetailsProps) => {
  const isMobile = useMobile();
  const validatorVoteDisclosure = useDisclosure();
  const allVoteDisclosure = useDisclosure();

  const { data: answers } = useProposalAnswerCounts(proposalData.id);

  const isProposalResolved = !isNull(proposalData.resolvedHeight);

  const toggleDisclosure = (voter: VoterVariant) => {
    let disclosure = validatorVoteDisclosure;
    let ampEvent = AmpEvent.USE_SEE_VALIDATOR_VOTES;

    if (voter === "all") {
      disclosure = allVoteDisclosure;
      ampEvent = AmpEvent.USE_SEE_VOTES;
    }

    if (disclosure.isOpen) {
      disclosure.onClose();
    } else {
      disclosure.onOpen();
      track(ampEvent);
    }

    const windowPosition = scrollYPosition();
    if (windowPosition) {
      scrollToComponent(scrollComponentId);
    }
  };

  return (
    <Flex
      id={scrollComponentId}
      position="relative"
      overflowX="hidden"
      width="full"
    >
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
        {/* Voting Participations */}
        <ContentContainer transparent={isMobile}>
          <VotingQuorum proposalData={proposalData} {...props} />
        </ContentContainer>
        {/* Voting Results */}
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
                  count={answers?.validator.totalValidators}
                />
                <Button
                  variant="ghost-primary"
                  onClick={() => toggleDisclosure("validator")}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                  isDisabled={!answers?.validator.totalValidators}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              {isProposalResolved && (
                <Alert variant="secondary" mb={4} alignItems="center" gap={3}>
                  <CustomIcon
                    name="alert-circle-solid"
                    boxSize={4}
                    color="secondary.main"
                  />
                  <AlertDescription>
                    Please note that the displayed ranking is in real-time and
                    may not accurately reflect the final vote results when the
                    voting period ends.
                  </AlertDescription>
                </Alert>
              )}
              <ValidatorVotesTable
                id={proposalData.id}
                answers={answers?.validator}
                fullVersion={false}
                isProposalResolved={isProposalResolved}
                onViewMore={
                  isMobile ? () => toggleDisclosure("validator") : undefined
                }
              />
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
                  onClick={() => toggleDisclosure("all")}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                  isDisabled={!answers?.all.total}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              <ProposalVotesTable
                id={proposalData.id}
                answers={answers?.all}
                fullVersion={false}
                onViewMore={
                  isMobile ? () => toggleDisclosure("all") : undefined
                }
              />
            </ContentContainer>
          </GridItem>
        </Grid>
      </Flex>
      <ValidatorVotesPanel
        answers={answers?.validator}
        isOpen={validatorVoteDisclosure.isOpen}
        id={proposalData.id}
        onBack={validatorVoteDisclosure.onClose}
        isProposalResolved={isProposalResolved}
      />
      <ProposalVotesPanel
        answers={answers?.all}
        isOpen={allVoteDisclosure.isOpen}
        id={proposalData.id}
        onBack={allVoteDisclosure.onClose}
      />
    </Flex>
  );
};
