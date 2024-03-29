import { Box, Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer, MobileCardTemplate, StatusChip } from "lib/components/table";
import { ProposalTextCell } from "lib/components/table/proposals/ProposalTextCell";
import type { ValidatorVotedProposalsResponseItem } from "lib/services/validator";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface VotedProposalsTableMobileCardProps {
  votedProposal: ValidatorVotedProposalsResponseItem;
}

export const VotedProposalsTableMobileCard = ({
  votedProposal,
}: VotedProposalsTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (proposalId: number) =>
    navigate({
      pathname: "/proposals/[proposalId]",
      query: { proposalId },
    });

  const isDepositOrVoting =
    votedProposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    votedProposal.status === ProposalStatus.VOTING_PERIOD;

  return (
    <MobileCardTemplate
      onClick={() => onRowSelect(votedProposal.id)}
      topContent={
        <Flex justify="space-between" w="100%">
          <Flex gap={3} alignItems="center">
            <Text variant="body2" color="text.dark">
              Proposal ID
            </Text>
            <ExplorerLink
              type="proposal_id"
              value={votedProposal.id.toString()}
              showCopyOnHover
              ampCopierSection="proposal-list"
            />
          </Flex>
          <StatusChip status={votedProposal.status} />
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Box>
            <Text variant="body2" color="text.dark">
              Proposal Title
            </Text>
            <ProposalTextCell
              title={votedProposal.title}
              types={votedProposal.types}
              isExpedited={votedProposal.isExpedited}
              isDepositOrVoting={isDepositOrVoting}
            />
          </Box>
          <Box>
            <Flex alignItems="center" gap={3}>
              <Text variant="body2" color="text.dark">
                Voted
              </Text>
              <Answer
                isVoteWeighted={votedProposal.isVoteWeighted}
                yes={votedProposal.yes}
                no={votedProposal.no}
                noWithVeto={votedProposal.noWithVeto}
                abstain={votedProposal.abstain}
              />
              <Text variant="body2" color="text.dark">
                On
              </Text>
            </Flex>
            {votedProposal.votingEndTime ? (
              <Box>
                <Text variant="body2" color="text.dark">
                  {formatUTC(votedProposal.votingEndTime)}
                </Text>
                <Text variant="body3" color="text.disabled">
                  {`(${dateFromNow(votedProposal.votingEndTime)})`}
                </Text>
              </Box>
            ) : (
              <Text variant="body2" color="text.dark">
                -
              </Text>
            )}
          </Box>
        </Flex>
      }
    />
  );
};
