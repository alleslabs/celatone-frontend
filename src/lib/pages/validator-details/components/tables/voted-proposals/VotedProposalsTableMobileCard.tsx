import type { ValidatorVotedProposalsResponseItem } from "lib/services/types";

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
        <Flex direction="column" gap={3}>
          <ProposalTextCell
            isDepositOrVoting={isDepositOrVoting}
            isEmergency={votedProposal.isEmergency}
            isExpedited={votedProposal.isExpedited}
            title={votedProposal.title}
            types={votedProposal.types}
          />
          <Box>
            <Flex alignItems="center" gap={3}>
              <Text color="text.dark" variant="body2">
                Voted
              </Text>
              <Answer
                abstain={votedProposal.abstain}
                isVoteWeighted={votedProposal.isVoteWeighted}
                no={votedProposal.no}
                noWithVeto={votedProposal.noWithVeto}
                yes={votedProposal.yes}
              />
              <Text color="text.dark" variant="body2">
                On
              </Text>
            </Flex>
            {votedProposal.timestamp ? (
              <Box>
                <Text color="text.dark" variant="body2">
                  {formatUTC(votedProposal.timestamp)}
                </Text>
                <Text color="text.disabled" variant="body3">
                  {`(${dateFromNow(votedProposal.timestamp)})`}
                </Text>
              </Box>
            ) : (
              <Text color="text.dark" variant="body2">
                -
              </Text>
            )}
          </Box>
        </Flex>
      }
      topContent={
        <>
          <Flex alignItems="center" gap={2}>
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              ampCopierSection="proposal-list"
              showCopyOnHover
              type="proposal_id"
              value={votedProposal.proposalId.toString()}
            />
          </Flex>
          <StatusChip status={votedProposal.status} />
        </>
      }
      onClick={() => onRowSelect(votedProposal.proposalId)}
    />
  );
};
