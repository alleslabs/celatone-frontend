import type { ReactNode } from "react";

import {
  Alert,
  AlertDescription,
  Button,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useMobile, useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import { useProposalAnswerCounts } from "lib/services/proposal";
import { ProposalStatus } from "lib/types";
import { scrollToComponent, scrollYPosition } from "lib/utils";
import { isNull } from "lodash";

import type { VoteDetailsProps } from "..";

import { NoVotingPeriodTallyAlert } from "../../NoVotingPeriodTally";
import { ProposalVotesPanel } from "./ProposalVotesPanel";
import { ValidatorVotesTable } from "./validator-votes-table";
import { ValidatorVotesPanel } from "./ValidatorVotesPanel";
import { ProposalVotesTable } from "./votes-table";
import { VotingQuorum } from "./VotingQuorum";
import { VotingThreshold } from "./VotingThreshold";

type VoterVariant = "all" | "validator";

const ContentContainer = ({
  children,
  transparent = false,
}: {
  children: ReactNode;
  transparent?: boolean;
}) => (
  <Flex
    background={transparent ? "transparent" : "gray.900"}
    border="1px solid"
    borderColor={transparent ? "transparent" : "gray.700"}
    borderRadius="8px"
    direction="column"
    gap={4}
    p={{ base: 4, md: 6 }}
  >
    {children}
  </Flex>
);

const scrollComponentId = "voting-period";

export const VotingPeriod = ({ proposalData, ...props }: VoteDetailsProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();
  const gov = useGovConfig({ shouldRedirect: false });
  const disableVotingPeriodTally = gov.enabled && gov.disableVotingPeriodTally;

  const validatorVoteDisclosure = useDisclosure();
  const allVoteDisclosure = useDisclosure();

  const { data: answers } = useProposalAnswerCounts(
    proposalData.id,
    isFullTier
  );

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
      overflowX="hidden"
      position="relative"
      width="full"
    >
      <Flex
        direction="column"
        gap={4}
        left={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "-100%"
            : "0"
        }
        opacity={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen ? 0 : 1
        }
        position={
          validatorVoteDisclosure.isOpen || allVoteDisclosure.isOpen
            ? "absolute"
            : "relative"
        }
        transition="all 0.25s ease-in-out"
        w="full"
      >
        {proposalData.status === ProposalStatus.VOTING_PERIOD &&
        disableVotingPeriodTally ? (
          <NoVotingPeriodTallyAlert />
        ) : (
          <>
            {/* Voting Participations */}
            <ContentContainer transparent={isMobile}>
              <VotingQuorum proposalData={proposalData} {...props} />
            </ContentContainer>
            {/* Voting Results */}
            <ContentContainer transparent={isMobile}>
              <VotingThreshold proposalData={proposalData} {...props} />
            </ContentContainer>
          </>
        )}
        {isFullTier && (
          <Grid gridGap={4} gridTemplateColumns={isMobile ? "1fr " : "1fr 1fr"}>
            {/* Validator Votes */}
            <GridItem>
              <ContentContainer>
                <Flex alignItems="center" justifyContent="space-between">
                  <TableTitle
                    count={answers?.validator.totalValidators}
                    mb={0}
                    title="Validator votes"
                  />
                  <Button
                    isDisabled={!answers?.validator.totalValidators}
                    rightIcon={<CustomIcon boxSize={3} name="chevron-right" />}
                    variant="ghost-primary"
                    onClick={() => toggleDisclosure("validator")}
                  >
                    {isMobile ? "View" : "View details"}
                  </Button>
                </Flex>
                {isProposalResolved && (
                  <Alert alignItems="center" gap={3} mb={4} variant="primary">
                    <CustomIcon
                      boxSize={4}
                      color="primary.main"
                      name="alert-triangle-solid"
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
                    count={answers?.all.total}
                    mb={0}
                    title="Recent votes"
                  />
                  <Button
                    isDisabled={!answers?.all.total}
                    rightIcon={<CustomIcon boxSize={3} name="chevron-right" />}
                    variant="ghost-primary"
                    onClick={() => toggleDisclosure("all")}
                  >
                    {isMobile ? "View" : "View details"}
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
        )}
      </Flex>
      <ValidatorVotesPanel
        id={proposalData.id}
        answers={answers?.validator}
        isOpen={validatorVoteDisclosure.isOpen}
        isProposalResolved={isProposalResolved}
        onBack={validatorVoteDisclosure.onClose}
      />
      <ProposalVotesPanel
        id={proposalData.id}
        answers={answers?.all}
        isOpen={allVoteDisclosure.isOpen}
        onBack={allVoteDisclosure.onClose}
      />
    </Flex>
  );
};
