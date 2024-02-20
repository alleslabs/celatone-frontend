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
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import { useProposalAnswerCounts } from "lib/services/proposalService";
import { scrollToComponent, scrollYPosition } from "lib/utils";

import { ProposalVotesPanel } from "./ProposalVotesPanel";
import { ValidatorVotesTable } from "./validator-votes-table";
import { ValidatorVotesPanel } from "./ValidatorVotesPanel";
import { ProposalVotesTable } from "./votes-table";
import { VotingQuorum } from "./VotingQuorum";

export const ContentContainer = ({
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

  const toggleDisclosure = (
    disclosure: typeof validatorVoteDisclosure | typeof allVoteDisclosure
  ) => {
    if (disclosure.isOpen) {
      disclosure.onClose();
    } else {
      disclosure.onOpen();
    }

    const windowPosition = scrollYPosition();
    if (windowPosition) {
      scrollToComponent(scrollComponentId);
    }
  };

  return (
    <Flex
      position="relative"
      overflowX="hidden"
      width="full"
      id={scrollComponentId}
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
        {/* Vote Participations */}
        <ContentContainer transparent={isMobile}>
          <VotingQuorum proposalData={proposalData} {...props} />
        </ContentContainer>
        {/* Vote Results */}
        <ContentContainer transparent={isMobile}>
          {!isMobile && <TableTitle title="Vote Results" mb={0} />}
          Vote Results Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Soluta pariatur eveniet ducimus quasi veritatis labore aut minima
          adipisci sit sed ratione laboriosam dolorum suscipit tenetur
          reiciendis voluptatum, aliquid quam ullam!
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
                  onClick={() => toggleDisclosure(validatorVoteDisclosure)}
                  rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
                  isDisabled={!answers?.validator.total}
                >
                  {isMobile ? "View" : "View Details"}
                </Button>
              </Flex>
              {!isNull(proposalData?.resolvedHeight) && (
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
                onViewMore={
                  isMobile
                    ? () => validatorVoteDisclosure.onToggle()
                    : undefined
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
                  onClick={() => toggleDisclosure(allVoteDisclosure)}
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
                  isMobile ? () => allVoteDisclosure.onToggle() : undefined
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
