import { Box, Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  Answer,
  MobileCardTemplate,
  MobileLabel,
  StatusChip,
} from "lib/components/table";
import { ProposalTextCell } from "lib/components/table/proposals/ProposalTextCell";
import type { ValidatorVotedProposalsResponseItem } from "lib/services/types";
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
      middleContent={
        <Flex gap={3} direction="column">
          <ProposalTextCell
            isExpedited={votedProposal.isExpedited}
            title={votedProposal.title}
            types={votedProposal.types}
            isDepositOrVoting={isDepositOrVoting}
          />
          <Box>
            <Flex alignItems="center" gap={3}>
              <Text variant="body2" color="text.dark">
                Voted
              </Text>
              <Answer
                abstain={votedProposal.abstain}
                yes={votedProposal.yes}
                isVoteWeighted={votedProposal.isVoteWeighted}
                no={votedProposal.no}
                noWithVeto={votedProposal.noWithVeto}
              />
              <Text variant="body2" color="text.dark">
                On
              </Text>
            </Flex>
            {votedProposal.timestamp ? (
              <Box>
                <Text variant="body2" color="text.dark">
                  {formatUTC(votedProposal.timestamp)}
                </Text>
                <Text variant="body3" color="text.disabled">
                  {`(${dateFromNow(votedProposal.timestamp)})`}
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
      onClick={() => onRowSelect(votedProposal.proposalId)}
      topContent={
        <>
          <Flex alignItems="center" gap={2}>
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              type="proposal_id"
              value={votedProposal.proposalId.toString()}
              ampCopierSection="proposal-list"
              showCopyOnHover
            />
          </Flex>
          <StatusChip status={votedProposal.status} />
        </>
      }
    />
  );
};
