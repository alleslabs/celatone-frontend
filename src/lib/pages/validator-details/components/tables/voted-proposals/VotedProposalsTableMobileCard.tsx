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
      onClick={() => onRowSelect(votedProposal.proposalId)}
      topContent={
        <>
          <Flex gap={2} alignItems="center">
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              type="proposal_id"
              value={votedProposal.proposalId.toString()}
              showCopyOnHover
              ampCopierSection="proposal-list"
            />
          </Flex>
          <StatusChip status={votedProposal.status} />
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <ProposalTextCell
            title={votedProposal.title}
            types={votedProposal.types}
            isExpedited={votedProposal.isExpedited}
            isEmergency={votedProposal.isEmergency}
            isDepositOrVoting={isDepositOrVoting}
          />
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
    />
  );
};
